import { FaPaperPlane, FaBell, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../stores/auth.store";
import { useState } from "react";
import authInitService from "../../../services/auth/auth-init.service";
import { toast } from "sonner";

const Navbar = () => {
  const navigator = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Show loading toast
      const loadingToast = toast.loading("Logging out...");

      await authInitService.logout();

      // Dismiss loading and show success
      toast.dismiss(loadingToast);
      toast.success("Logged out successfully!");

      // Navigate after a brief delay to show the success message
      setTimeout(() => {
        navigator("/login", { replace: true });
      }, 500);
    } catch (error) {
      console.error("Logout error:", error);
      
      // Clear auth even if backend fails
      useAuthStore.getState().clearAuth();
      
      toast.error("Logout failed, but you've been signed out locally");
      
      setTimeout(() => {
        navigator("/login", { replace: true });
      }, 500);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutMenu(false);
    }
  };

  return (
    <nav
      className="fixed top-6 left-8 right-8 z-50 max-w-6xl mx-auto flex items-center justify-between rounded-full py-4 px-10 shadow-md"
      style={{ background: "rgba(60, 60, 150, 0.6)" }}
    >
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <img
          src="/Bodometer Logo corrected 1.png"
          alt="bodometer logo"
          className="h-8 mr-2"
        />
      </div>

      {/* Menu */}
      <div className="flex space-x-10 text-[#E1E1E1] text-lg">
        <span className="cursor-pointer hover:text-white">Home</span>
        <span className="cursor-pointer hover:text-white">Trainers</span>
        <span className="cursor-pointer hover:text-white">Workouts</span>
        <span className="cursor-pointer hover:text-white">Subscription</span>
      </div>

      {/* Icons */}
      <div className="flex items-center space-x-6 relative">
        <FaPaperPlane className="text-[#268AFF] text-2xl cursor-pointer hover:text-[#1a6fd6] transition" />
        <FaBell className="text-[#268AFF] text-2xl cursor-pointer hover:text-[#1a6fd6] transition" />

        {/* USER ICON WITH DROPDOWN */}
        <div className="relative">
          <FaUserCircle
            className="text-[#268AFF] text-2xl cursor-pointer hover:text-[#1a6fd6] transition"
            onClick={() => setShowLogoutMenu(!showLogoutMenu)}
          />

          {/* Logout Dropdown Menu */}
          {showLogoutMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-gradient to-blue-500 shadow-lg py-2 z-50">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isLoggingOut ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin h-4 w-4 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging out...
                  </span>
                ) : (
                  "Logout"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;