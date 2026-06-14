import { Bell } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h2 className="font-semibold text-lg">
        Document Signature Platform
      </h2>

      <div className="flex items-center gap-4">
        <Bell size={20} />

        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
          P
        </div>
      </div>
    </header>
  );
}