"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/employer/profile", label: "Employers" },
  { href: "/employer/jobs", label: "Job Posts" },
  { href: "/employer/applications", label: "Applications" },
  { href: "/employer/talent", label: "Talent" },
];

const navItem = "block rounded-lg px-4 py-3 text-sm font-medium transition-colors";

export default function Sidebar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <aside className="bg-gray-950 text-white md:min-h-screen md:w-64" aria-label="Primary navigation">
      <div className="flex items-center justify-between p-6">
        <div>
          <h1 className="text-2xl font-bold">Flowpilot</h1>
          <p className="text-xs text-gray-400">Hiring OS</p>
        </div>
        <button
          type="button"
          className="rounded-lg border border-gray-700 px-3 py-2 text-sm font-medium md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          Menu
        </button>
      </div>
      <nav aria-label="Main menu" className={`px-4 pb-4 ${menuOpen ? "block" : "hidden"} md:block`}>
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`${navItem} ${isActive ? "bg-green-600 text-white shadow-sm" : "text-gray-300 hover:bg-gray-800 hover:text-white"}`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
