"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Feed", icon: "⚡" },
  { href: "/saved-filters", label: "Filters", icon: "🔖" },
  { href: "/notifications", label: "Alerts", icon: "🔔" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gray-950/90 backdrop-blur-lg border-t border-gray-800 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div className="max-w-3xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo — only visible on desktop */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <span className="text-white font-bold text-xl tracking-tight">JobPing</span>
        </div>
        {/* Nav Links */}
        <div className="flex-1 flex items-center justify-around md:justify-end md:gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col md:flex-row items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? "text-violet-400 bg-violet-500/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-lg md:text-base">{item.icon}</span>
                <span className={`text-xs md:text-sm ${isActive ? "text-violet-400" : ""}`}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
