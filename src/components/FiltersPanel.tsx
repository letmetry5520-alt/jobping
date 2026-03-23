"use client";

import { Filters } from "@/lib/types";

interface FiltersPanelProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

function FilterInput({
  label,
  placeholder,
  value,
  onChange,
  hint,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
      />
      {hint && <p className="text-xs text-gray-600">{hint}</p>}
    </div>
  );
}

export default function FiltersPanel({ filters, onChange }: FiltersPanelProps) {
  const update = (key: keyof Filters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-4">
      <h2 className="text-white font-semibold text-base">🎯 Filters</h2>
      <FilterInput
        label="Include Keywords"
        placeholder="e.g. React, Next.js, TypeScript"
        value={filters.includeKeywords}
        onChange={(v) => update("includeKeywords", v)}
        hint="Comma-separated. Jobs containing any of these will be boosted."
      />
      <FilterInput
        label="Exclude Keywords"
        placeholder="e.g. WordPress, PHP, Wix"
        value={filters.excludeKeywords}
        onChange={(v) => update("excludeKeywords", v)}
        hint="Comma-separated. Jobs containing these will be hidden."
      />
      <FilterInput
        label="Watched Job Titles"
        placeholder="e.g. Senior Developer, Full Stack Engineer"
        value={filters.watchedTitles}
        onChange={(v) => update("watchedTitles", v)}
        hint="Comma-separated. Highlight jobs matching these titles."
      />
      <p className="text-xs text-gray-600">Filters are saved automatically to your browser.</p>
    </div>
  );
}
