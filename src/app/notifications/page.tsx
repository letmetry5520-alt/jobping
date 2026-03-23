"use client";

import { useState } from "react";

interface NotifSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const defaultSettings: NotifSetting[] = [
  {
    id: "new_job_match",
    label: "New Job Matches",
    description: "Notify when a new job matches your include keywords.",
    enabled: true,
  },
  {
    id: "high_score",
    label: "High Match Score",
    description: "Alert when a job scores 80% or higher on your filters.",
    enabled: true,
  },
  {
    id: "payment_verified",
    label: "Payment Verified Only",
    description: "Only ping for jobs with a verified payment method.",
    enabled: false,
  },
  {
    id: "watched_title",
    label: "Watched Title Match",
    description: "Notify when a job title matches your watched titles list.",
    enabled: true,
  },
];

export default function NotificationsPage() {
  const [settings, setSettings] = useState(defaultSettings);

  const toggle = (id: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-6 pb-24 md:pb-8 md:pt-24 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">🔔 Notifications</h1>
        <p className="text-gray-400 text-sm mt-1">Configure alert preferences · UI preview only</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl divide-y divide-gray-800">
        {settings.map((setting) => (
          <div key={setting.id} className="flex items-start justify-between gap-4 p-5">
            <div className="flex flex-col gap-0.5">
              <p className="text-white text-sm font-medium">{setting.label}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{setting.description}</p>
            </div>
            {/* Toggle */}
            <button
              onClick={() => toggle(setting.id)}
              aria-label={`Toggle ${setting.label}`}
              className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                setting.enabled ? "bg-violet-600" : "bg-gray-700"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                  setting.enabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 text-xs text-amber-400/80">
        <p>⚠️ Notification functionality requires a real Upwork API connection. This is a UI scaffold only.</p>
      </div>
    </main>
  );
}
