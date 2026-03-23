"use client";

import { Job } from "@/lib/types";

function MatchBadge({ score }: { score: number }) {
  let color = "bg-gray-700 text-gray-300";
  if (score >= 80) color = "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
  else if (score >= 50) color = "bg-amber-500/20 text-amber-400 border border-amber-500/30";
  else color = "bg-red-500/20 text-red-400 border border-red-500/30";

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      ★ {score}%
    </span>
  );
}

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <div className="group bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-3 hover:border-violet-500/40 hover:bg-gray-900/80 transition-all duration-200 shadow-md">
      {/* Header Row */}
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-white font-semibold text-base leading-snug group-hover:text-violet-300 transition-colors">
          {job.title}
        </h2>
        <MatchBadge score={job.matchScore} />
      </div>

      {/* Description */}
      <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">{job.description}</p>

      {/* Meta Row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span>🕐</span> {job.postedTime}
        </span>
        <span className="flex items-center gap-1">
          <span>💰</span> {job.budget}
        </span>
        <span className="flex items-center gap-1">
          <span>📄</span> {job.proposalCount} proposals
        </span>
        <span
          className={`flex items-center gap-1 font-medium ${
            job.paymentVerified ? "text-emerald-400" : "text-gray-600"
          }`}
        >
          <span>{job.paymentVerified ? "✔" : "✖"}</span> Payment {job.paymentVerified ? "verified" : "unverified"}
        </span>
      </div>

      {/* Action */}
      <a
        href={job.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 self-start inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all duration-150 active:scale-95"
      >
        Open Job ↗
      </a>
    </div>
  );
}
