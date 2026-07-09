import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { sidebarConfig, type SidebarRole, type SidebarItem } from "@/config/sidebar.config";
import { useAuthStore } from "@/stores/auth.store";
import authInitService from "@/modules/auth/service/auth-init.service";
import { useState } from "react";
import { toast } from "sonner";
import { parseApiError } from "@/api/error.helper";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  MessageSquare,
  Clock,
  DollarSign,
  UserCircle,
  Apple,
  TrendingUp,
  LogOut,
  ChevronRight,
  Layers,
  Tag,
  Sparkles,
  Heart,
  List,
  CreditCard,
  Dumbbell,
  MessageCircleQuestion,
  Activity,
  PersonStanding,
  Receipt,
  BicepsFlexed,
  DumbbellIcon,
} from "lucide-react";

type Props = {
  role: SidebarRole;
};

const iconMap: Record<string, React.ReactNode> = {
  "/admin": <LayoutDashboard size={20} />,
  "/admin/users": <Users size={20} />,
  "/admin/trainers": <UserCheck size={20} />,
  "/admin/appointments": <Calendar size={20} />,
  "/admin/bookings": <Calendar size={20} />,
  "/admin/category": <Tag size={20} />,
  "/admin/subscription": <CreditCard size={20} />,
  "/admin/subscription/plans": <CreditCard size={20} />,
  "/admin/subscription/features": <Sparkles size={20} />,
  "/admin/subscription/transactions": <Receipt size={20} />,
  "/admin/questions": <MessageCircleQuestion size={20} />,
  "/admin/questions/groups": <Layers size={20} />,
  "/admin/questions/list": <List size={20} />,
  "/admin/workouts": <Activity size={20} />,
  "/admin/exercises": <BicepsFlexed size={20} />,
  "/admin/equipment": <DumbbellIcon size={20} />,
  "/admin/target-muscles": <PersonStanding size={20} />,

  "/trainer": <LayoutDashboard size={20} />,
  "/trainer/bookings": <Calendar size={20} />,
  "/trainer/clients": <Users size={20} />,
  "/trainer/messages": <MessageSquare size={20} />,
  "/trainer/slots": <Clock size={20} />,
  "/trainer/earnings": <DollarSign size={20} />,
  "/trainer/profile": <UserCircle size={20} />,

  "/": <LayoutDashboard size={20} />,
  "/fitness-profile": <Heart size={20} />,
  "/exercises": <Dumbbell size={20} />,
  "/generate-workout": <Sparkles size={20} />,
  "/trainers": <Users size={20} />,
  "/my-bookings": <Calendar size={20} />,
  "/food-log": <Apple size={20} />,
  "/health-progress": <Activity size={20} />,
  "/progress": <TrendingUp size={20} />,
  "/profile": <UserCircle size={20} />,
};


const CollapsedActiveDot = ({ show }: { show: boolean }) => {
  if (!show) return null;
  return (
    <div className="flex justify-center mt-1">
      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
    </div>
  );
};


const NavGroup = ({
  item,
  isExpanded,
}: {
  item: SidebarItem;
  isExpanded: boolean;
}) => {
  const location = useLocation();

  const isChildActive = !!item.children?.some((c) =>
    location.pathname.startsWith(c.path)
  );

  const [open, setOpen] = useState(!!isChildActive);

  return (
    <div>
      {/* parent row */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
          isChildActive
            ? "bg-purple-600/30 text-white"
            : "hover:bg-white/10 text-slate-300"
        }`}
        title={!isExpanded ? item.label : ""}
      >
        <span className="shrink-0">
          {iconMap[item.path] || <LayoutDashboard size={20} />}
        </span>

        {isExpanded && (
          <>
            <span className="flex-1 text-left whitespace-nowrap text-sm">
              {item.label}
            </span>
            <ChevronRight
              size={15}
              className={`shrink-0 transition-transform duration-200 ${
                open ? "rotate-90" : ""
              }`}
            />
          </>
        )}
      </button>

      {/* children — visible when sidebar expanded AND group open */}
      {isExpanded && open && (
        <div className="mt-1 ml-3 pl-3 border-l border-purple-700/50 flex flex-col gap-1">
          {item.children!.map((child) => (
            <NavLink
              key={child.path}
              to={child.path}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                  isActive
                    ? "bg-purple-600 text-white"
                    : "hover:bg-white/10 text-slate-400 hover:text-slate-200"
                }`
              }
            >
              <span className="shrink-0">
                {iconMap[child.path] || <LayoutDashboard size={16} />}
              </span>
              <span className="whitespace-nowrap">{child.label}</span>
            </NavLink>
          ))}
        </div>
      )}

      {/* collapsed hint — tiny dot when active */}
      <CollapsedActiveDot show={!isExpanded && isChildActive} />
    </div>
  );
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
      const res = await authInitService.logout();
      toast.dismiss(loadingToast);
      toast.success(res.message);
      setTimeout(() => {
        navigator("/", { replace: true });
        setTimeout(() => {
          useAuthStore.getState().clearAuth();
        }, 150);
      }, 1500);
    } catch (error: unknown) {
      console.error("Logout error:", error);
      const apiError = parseApiError(error);
      toast.error(apiError.message);
      setTimeout(() => {
        navigator("/", { replace: true });
        setTimeout(() => {
          useAuthStore.getState().clearAuth();
        }, 150);
      }, 1500);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside
      className={`${
        isExpanded ? "w-64" : "w-20"
      } min-h-screen bg-linear-to-b from-[#03000D] to-[#190473] p-4 text-white flex flex-col justify-between transition-all duration-300 ease-in-out relative group`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div>
        {/* LOGO */}
        <div className="mb-8 flex items-center justify-center h-12">
          {isExpanded ? (
            <img
              src="https://bodometer-asset.s3.eu-north-1.amazonaws.com/logo/Bodometer+Logo+corrected+1.png"
              alt="Bodometer Logo"
              className="h-8 w-auto object-contain drop-shadow-lg transition-opacity duration-300"
            />
          ) : (
           <img
              src="https://bodometer-asset.s3.eu-north-1.amazonaws.com/logo/Bodometer+Icon.png"
              alt="Bodometer Logo"
              className="h-8 w-auto object-contain drop-shadow-lg transition-opacity duration-300"
            />
          )}
        </div>

        {/* PROFILE */}
        <div className="flex flex-col items-center mb-8 overflow-hidden">
          <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center text-lg font-bold shrink-0">
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
        <nav className="space-y-1 text-sm">
          {menuItems.map((item) =>
            item.children ? (
              <NavGroup key={item.path} item={item} isExpanded={isExpanded} />
            ) : (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin" || item.path === "/" || item.path === "/trainer"}
                className="w-full block"
                title={!isExpanded ? item.label : ""}
              >
                {({ isActive }) => (
                  <div className="w-full">
                    <div
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-purple-600 text-white"
                          : "hover:bg-white/10 text-slate-300"
                      }`}
                    >
                      <span className="shrink-0">
                        {iconMap[item.path] || <LayoutDashboard size={20} />}
                      </span>
                      {isExpanded && (
                        <span className="whitespace-nowrap transition-opacity duration-300">
                          {item.label}
                        </span>
                      )}
                    </div>
                    {/* collapsed hint — tiny dot when active */}
                    <CollapsedActiveDot show={!isExpanded && isActive} />
                  </div>
                )}
              </NavLink>
            )
          )}
        </nav>
      </div>

      {/* LOGOUT */}
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

    </aside>
  );
};

export default Sidebar;