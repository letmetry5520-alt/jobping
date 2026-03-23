"use client";

import { useMemo } from "react";
import { mockJobs } from "@/lib/mockData";
import { Filters } from "@/lib/types";
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

  const filteredJobs = useMemo(() => {
    const include = splitKeywords(filters.includeKeywords);
    const exclude = splitKeywords(filters.excludeKeywords);

    return mockJobs
      .filter((job) => {
        const text = (job.title + " " + job.description).toLowerCase();
        if (exclude.some((kw) => text.includes(kw))) return false;
        return true;
      })
      .map((job) => {
        const text = (job.title + " " + job.description).toLowerCase();
        const boost = include.filter((kw) => text.includes(kw)).length;
        return { ...job, matchScore: Math.min(100, job.matchScore + boost * 5) };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [filters]);

  return (
    <main className="max-w-3xl mx-auto px-4 py-6 pb-24 md:pb-8 md:pt-24 flex flex-col gap-6">
      {/* Hero */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          ⚡ Job Feed
        </h1>
        <p className="text-gray-400 text-sm">
          {filteredJobs.length} matching job{filteredJobs.length !== 1 ? "s" : ""} · mock data
        </p>
      </div>

      {/* Filters */}
      <FiltersPanel filters={filters} onChange={setFilters} />

      {/* Job Feed */}
      <section className="flex flex-col gap-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-medium">No matching jobs</p>
            <p className="text-sm mt-1">Try adjusting your exclude keywords.</p>
          </div>
        ) : (
          filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
        )}
      </section>
    </main>
  );
}
