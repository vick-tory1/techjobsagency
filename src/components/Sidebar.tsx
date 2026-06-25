import { useState } from "react";
import { NavLink } from "react-router-dom";

const navItem =
  "block rounded-lg px-4 py-3 transition-colors";

export default function Sidebar() {
  const [menuOpen, setMenuOpen] =
    useState(false);

  return (
    <aside
      className="
        bg-slate-950
        text-white
        md:w-64
        md:min-h-screen
      "
      aria-label="Primary navigation"
    >
      <div
        className="
          flex
          items-center
          justify-between
          p-6
        "
      >
        <h1 className="text-3xl font-bold">
          FlowPilot
        </h1>

        <button
          type="button"
          className="
            rounded-lg
            p-2
            text-2xl
            md:hidden
          "
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      <nav
        aria-label="Main menu"
        className={`px-4 pb-4 ${
          menuOpen ? "block" : "hidden"
        } md:block`}
      >
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/"
              end
              onClick={() =>
                setMenuOpen(false)
              }
              className={({ isActive }) =>
                `${navItem} ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-800"
                }`
              }
            >
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/clients"
              onClick={() =>
                setMenuOpen(false)
              }
              className={({ isActive }) =>
                `${navItem} ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-800"
                }`
              }
            >
              Clients
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/projects"
              onClick={() =>
                setMenuOpen(false)
              }
              className={({ isActive }) =>
                `${navItem} ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-800"
                }`
              }
            >
              Projects
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/tasks"
              onClick={() =>
                setMenuOpen(false)
              }
              className={({ isActive }) =>
                `${navItem} ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-800"
                }`
              }
            >
              Tasks
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/team"
              onClick={() =>
                setMenuOpen(false)
              }
              className={({ isActive }) =>
                `${navItem} ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-800"
                }`
              }
            >
              Team
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}