import { useState } from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard", end: true },
  { to: "/clients", label: "Employers" },
  { to: "/projects", label: "Job Posts" },
  { to: "/tasks", label: "Applications" },
  { to: "/team", label: "Recruiters" },
];

const navItem = "block rounded-lg px-4 py-3 text-sm font-medium transition-colors";

export default function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <aside className="bg-gray-950 text-white md:min-h-screen md:w-64" aria-label="Primary navigation">
      <div className="flex items-center justify-between p-6">
        <div>
          <h1 className="text-2xl font-bold">JobBoard Pro</h1>
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
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `${navItem} ${
                    isActive
                      ? "bg-green-600 text-white shadow-sm"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
