import { NavLink, useNavigate } from "react-router-dom";
import { sidebarConfig, type SidebarRole } from "../../../config/sidebar.config";
import { useAuthStore } from "../../../stores/auth.store";
import authInitService from "../../../services/auth/auth-init.service";
import { useState } from "react";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  MessageSquare,
  Clock,
  DollarSign,
  UserCircle,
  Dumbbell,
  Apple,
  TrendingUp,
  CreditCard,
  LogOut,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

type Props = {
  role: SidebarRole;
};

// Icon mapping for each route
const iconMap: Record<string, React.ReactNode> = {
  // Admin
  "/admin/dashboard": <LayoutDashboard size={20} />,
  "/admin/users": <Users size={20} />,
  "/admin/trainers": <UserCheck size={20} />,
  "/admin/workouts": <Dumbbell size={20} />,
  
  // Trainer
  "/trainer/dashboard": <LayoutDashboard size={20} />,
  "/trainer/sessions": <Calendar size={20} />,
  "/trainer/clients": <Users size={20} />,
  "/trainer/messages": <MessageSquare size={20} />,
  "/trainer/slots": <Clock size={20} />,
  "/trainer/earnings": <DollarSign size={20} />,
  "/trainer/profile": <UserCircle size={20} />,
  
  // User
  "/": <LayoutDashboard size={20} />,
  "/workouts": <Dumbbell size={20} />,
  "/food-log": <Apple size={20} />,
  "/progress": <TrendingUp size={20} />,
  "/subscriptions": <CreditCard size={20} />,
  "/profile": <UserCircle size={20} />,
};

const Sidebar = ({ role }: Props) => {
  const menuItems = sidebarConfig[role];
  const navigator = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAuthStore();

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
    <aside
      className={`${
        isExpanded ? "w-64" : "w-20"
      } min-h-screen bg-gradient-to-b from-[#03000D] to-[#190473] p-4 text-white flex flex-col justify-between transition-all duration-300 ease-in-out relative`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div>
        {/* LOGO */}
        <div className="mb-8 flex items-center justify-center h-12">
          {isExpanded ? (
            <img
              src="/Bodometer Logo corrected 1.png"
              alt="Bodometer Logo"
              className="h-8 w-auto object-contain drop-shadow-lg transition-opacity duration-300"
            />
          ) : (
            <div className="h-10 w-10 rounded-lg bg-purple-600 flex items-center justify-center text-xl font-bold">
              B
            </div>
          )}
        </div>

        {/* PROFILE SECTION */}
        <div className="flex flex-col items-center mb-8 overflow-hidden">
          <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center text-lg font-bold flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() || role.charAt(0).toUpperCase()}
          </div>
          {isExpanded && (
            <div className="mt-2 text-center transition-all duration-300">
              <h3 className="font-semibold text-sm truncate max-w-[200px]">
                {user?.name || role}
              </h3>
              <p className="text-xs text-slate-400 truncate max-w-[200px]">
                {user?.email || ""}
              </p>
            </div>
          )}
        </div>

        {/* NAVIGATION */}
        <nav className="space-y-2 text-sm">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-purple-600 text-white"
                    : "hover:bg-white/10 text-slate-300"
                }`
              }
              title={!isExpanded ? item.label : ""}
            >
              <span className="flex-shrink-0">
                {iconMap[item.path] || <LayoutDashboard size={20} />}
              </span>
              {isExpanded && (
                <span className="whitespace-nowrap transition-opacity duration-300">
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* LOGOUT BUTTON */}
      <button
        className={`w-full py-3 rounded-lg bg-red-600/80 hover:bg-red-600 transition-all duration-200 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
          isExpanded ? "" : "px-0"
        }`}
        onClick={handleLogout}
        disabled={isLoggingOut}
        title={!isExpanded ? "Logout" : ""}
      >
        <LogOut size={18} />
        {isExpanded && (
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        )}
      </button>

      {/* EXPAND/COLLAPSE INDICATOR */}
      <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-purple-600 rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {isExpanded ? (
          <ChevronLeft size={16} />
        ) : (
          <ChevronRight size={16} />
        )}
      </div>
    </aside>
  );
};

export default Sidebar;