import { NavLink } from "react-router-dom";

const navItem =
  "block rounded-lg px-4 py-3 transition-colors";

export default function Sidebar() {
  return (
    <aside
      className="
        w-full
        md:w-64
        bg-slate-950
        text-white
        md:min-h-screen
      "
      aria-label="Primary navigation"
    >
      <div className="p-6">
        <h1 className="text-3xl font-bold">
          FlowPilot
        </h1>
      </div>

      <nav aria-label="Main menu">
        <ul
          className="
            flex
            flex-wrap
            gap-2
            px-4
            pb-4
            md:block
            md:space-y-2
          "
        >
          <li>
            <NavLink
              to="/"
              end
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