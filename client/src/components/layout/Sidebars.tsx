import {
  LayoutDashboard,
  Upload,
  FileText,
  User,
  ClipboardCheck,
} from "lucide-react";

import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkClass =
    "flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition";

  return (
    <aside className="w-72 bg-slate-900 text-white p-5">
      <h1 className="text-2xl font-bold mb-10">DocSign</h1>

      <nav className="space-y-2">
        <NavLink to="/dashboard" className={linkClass}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink to="/upload" className={linkClass}>
          <Upload size={20} />
          Upload
        </NavLink>

        <NavLink to="/documents" className={linkClass}>
          <FileText size={20} />
          Documents
        </NavLink>

        <NavLink to="/profile" className={linkClass}>
          <User size={20} />
          Profile
        </NavLink>
        <NavLink to="/assigned" className={linkClass}>
          <ClipboardCheck size={20} />
          Assigned Documents
        </NavLink>
      </nav>
    </aside>
  );
}
