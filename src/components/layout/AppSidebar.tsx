import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { sidebarConfig, type SidebarRole, type SidebarItem } from "@/config/sidebar.config";
import { useAuthStore } from "@/stores/auth.store";
import authInitService from "@/features/auth/services/auth-init.service";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { parseApiError } from "@/infrastructure/api/api-error";
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
  LogIn,
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
  Bell,
  Salad,
  ClipboardList,
  Calculator,
  X,
  Menu,
} from "lucide-react";
import { useNotificationStore } from "@/features/notification/stores/notification.store";
import { logoIcon, textLogo } from "@/assets/image-path";

type Props = {
  role: SidebarRole;
};

const iconMap: Record<string, React.ReactNode> = {
  "/admin": <LayoutDashboard size={18} />,
  "/admin/users": <Users size={18} />,
  "/admin/trainers": <UserCheck size={18} />,
  "/admin/appointments": <Calendar size={18} />,
  // "/admin/bookings": <Calendar size={18} />,
  "/admin/category": <Tag size={18} />,
  "/admin/subscription": <CreditCard size={18} />,
  "/admin/subscription/plans": <CreditCard size={18} />,
  "/admin/subscription/features": <Sparkles size={18} />,
  "/admin/subscription/transactions": <Receipt size={18} />,
  "/admin/questions": <MessageCircleQuestion size={18} />,
  "/admin/questions/groups": <Layers size={18} />,
  "/admin/questions/list": <List size={18} />,
  "/admin/workouts": <Activity size={18} />,
  "/admin/exercises": <BicepsFlexed size={18} />,
  "/admin/equipment": <DumbbellIcon size={18} />,
  "/admin/target-muscles": <PersonStanding size={18} />,
  "/admin/notifications": <Bell size={18} />,
  "/admin/finance": <DollarSign size={18} />,

  "/trainer": <LayoutDashboard size={18} />,
  "/trainer/availability": <Calendar size={18} />,
  "/trainer/clients": <Users size={18} />,
  "/trainer/messages": <MessageSquare size={18} />,
  "/trainer/slots": <Clock size={18} />,
  "/trainer/earnings": <DollarSign size={18} />,
  "/trainer/notifications": <Bell size={18} />,
  "/trainer/profile": <UserCircle size={18} />,

  "/": <LayoutDashboard size={18} />,
  "/fitness-profile": <Heart size={18} />,
  "/exercises": <Dumbbell size={18} />,
  "/generate-workout": <Sparkles size={18} />,
  "/workout-plans": <ClipboardList size={18} />,
  "/diet-plans": <Salad size={18} />,
  "/trainers": <Users size={18} />,
  "/messages": <MessageSquare size={18} />,
  "/my-bookings": <Calendar size={18} />,
  "/bmi": <Calculator size={18} />,
  "/food-log": <Apple size={18} />,
  "/health-progress": <Activity size={18} />,
  "/progress": <TrendingUp size={18} />,
  "/notifications": <Bell size={18} />,
  "/profile": <UserCircle size={18} />,
};


const CollapsedActiveDot = ({ show, isMobileOpen }: { show: boolean; isMobileOpen: boolean }) => {
  if (!show || isMobileOpen) return null;
  return (
    <div className="flex justify-center mt-1">
      <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_6px_rgba(232,121,249,0.8)]" />
    </div>
  );
};


