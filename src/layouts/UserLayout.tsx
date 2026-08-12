import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type Props = {
  children: React.ReactNode;
};

export default function UserLayout({ children }: Props) {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-gray-50 text-gray-950">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <Link to="/" className="text-2xl font-bold">
            TechHire Market
          </Link>

          <nav className="flex flex-wrap items-center gap-3 text-sm font-semibold">
            {user?.role === "job-seeker" ? (
              <NavLink to="/user/jobs" className="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">
                Search Jobs
              </NavLink>
            ) : (
              <NavLink to="/user/applicants" className="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">
                Find Applicants
              </NavLink>
            )}
            <span className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-600">
              {user?.profileImage ? (
                <img src={user.profileImage} alt={user.name} className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <span className="grid h-9 w-9 place-items-center rounded-full bg-green-600 font-bold text-white">
                  {(user?.name?.[0] ?? "U").toUpperCase()}
                </span>
              )}
              <span>
                <span className="block text-xs font-bold uppercase text-gray-500">{user?.role === "job-seeker" ? "Job seeker" : "Employer"}</span>
                <span className="block font-bold text-gray-800">{user?.name}</span>
              </span>
            </span>
            <button type="button" onClick={logout} className="rounded-lg bg-gray-950 px-4 py-2 text-white">
              Log out
            </button>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">{children}</div>
    </main>
  );
}
