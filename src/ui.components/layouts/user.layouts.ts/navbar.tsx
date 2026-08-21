import { useEffect } from "react";
import { FaPaperPlane, FaBell, FaUserCircle } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { useNotificationStore } from "@/stores/notification.store";

const Navbar = () => {
  const navigator = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const fetchUnreadCount = useNotificationStore((state) => state.fetchUnreadCount);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
    }
  }, [isAuthenticated, fetchUnreadCount]);

  return (
    <nav className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 w-[92%] max-w-6xl mx-auto flex items-center justify-between py-3 px-8 rounded-full border border-purple-500/30 shadow-2xl backdrop-blur-xl bg-[#140c3c]/85 text-white transition-all duration-300">
      {/* Logo (Left) */}
      <div
        className="flex items-center space-x-3 cursor-pointer shrink-0 pr-6"
        onClick={() => navigator("/")}
      >
        <img
          src="/Bodometer Logo corrected 1.png"
          alt="bodometer logo"
          className="h-8 w-auto object-contain"
        />
      </div>

      {/* Menu Navigation Links (Center) */}
      <div className="flex items-center space-x-6 sm:space-x-8 text-sm font-medium text-slate-300">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer hover:text-white ${
              isActive
                ? "text-white font-bold bg-white/10 shadow-sm border border-white/10"
                : "hover:bg-white/5"
            }`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/trainers"
          className={({ isActive }) =>
            `px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer hover:text-white ${
              isActive
                ? "text-white font-bold bg-white/10 shadow-sm border border-white/10"
                : "hover:bg-white/5"
            }`
          }
        >
          Trainers
        </NavLink>

        <NavLink
          to="/categories"
          className={({ isActive }) =>
            `px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer hover:text-white ${
              isActive
                ? "text-white font-bold bg-white/10 shadow-sm border border-white/10"
                : "hover:bg-white/5"
            }`
          }
        >
          Categories
        </NavLink>

        {isAuthenticated ? (
          <NavLink
            to="/subscriptions"
            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer hover:text-white ${
                isActive
                  ? "text-white font-bold bg-white/10 shadow-sm border border-white/10"
                  : "hover:bg-white/5"
              }`
            }
          >
            Subscription
          </NavLink>
        ) : (
          <NavLink
            to="/bmi"
            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer hover:text-white ${
                isActive
                  ? "text-white font-bold bg-white/10 shadow-sm border border-white/10"
                  : "hover:bg-white/5"
              }`
            }
          >
            BMI
          </NavLink>
        )}
      </div>

      {/* Action Icons (Right) */}
      <div className="flex items-center space-x-5 shrink-0 pl-6">
        {isAuthenticated && (
          <>
            <FaPaperPlane className="text-[#3b82f6] text-xl cursor-pointer hover:text-blue-400 transition-transform duration-200 hover:scale-110" />
            
            <div
              className="relative cursor-pointer group"
              onClick={() => navigator("/notifications")}
              title="Notifications"
            >
              <FaBell className="text-[#3b82f6] text-xl group-hover:text-blue-400 transition-transform duration-200 group-hover:scale-110" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#140c3c] shadow-sm shadow-rose-500/80 animate-pulse">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>

            <div className="relative">
              <FaUserCircle
                className="text-[#3b82f6] text-2xl cursor-pointer hover:text-blue-400 transition-transform duration-200 hover:scale-110"
                onClick={() => navigator("/profile")}
                title="Profile"
              />
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