const NavGroup = ({
  item,
  isExpanded,
  isMobileOpen,
}: {
  item: SidebarItem;
  isExpanded: boolean;
  isMobileOpen: boolean;
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
        className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
          isChildActive
            ? "bg-purple-500/15 text-white"
            : "text-slate-400 hover:bg-white/5 hover:text-white"
        }`}
        title={(!isExpanded && !isMobileOpen) ? item.label : ""}
      >
        <span
          className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
            isChildActive
              ? "bg-purple-600/30 text-purple-300"
              : "text-slate-500 group-hover:text-purple-300"
          }`}
        >
          {iconMap[item.path] || <LayoutDashboard size={18} />}
        </span>

        {isExpanded && (
          <>
            <span className="flex-1 text-left whitespace-nowrap text-sm font-medium">
              {item.label}
            </span>
            <ChevronRight
              size={15}
              className={`shrink-0 text-slate-500 transition-transform duration-200 ${
                open ? "rotate-90 text-purple-300" : ""
              }`}
            />
          </>
        )}
      </button>

      {/* children — visible when sidebar expanded AND group open */}
      {isExpanded && open && (
        <div className="mt-1 ml-6 pl-3 border-l border-purple-500/20 flex flex-col gap-1">
          {item.children!.map((child) => (
            <NavLink
              key={child.path}
              to={child.path}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-[0_4px_14px_rgba(147,51,234,0.35)]"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
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
      <CollapsedActiveDot show={!isExpanded && isChildActive} isMobileOpen={isMobileOpen} />
    </div>
  );
};


const Sidebar = ({ role }: Props) => {
  const menuItems = sidebarConfig[role];
  const navigator = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const fetchUnreadCount = useNotificationStore((state) => state.fetchUnreadCount);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
    }
  }, [user, fetchUnreadCount]);

  // Close mobile drawer on route change
  const location = useLocation();
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

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

  const displayName = user?.name || (isAuthenticated ? role : "Guest");
  const displayEmail = user?.email || "";

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile toggle button - only visible on mobile when sidebar is closed */}
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed bottom-4 left-4 z-30 w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white flex items-center justify-center shadow-lg shadow-purple-900/50 hover:scale-105 transition"
        aria-label="Open sidebar"
      >
        <Menu size={20} />
      </button>

      <aside
        className={`${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 ${
          isExpanded ? "w-64" : "w-20"
        } fixed md:relative left-0 top-0 h-full min-h-0 shrink-0 bg-[#0b0616]/95 backdrop-blur-xl border-r border-purple-500/10 p-4 text-white flex flex-col transition-all duration-300 ease-in-out z-50 overflow-y-auto`}
        onMouseEnter={() => !isMobileOpen && setIsExpanded(true)}
        onMouseLeave={() => !isMobileOpen && setIsExpanded(false)}
      >
      <div>
        {/* Mobile close button */}
        <button
          type="button"
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden mb-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
          aria-label="Close sidebar"
        >
          <X size={16} />
        </button>

        {/* LOGO */}
        <div className="mb-6 flex items-center justify-center h-12">
          {isExpanded ? (
            <img
              src={textLogo}
              alt="Bodometer Logo"
              className="h-8 w-auto object-contain drop-shadow-lg transition-opacity duration-300"
            />
          ) : (
           <img
              src={logoIcon}
              alt="Bodometer Logo"
              className="h-8 w-auto object-contain drop-shadow-lg transition-opacity duration-300"
            />
          )}
        </div>

        {/* PROFILE */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-600 via-fuchsia-600 to-purple-700 flex items-center justify-center text-lg font-bold ring-2 ring-purple-500/40 shadow-[0_0_16px_rgba(147,51,234,0.4)]">
              {displayName.charAt(0).toUpperCase()}
            </div>
            {isAuthenticated && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-[10px] font-bold flex items-center justify-center shadow">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
          {isExpanded && (
            <div className="mt-3 text-center transition-all duration-300">
              <h3 className="font-semibold text-sm truncate max-w-[200px]">
                {displayName}
              </h3>
              <p className="text-xs text-slate-400 truncate max-w-[200px]">
                {displayEmail}
              </p>
              {!isAuthenticated && (
                <p className="text-[10px] uppercase tracking-wider text-fuchsia-400/80 mt-1">
                  Guest session
                </p>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-purple-500/10 mb-4" />

        {/* NAVIGATION */}
        <nav className="space-y-1">
          {isExpanded && (
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Menu
            </p>
          )}
          {menuItems.map((item) => {
            const isNotifItem =
              item.path.includes("notifications") ||
              item.label.toLowerCase() === "notifications";

            return item.children ? (
              <NavGroup key={item.path} item={item} isExpanded={isExpanded} isMobileOpen={isMobileOpen} />
            ) : (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin" || item.path === "/" || item.path === "/trainer"}
                className="w-full block"
                title={(!isExpanded && !isMobileOpen) ? item.label : ""}
              >
                {({ isActive }) => (
                  <div className="w-full">
                    <div
                      className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative ${
                        isActive
                          ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-[0_6px_18px_rgba(147,51,234,0.4)]"
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-white/90" />
                      )}
                      <span
                        className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                          isActive
                            ? "bg-white/15 text-white"
                            : "text-slate-500 group-hover:text-purple-300"
                        }`}
                      >
                        {iconMap[item.path] || <LayoutDashboard size={18} />}
                        {isNotifItem && unreadCount > 0 && (
                          <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-0.5 rounded-full bg-rose-500 text-[9px] font-bold flex items-center justify-center">
                            {unreadCount > 9 ? "9+" : unreadCount}
                          </span>
                        )}
                      </span>
                      {isExpanded && (
                        <div className="flex items-center justify-between w-full min-w-0">
                          <span className="whitespace-nowrap text-sm font-medium transition-opacity duration-300">
                            {item.label}
                          </span>
                          {isNotifItem && unreadCount > 0 && (
                            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse ml-2" />
                          )}
                        </div>
                      )}
                    </div>
                    {/* collapsed hint — tiny dot when active */}
                    <CollapsedActiveDot show={!isExpanded && isActive} isMobileOpen={isMobileOpen} />
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM ACTION */}
      {isAuthenticated ? (
        <button
          className={`w-full py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-200 text-sm font-semibold text-red-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
            isExpanded ? "" : "px-0"
          }`}
          onClick={handleLogout}
          disabled={isLoggingOut}
          title={(!isExpanded && !isMobileOpen) ? "Logout" : ""}
        >
          <LogOut size={16} />
          {isExpanded && (
            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
          )}
        </button>
      ) : (
        <button
          className={`w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 transition-all duration-200 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(147,51,234,0.4)] hover:shadow-[0_6px_24px_rgba(217,70,239,0.5)] flex items-center justify-center gap-2 ${
            isExpanded ? "" : "px-0"
          }`}
          onClick={() => navigator("/login")}
          title={(!isExpanded && !isMobileOpen) ? "Login" : ""}
        >
          <LogIn size={16} />
          {isExpanded && <span>Login</span>}
        </button>
      )}

    </aside>
    </>
  );
};

export default Sidebar;
