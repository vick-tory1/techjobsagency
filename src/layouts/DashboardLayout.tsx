import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />
        {children}
      </div>
    </div>
  );
}