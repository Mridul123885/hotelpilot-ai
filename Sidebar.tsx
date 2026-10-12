"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/reviews", label: "Review Intelligence" },
  { href: "/front-desk", label: "Front Desk Copilot" },
  { href: "/briefing", label: "Morning Briefing" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col bg-slate-900 text-slate-300">
      <div className="px-6 py-6">
        <p className="text-xl font-semibold tracking-tight text-white">
          HotelPilot <span className="text-amber-400">AI</span>
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Operations copilot for Australian hotels
        </p>
      </div>

      <nav className="flex flex-col gap-1 px-3">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-slate-800 text-white"
                  : "hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}