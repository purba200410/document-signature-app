import { Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../services/api";

export default function Navbar() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await API.get("/auth/profile");
        setCurrentUser(res.data.user);
      } catch (error) {
        console.error(error);
      }
    };

    getProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h2 className="font-semibold text-lg">Document Signature Platform</h2>

      <div className="flex items-center gap-4">
        <Bell size={20} />

        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
          {currentUser?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </header>
  );
}
