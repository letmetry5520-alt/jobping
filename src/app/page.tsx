"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Job, Filters } from "@/lib/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import FiltersPanel from "@/components/FiltersPanel";
import JobCard from "@/components/JobCard";

const defaultFilters: Filters = {
  includeKeywords: "",
  excludeKeywords: "",
  watchedTitles: "",
};

function splitKeywords(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export default function DashboardPage() {
  const [filters, setFilters] = useLocalStorage<Filters>("jobping:filters", defaultFilters);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Pass include keywords as search query to Upwork
      const query = filters.includeKeywords || "React Next.js TypeScript";
      const res = await fetch(`/api/jobs?q=${encodeURIComponent(query)}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const data = await res.json();
      setJobs(data.jobs ?? []);
      setLastFetched(new Date().toLocaleTimeString());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  }, [filters.includeKeywords]);

  // Fetch on mount and when include keywords change
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Re-fetch every 2 minutes
  useEffect(() => {
    const interval = setInterval(fetchJobs, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchJobs]);

  // Client-side exclude filtering + sorting
  const filteredJobs = useMemo(() => {
    const exclude = splitKeywords(filters.excludeKeywords);
    return jobs
      .filter((job) => {
        if (!exclude.length) return true;
        const text = (job.title + " " + job.description).toLowerCase();
        return !exclude.some((kw) => text.includes(kw));
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [jobs, filters.excludeKeywords]);

  return (
    <main className="max-w-3xl mx-auto px-4 py-6 pb-24 md:pb-8 md:pt-24 flex flex-col gap-6">
      {/* Hero */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-white tracking-tight">⚡ Job Feed</h1>
          <p className="text-gray-400 text-sm">
            {loading
              ? "Fetching from Upwork…"
              : error
              ? "Error loading jobs"
              : `${filteredJobs.length} job${filteredJobs.length !== 1 ? "s" : ""} · live`}
          </p>
        </div>
        <button
          onClick={fetchJobs}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-700 text-gray-400 text-xs hover:border-violet-500/50 hover:text-violet-300 transition-all disabled:opacity-40"
        >
          {loading ? "↻ Loading…" : "↻ Refresh"}
        </button>
      </div>

      {/* Last fetched */}
      {lastFetched && !loading && (
        <p className="text-xs text-gray-600 -mt-4">Last updated: {lastFetched}</p>
      )}

      {/* Filters */}
      <FiltersPanel filters={filters} onChange={setFilters} />

      {/* Error state */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-sm text-red-400">
          <p className="font-medium">Could not load jobs</p>
          <p className="text-xs mt-1 text-red-400/70">{error}</p>
          <button
            onClick={fetchJobs}
            className="mt-3 px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs transition-all"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 animate-pulse">
              <div className="h-4 bg-gray-800 rounded w-3/4 mb-3" />
              <div className="h-3 bg-gray-800 rounded w-full mb-2" />
              <div className="h-3 bg-gray-800 rounded w-2/3" />
            </div>
          ))}
        </div>
      )}

      {/* Job Feed */}
      {!loading && !error && (
        <section className="flex flex-col gap-4">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-16 text-gray-600">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-medium">No matching jobs</p>
              <p className="text-sm mt-1">Try adjusting your keywords.</p>
            </div>
          ) : (
            filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
          )}
        </section>
      )}
    </main>
  );
}
