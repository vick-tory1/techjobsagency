import type { ReactNode } from "react";
import type { User } from "../../lib/types";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children, user }: { children: ReactNode; user?: User | null }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-950 md:flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Navbar user={user} />
        <main className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
