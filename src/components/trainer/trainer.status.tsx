import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";
import { Clock, LogOut, XCircle, RefreshCw, AlertTriangle } from "lucide-react";
import authInitService from "@/services/auth/auth-init.service";
import { useFetch } from "@/hooks/useFetch";
import type { TrainerProfileStatus } from "@/interface/trainer.interface";
import trainerService from "@/services/trainer/trainer.service";

import { parseApiError } from "@/api/error.helper";

const TrainerStatus = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (isLoggingOut) return;
    try {
      setIsLoggingOut(true);
      const loadingToast = toast.loading("Logging out...");
      const res = await authInitService.logout();
      toast.dismiss(loadingToast);
      toast.success(res.message);
      setTimeout(() => {
        navigate("/", { replace: true });
        setTimeout(() => {
          useAuthStore.getState().clearAuth();
        }, 150);
      }, 1500);
    } catch (error: unknown) {
      console.error("Logout error:", error);
      const apiError = parseApiError(error);
      toast.error(apiError.message);
      setTimeout(() => {
        navigate("/", { replace: true });
        setTimeout(() => {
          useAuthStore.getState().clearAuth();
        }, 150);
      }, 1500);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const {
    data: trainerProfileStatus,
    loading,
    error,
    refetch,
  } = useFetch<{ success: boolean; data: TrainerProfileStatus }>(
    trainerService.getTrainerProfileStatus,
    true
  );


useEffect(() => {
  const interval = setInterval(refetch, 30000);
  return () => clearInterval(interval);
}, []);


useEffect(() => {
  const status = trainerProfileStatus?.data?.verificationStatus;
  if (status === "approved") {
    toast.success(" Your profile has been approved! Please log in again.", {
      duration: 4000,
    });
    setTimeout(async () => {
      try { await authInitService.logout(); } catch (e: unknown) { console.error(e); }
      navigate("/", { replace: true });
      setTimeout(() => {
        useAuthStore.getState().clearAuth();
      }, 150);
    }, 4000);
  }
}, [navigate, trainerProfileStatus]);

  const status = trainerProfileStatus?.data?.verificationStatus;
  const trainerName = trainerProfileStatus?.data?.name;
  const rejectionReason = trainerProfileStatus?.data?.rejectionReason;

  const isRejected = status === "rejected";
  const isPending = status === "pending" || !status;

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#050017] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading your status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-[#050017] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <AlertTriangle size={48} className="text-red-400 mx-auto" />
          <p className="text-slate-300">Failed to load your profile status.</p>
          <button
            onClick={refetch}
            className="px-4 py-2 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm hover:bg-purple-600/30 transition-all"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#050017] flex items-center justify-center p-4">
      <div
        className={`w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative transition-all duration-500 ${
          isRejected
            ? "bg-linear-to-br from-[#1a0505] via-[#1f0808] to-[#2a0a0a]"
            : "bg-linear-to-br from-[#05001a] via-[#07002a] to-[#12043b]"
        }`}
      >
        {/* Logout button */}
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

        <div className="flex flex-col items-center justify-center px-10 py-16 text-white relative z-10">

          {/* ── ICON ── */}
          <div className="mb-8 relative">
            {isRejected ? (
              <>
                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl animate-pulse" />
                <div className="relative bg-linear-to-br from-red-500/30 to-rose-600/30 p-8 rounded-full border-2 border-red-500/50">
                  <XCircle size={80} className="text-red-400" />
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-2xl animate-pulse" />
                <div className="relative bg-linear-to-br from-yellow-500/30 to-orange-500/30 p-8 rounded-full border-2 border-yellow-500/50">
                  <Clock size={80} className="text-yellow-400 animate-pulse" />
                </div>
              </>
            )}
          </div>

          {trainerName && (
            <p className="text-slate-400 text-sm mb-2">
              Hi, <span className="text-white font-semibold">{trainerName}</span>
            </p>
          )}

          <h1
            className={`text-3xl font-bold text-center mb-4 bg-clip-text text-transparent ${
              isRejected
                ? "bg-linear-to-r from-red-400 to-rose-400"
                : "bg-linear-to-r from-yellow-400 to-orange-400"
            }`}
          >
            {isRejected ? "Profile Rejected" : "Profile Under Review"}
          </h1>

          <div className="max-w-md text-center space-y-3 mb-8">
            {isRejected ? (
              <p className="text-slate-300 text-base leading-relaxed">
                Unfortunately, your trainer profile was not approved. Please
                review the reason below and resubmit.
              </p>
            ) : (
              <>
                <p className="text-slate-300 text-base leading-relaxed">
                  Thank you for submitting your trainer profile. Our admin team
                  is currently reviewing your information.
                </p>
                <p className="text-slate-400 text-sm">
                  This process typically takes 24–48 hours. You'll receive an
                  email notification once your profile has been reviewed.
                </p>
               
                <p className="text-purple-400 text-xs flex items-center justify-center gap-1">
                  <RefreshCw size={10} className="animate-spin" />
                  Auto-checking approval status every 30 seconds...
                </p>
              </>
            )}
          </div>

          <div
            className={`flex items-center gap-2 px-6 py-3 rounded-full border ${
              isRejected
                ? "bg-red-500/10 border-red-500/30"
                : "bg-yellow-500/10 border-yellow-500/30"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full animate-pulse ${
                isRejected ? "bg-red-400" : "bg-yellow-400"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                isRejected ? "text-red-400" : "text-yellow-400"
              }`}
            >
              {isRejected ? "Application Rejected" : "Pending Approval"}
            </span>
          </div>

          {isRejected && rejectionReason && (
            <div className="mt-8 w-full max-w-md p-5 rounded-2xl bg-red-900/20 border border-red-700/40">
              <h3 className="text-sm font-semibold text-red-300 mb-2 flex items-center gap-2">
                <AlertTriangle size={14} />
                Reason for Rejection
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {rejectionReason}
              </p>
            </div>
          )}

          {isRejected && (
            <button
              onClick={() => navigate("/trainer/onboarding/intro")}
              className="mt-8 flex items-center gap-2 px-8 py-3 rounded-full bg-linear-to-r from-red-600/80 to-rose-600/80 hover:from-red-600 hover:to-rose-600 text-white font-semibold text-sm transition-all hover:scale-105 shadow-lg shadow-red-900/30 border border-red-500/30"
            >
              <RefreshCw size={16} />
              Reapply Now
            </button>
          )}

          {isPending && (
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
                  <span>Once approved, you'll be automatically redirected to your dashboard</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerStatus;