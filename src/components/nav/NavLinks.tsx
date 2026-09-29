"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Inicio", emoji: "🏠" },
  { href: "/log", label: "Registrar", emoji: "➕" },
  { href: "/progress", label: "Progreso", emoji: "📈" },
  { href: "/summary", label: "Resumen", emoji: "🗓️" },
  { href: "/settings", label: "Ajustes", emoji: "⚙️" },
] as const;

export function TopNavLinks() {
  const pathname = usePathname();
  return (
    <nav className="hidden items-center gap-1 sm:flex">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function BottomNavLinks() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-slate-800 bg-slate-950/95 backdrop-blur sm:hidden">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium ${
              active ? "text-orange-400" : "text-slate-500"
            }`}
          >
            <span className="text-lg leading-none">{item.emoji}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
