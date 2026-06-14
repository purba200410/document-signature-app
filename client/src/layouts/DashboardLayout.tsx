import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebars";
import Navbar from "../components/layout/Navbar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}