import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({
  children,
}: Props) {
  return (
    <div className="min-h-screen md:flex">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}