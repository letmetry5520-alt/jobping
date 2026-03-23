import { NextResponse } from "next/server";
import { buildOAuthHeader } from "@/lib/upworkOAuth";
import { Job } from "@/lib/types";

const UPWORK_API_BASE = "https://www.upwork.com/api/profiles/v2/search/jobs.json";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapUpworkJob(job: any): Job {
  // Budget: fixed or hourly
  let budget = "Not specified";
  if (job.budget?.amount) {
    budget = `$${job.budget.amount}`;
  } else if (job.hourly_rate_min && job.hourly_rate_max) {
    budget = `$${job.hourly_rate_min} - $${job.hourly_rate_max}/hr`;
  } else if (job.hourly_rate_min) {
    budget = `$${job.hourly_rate_min}+/hr`;
  }

  // Posted time
  const posted = job.date_created
    ? new Date(job.date_created).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Unknown";

  // Payment verified
  const paymentVerified =
    job.buyer?.payment_verification_status === "VERIFIED" ||
    job.client?.payment_verification_status === "VERIFIED";

  // Proposal count
  const proposals =
    job.proposals_count ?? job.total_applicants ?? job.proposals ?? 0;

  // Match score: derived from relevance_score if present
  const matchScore = job.relevance_score
    ? Math.round(job.relevance_score * 100)
    : 70;

  return {
    id: job.id ?? job.ciphertext ?? String(Math.random()),
    title: job.title ?? "Untitled",
    description: job.snippet ?? job.description ?? "",
    postedTime: posted,
    budget,
    proposalCount: String(proposals),
    paymentVerified,
    matchScore: Math.min(100, matchScore),
    url: job.url ?? `https://www.upwork.com/jobs/${job.ciphertext ?? ""}`,
  };
}

export async function GET(request: Request) {
  const clientId = process.env.UPWORK_CLIENT_ID;
  const clientSecret = process.env.UPWORK_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "Upwork API credentials not configured." },
      { status: 503 }
    );
  }

  // Allow override via query param e.g. /api/jobs?q=React+Next.js
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? process.env.UPWORK_KEYWORDS ?? "React Next.js TypeScript";

  const url = new URL(UPWORK_API_BASE);
  url.searchParams.set("q", query);
  url.searchParams.set("paging", "0;20"); // first 20 results

  const authHeader = buildOAuthHeader(
    "GET",
    UPWORK_API_BASE,
    clientId,
    clientSecret
  );

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: authHeader,
      Accept: "application/json",
    },
    next: { revalidate: 120 }, // cache 2 min on Vercel
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[JobPing] Upwork API error:", res.status, text);
    return NextResponse.json(
      { error: `Upwork API returned ${res.status}`, detail: text },
      { status: res.status }
    );
  }

  const data = await res.json();

  // Upwork wraps results under data.jobs.job (array) or data.jobs (array)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw: any[] = data?.jobs?.job ?? data?.jobs ?? [];

  const jobs: Job[] = raw.map(mapUpworkJob);

  return NextResponse.json({ jobs, source: "upwork", query });
}
