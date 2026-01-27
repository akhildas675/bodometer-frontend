import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";
import { toast } from "sonner";
import { Clock, LogOut } from "lucide-react";
import authInitService from "../../services/auth/auth-init.service";

const TrainerPending = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      console.log("Starting logout...");
      
      const loadingToast = toast.loading("Logging out...");
      
      try {
        await authInitService.logout();
        console.log("Logout API successful");
      } catch (error) {
        console.error("Logout API error:", error);
      }
      
      toast.dismiss(loadingToast);
      toast.success("Logged out successfully");
      
      console.log("Clearing auth state...");
      useAuthStore.getState().clearAuth();
      
      console.log("Navigating to login...");
      navigate("/login", { replace: true });
      
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
      useAuthStore.getState().clearAuth();
      navigate("/login", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050017] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#05001a] via-[#07002a] to-[#12043b] relative">
        {/* Logout button - Top right with higher z-index */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          type="button"
          className={`absolute top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 transition-all border border-red-600/50 ${
            isLoggingOut ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105"
          }`}
        >
          <LogOut size={18} className={isLoggingOut ? "animate-spin" : ""} />
          <span className="text-sm font-medium">
            {isLoggingOut ? "Logging out..." : "Logout"}
          </span>
        </button>

        {/* Main content */}
        <div className="flex flex-col items-center justify-center px-10 py-16 text-white relative z-10">
          {/* Animated Clock Icon */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-yellow-500/30 to-orange-500/30 p-8 rounded-full border-2 border-yellow-500/50">
              <Clock size={80} className="text-yellow-400 animate-pulse" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Profile Under Review
          </h1>

          {/* Description */}
          <div className="max-w-md text-center space-y-4 mb-8">
            <p className="text-slate-300 text-base leading-relaxed">
              Thank you for submitting your trainer profile. Our admin team is
              currently reviewing your information.
            </p>
            <p className="text-slate-400 text-sm">
              This process typically takes 24-48 hours. You'll receive an email
              notification once your profile has been reviewed.
            </p>
          </div>

          {/* Status badge */}
          <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-yellow-500/10 border border-yellow-500/30">
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
            <span className="text-sm font-medium text-yellow-400">
              Pending Approval
            </span>
          </div>

          {/* Additional info */}
          <div className="mt-12 p-6 rounded-2xl bg-purple-900/20 border border-purple-700/30 max-w-md">
            <h3 className="text-sm font-semibold text-purple-300 mb-2">
              What happens next?
            </h3>
            <ul className="text-xs text-slate-400 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">•</span>
                <span>Admin reviews your credentials and experience</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">•</span>
                <span>You'll receive an email with the decision</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">•</span>
                <span>
                  Once approved, you can access your trainer dashboard
                </span>
              </li>
            </ul>
          </div>

          {/* Support info */}
          <p className="mt-8 text-xs text-slate-500">
            Questions? Contact us at{" "}
            
              href="mailto:support@bodometer.com"
              className="text-indigo-400 hover:underline"
              support@bodometer.com
            
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrainerPending;