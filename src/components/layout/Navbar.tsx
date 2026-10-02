import { useEffect, useState } from "react";
import {
  FaPaperPlane,
  FaBell,
  FaUserCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { useNotificationStore } from "@/features/notification/stores/notification.store";

const Navbar = () => {
  const navigate = useNavigate();

  const { isAuthenticated } = useAuthStore();

  const unreadCount = useNotificationStore(
    (state) => state.unreadCount
  );

  const fetchUnreadCount = useNotificationStore(
    (state) => state.fetchUnreadCount
  );

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
    }
  }, [isAuthenticated, fetchUnreadCount]);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3.5 py-1.5 rounded-full transition-all duration-200
     cursor-pointer hover:text-white
     ${
       isActive
         ? "text-white font-bold bg-white/10 shadow-sm border border-white/10"
         : "hover:bg-white/5"
     }`;

  return (
    <nav
      className="
        fixed
        top-4 sm:top-6 md:top-8
        left-1/2
        -translate-x-1/2
        z-50

        w-[calc(100%-1rem)]
        sm:w-[92%]
        md:w-[90%]
        max-w-5xl

        rounded-2xl
        md:rounded-full

        border border-purple-500/30
        shadow-2xl
        backdrop-blur-xl
        bg-[#140c3c]/90
        text-white

        transition-all duration-300
      "
    >
      {/* =========================
          TOP NAVBAR
      ========================== */}
      <div
        className="
          flex
          items-center
          justify-between

          px-4
          sm:px-5
          md:px-6

          py-3
        "
      >
        {/* Logo */}
        <button
          type="button"
          onClick={() => handleNavigation("/")}
          className="
            flex
            items-center
            shrink-0
            cursor-pointer
          "
          aria-label="Go to homepage"
        >
          <img
            src="/Bodometer Logo corrected 1.png"
            alt="bodometer logo"
            className="
              h-7
              sm:h-8
              md:h-9
              w-auto
              object-contain
            "
          />
        </button>

        {/* =========================
            DESKTOP NAVIGATION
        ========================== */}
        <div
          className="
            hidden
            md:flex
            items-center
            space-x-3
            lg:space-x-6
            text-sm
            font-medium
            text-slate-300
          "
        >
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/trainers" className={navLinkClass}>
            Trainers
          </NavLink>

          <NavLink to="/categories" className={navLinkClass}>
            Categories
          </NavLink>

          {isAuthenticated ? (
            <NavLink
              to="/subscriptions"
              className={navLinkClass}
            >
              Subscription
            </NavLink>
          ) : (
            <NavLink to="/bmi" className={navLinkClass}>
              BMI
            </NavLink>
          )}
        </div>

        {/* =========================
            DESKTOP ACTIONS
        ========================== */}
        <div
          className="
            hidden
            md:flex
            items-center
            space-x-4
            lg:space-x-5
            shrink-0
          "
        >
          {isAuthenticated && (
            <>
              {/* Messages */}
              <button
                type="button"
                onClick={() => navigate("/messages")}
                className="
                  text-[#3b82f6]
                  text-xl
                  cursor-pointer
                  hover:text-blue-400
                  transition-transform
                  duration-200
                  hover:scale-110
                "
                title="Messages"
                aria-label="Messages"
              >
                <FaPaperPlane />
              </button>

              {/* Notifications */}
              <button
                type="button"
                onClick={() => navigate("/notifications")}
                className="
                  relative
                  cursor-pointer
                  group
                "
                title="Notifications"
                aria-label="Notifications"
              >
                <FaBell
                  className="
                    text-[#3b82f6]
                    text-xl
                    group-hover:text-blue-400
                    transition-transform
                    duration-200
                    group-hover:scale-110
                  "
                />

                {unreadCount > 0 && (
                  <span
                    className="
                      absolute
                      -top-1.5
                      -right-1.5
                      min-w-[18px]
                      h-[18px]
                      px-1
                      bg-rose-500
                      text-white
                      text-[10px]
                      font-bold
                      flex
                      items-center
                      justify-center
                      rounded-full
                      border-2
                      border-[#140c3c]
                      shadow-sm
                      shadow-rose-500/80
                      animate-pulse
                    "
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Profile */}
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="cursor-pointer"
                title="Profile"
                aria-label="Profile"
              >
                <FaUserCircle
                  className="
                    text-[#3b82f6]
                    text-2xl
                    hover:text-blue-400
                    transition-transform
                    duration-200
                    hover:scale-110
                  "
                />
              </button>
            </>
          )}
        </div>

        {/* =========================
            MOBILE MENU BUTTON
        ========================== */}
        <button
          type="button"
          onClick={() =>
            setIsMobileMenuOpen((previous) => !previous)
          }
          className="
            md:hidden
            flex
            items-center
            justify-center

            w-10
            h-10

            rounded-full
            text-[#3b82f6]

            hover:bg-white/10
            transition-colors
          "
          aria-label={
            isMobileMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <FaTimes className="text-xl" />
          ) : (
            <FaBars className="text-xl" />
          )}
        </button>
      </div>

      {/* =========================
          MOBILE MENU
      ========================== */}
      {isMobileMenuOpen && (
        <div
          className="
            md:hidden
            border-t
            border-purple-500/20
            px-4
            pb-4
            pt-3
          "
        >
          {/* Navigation */}
          <div className="flex flex-col gap-1">
            <NavLink
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={navLinkClass}
            >
              Home
            </NavLink>

            <NavLink
              to="/trainers"
              onClick={() => setIsMobileMenuOpen(false)}
              className={navLinkClass}
            >
              Trainers
            </NavLink>

            <NavLink
              to="/categories"
              onClick={() => setIsMobileMenuOpen(false)}
              className={navLinkClass}
            >
              Categories
            </NavLink>

            {isAuthenticated ? (
              <NavLink
                to="/subscriptions"
                onClick={() => setIsMobileMenuOpen(false)}
                className={navLinkClass}
              >
                Subscription
              </NavLink>
            ) : (
              <NavLink
                to="/bmi"
                onClick={() => setIsMobileMenuOpen(false)}
                className={navLinkClass}
              >
                BMI
              </NavLink>
            )}
          </div>

          {/* Mobile authenticated actions */}
          {isAuthenticated && (
            <div
              className="
                mt-3
                pt-3
                border-t
                border-purple-500/20
                flex
                items-center
                justify-around
              "
            >
              {/* Messages */}
              <button
                type="button"
                onClick={() => handleNavigation("/messages")}
                className="
                  relative
                  flex
                  flex-col
                  items-center
                  gap-1
                  text-[#3b82f6]
                "
              >
                <FaPaperPlane className="text-xl" />
                <span className="text-[11px] text-slate-300">
                  Messages
                </span>
              </button>

              {/* Notifications */}
              <button
                type="button"
                onClick={() => handleNavigation("/notifications")}
                className="
                  relative
                  flex
                  flex-col
                  items-center
                  gap-1
                  text-[#3b82f6]
                "
              >
                <div className="relative">
                  <FaBell className="text-xl" />

                  {unreadCount > 0 && (
                    <span
                      className="
                        absolute
                        -top-2
                        -right-2
                        min-w-[17px]
                        h-[17px]
                        px-1
                        bg-rose-500
                        text-white
                        text-[9px]
                        font-bold
                        flex
                        items-center
                        justify-center
                        rounded-full
                      "
                    >
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </div>

                <span className="text-[11px] text-slate-300">
                  Notifications
                </span>
              </button>

              {/* Profile */}
              <button
                type="button"
                onClick={() => handleNavigation("/profile")}
                className="
                  flex
                  flex-col
                  items-center
                  gap-1
                  text-[#3b82f6]
                "
              >
                <FaUserCircle className="text-xl" />

                <span className="text-[11px] text-slate-300">
                  Profile
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;