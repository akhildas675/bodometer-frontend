import { NavLink, useNavigate } from "react-router-dom";
import { sidebarConfig, type SidebarRole } from "../../../config/sidebar.config";
import { useAuthStore } from "../../../stores/auth.store";
import authInitService from "../../../services/auth/auth-init.service"; // Import the service
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  role: SidebarRole;
};

const Sidebar = ({ role }: Props) => {
  const menuItems = sidebarConfig[role];
  const navigator = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

 const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      
      const loadingToast = toast.loading("Logging out...");

      await authInitService.logout();

   
      toast.dismiss(loadingToast);
      toast.success("Logged out successfully!");
      setTimeout(() => {
        navigator("/login", { replace: true });
      }, 500);
    } catch (error) {
      console.error("Logout error:", error);
      
      
      useAuthStore.getState().clearAuth();
      
      toast.error("Logout failed, but you've been signed out locally");
      
      setTimeout(() => {
        navigator("/login", { replace: true });
      }, 500);
    } finally {
      setIsLoggingOut(false);
      
    }
  };


  return (
    <aside className="w-64 min-h-screen bg-linear-to-b from-[#03000D] to-[#190473] rounded-r-[40px] p-6 text-white flex flex-col justify-between">
      <div>
        {/* LOGO */}
        <div className="text-2xl font-bold text-sky-400 mb-10">
          <img
            src="/public/Bodometer Logo corrected 1.png"
            alt="Bodometer Logo"
            className="h-8 w-auto object-contain drop-shadow-lg"
          />
        </div>

        {/* PROFILE PLACEHOLDER */}
        <div className="flex flex-col items-center mb-10">
          <div className="h-20 w-20 rounded-full bg-purple-600 flex items-center justify-center text-2xl font-bold">
            {role.charAt(0).toUpperCase()}
          </div>
          <h3 className="mt-3 font-semibold capitalize">{role}</h3>
        </div>

        {/* NAV */}
        <nav className="space-y-3 text-sm">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition ${
                  isActive ? "bg-purple-600" : "hover:bg-white/10"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* LOGOUT */}
      <button
        className="w-full py-2 rounded-lg bg-red-600/80 hover:bg-red-600 transition text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? "Logging out..." : "Logout"}
      </button>
    </aside>
  );
};

export default Sidebar;