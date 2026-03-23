"use client";

import { Filters } from "@/lib/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const defaultFilters: Filters = {
  includeKeywords: "",
  excludeKeywords: "",
  watchedTitles: "",
};

export default function SavedFiltersPage() {
  const [filters, setFilters] = useLocalStorage<Filters>("jobping:filters", defaultFilters);

  const hasFilters =
    filters.includeKeywords || filters.excludeKeywords || filters.watchedTitles;

  const handleClear = () => {
    setFilters(defaultFilters);
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-6 pb-24 md:pb-8 md:pt-24 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">🔖 Saved Filters</h1>
          <p className="text-gray-400 text-sm mt-1">Your locally saved filter preferences</p>
        </div>
        {hasFilters && (
          <button
            onClick={handleClear}
            className="px-3 py-1.5 rounded-xl border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-all"
          >
            Clear all
          </button>
        )}
      </div>

      {hasFilters ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-4">
          {filters.includeKeywords && (
            <FilterRow
              icon="✅"
              label="Include Keywords"
              value={filters.includeKeywords}
            />
          )}
          {filters.excludeKeywords && (
            <FilterRow
              icon="🚫"
              label="Exclude Keywords"
              value={filters.excludeKeywords}
            />
          )}
          {filters.watchedTitles && (
            <FilterRow
              icon="👁️"
              label="Watched Titles"
              value={filters.watchedTitles}
            />
          )}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-600">
          <p className="text-4xl mb-3">📂</p>
          <p className="font-medium">No saved filters yet</p>
          <p className="text-sm mt-1">
            Head to the Job Feed and set up your filters — they&apos;ll appear here automatically.
          </p>
        </div>
      )}

      <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-4 text-xs text-gray-600">
        <p>💡 Filters are stored in your browser&apos;s localStorage and persist across sessions.</p>
      </div>
    </main>
  );
}

function FilterRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  const tags = value.split(",").map((s) => s.trim()).filter(Boolean);
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
        {icon} {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
