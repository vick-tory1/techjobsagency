import type { User } from "../../lib/types";

export default function Navbar({ user }: { user?: User | null }) {
  const displayName = user?.name ?? "Victoria";
  const initial = displayName.slice(0, 1).toUpperCase();

  return (
    <header className="border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-xl font-bold text-gray-950 sm:text-2xl">Flowpilot workspace</h2>
          <p className="text-sm text-gray-500">Live hiring, job search, applications, and talent marketplace activity</p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="text-right">
            <p className="font-medium">{displayName}</p>
            <p className="text-sm text-gray-500">{user?.roles?.[0] ? `${user.roles[0]} account` : "Marketplace admin"}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 font-bold text-white shadow-sm">{initial}</div>
        </div>
      </div>
    </header>
  );
}
