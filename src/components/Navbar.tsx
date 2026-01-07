import { FaPaperPlane, FaBell, FaUserCircle } from "react-icons/fa";

import { useNavigate } from "react-router-dom";


import { useAuthStore } from "../stores/auth.store";
import { toast } from "sonner";

const Navbar = () => {
  const { isAuthenticated, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleUserClick = async () => {
    if (isAuthenticated) {
      try {

        toast.message('User logout successfully')
        clearAuth();
        navigate("/");
      } catch  {
        toast.error("Logout failed");
      }
    } else {
      navigate("/login");
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
      <div className="flex items-center space-x-6">
        <FaPaperPlane className="text-[#268AFF] text-2xl cursor-pointer" />
        <FaBell className="text-[#268AFF] text-2xl cursor-pointer" />

        {/* USER ICON */}
        <FaUserCircle
          className="text-[#268AFF] text-2xl cursor-pointer"
          onClick={handleUserClick}
        />
      </div>
    </nav>
  );
};

export default Navbar;
