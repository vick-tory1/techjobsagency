import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Navbar />

        <main className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
