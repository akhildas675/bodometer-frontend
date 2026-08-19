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
    <nav
      className="fixed top-6 left-8 right-8 z-50 max-w-6xl mx-auto flex items-center rounded-full py-4 px-10 shadow-md"
      style={{ background: "rgba(60, 60, 150, 0.6)" }}
    >
      {/* Logo */}
      <div className="flex items-center space-x-2 flex-1">
        <img
          src="/Bodometer Logo corrected 1.png"
          alt="bodometer logo"
          className="h-8 mr-2"
        />
      </div>

      {/* Menu */}
      <div className="flex space-x-32 text-[#E1E1E1] text-lg justify-center">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `cursor-pointer hover:text-white ${
              isActive ? "text-white font-semibold" : ""
            }`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/trainers"
          className={({ isActive }) =>
            `cursor-pointer hover:text-white ${
              isActive ? "text-white font-semibold" : ""
            }`
          }
        >
          Trainers
        </NavLink>

        <NavLink
          to="/categories"
          className={({ isActive }) =>
            `cursor-pointer hover:text-white ${
              isActive ? "text-white font-semibold" : ""
            }`
          }
        >
          Categories
        </NavLink>

        {isAuthenticated ? (
          <NavLink
            to="/subscriptions"
            className={({ isActive }) =>
              `cursor-pointer hover:text-white ${
                isActive ? "text-white font-semibold" : ""
              }`
            }
          >
            Subscription
          </NavLink>
        ) : (
          <NavLink
            to="/bmi"
            className={({ isActive }) =>
              `cursor-pointer hover:text-white ${
                isActive ? "text-white font-semibold" : ""
              }`
            }
          >
            BMI
          </NavLink>
        )}
      </div>

      {/* Icons / Spacer */}
      <div className="flex items-center space-x-6 relative flex-1 justify-end min-h-[32px]">
        {isAuthenticated && (
          <>
            <FaPaperPlane className="text-[#268AFF] text-2xl cursor-pointer hover:text-[#1a6fd6] transition" />
            <div
              className="relative cursor-pointer group"
              onClick={() => navigator("/notifications")}
              title="Notifications"
            >
              <FaBell className="text-[#268AFF] text-2xl hover:text-[#1a6fd6] transition" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-[#050017] animate-pulse shadow-sm shadow-rose-500/80" />
              )}
            </div>

            {/* USER ICON WITH DROPDOWN */}
            <div className="relative">
              <FaUserCircle
                className="text-[#268AFF] text-2xl cursor-pointer hover:text-[#1a6fd6] transition"
                onClick={() => navigator('/profile')}
              />
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
