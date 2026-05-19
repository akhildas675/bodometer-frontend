import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Loader2, AlertCircle, Calendar, Clock, Zap } from "lucide-react";
import userServices from "@/services/user/user.services";
import { ActiveSubscription } from "@/interface/user.interface";
import { USER_UI_ROUTES } from "@/constants/constant-routes/ui-routes/user.ui-constant.routes";
import { useAuthStore } from "@/stores/auth.store";

import { parseApiError } from "@/api/error.helper";

type PageState = "loading" | "success" | "error";

const UserSubscriptionSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const updateUser = useAuthStore((state) => state.updateUser);
  const sessionId = searchParams.get("session_id");

  const [state, setState] = useState<PageState>(sessionId ? "loading" : "error");
  const [subscription, setSubscription] = useState<ActiveSubscription | null>(null);
  const [errorMessage, setErrorMessage] = useState(
    sessionId ? "" : "No session ID found. Your payment may still have gone through."
  );

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const verify = async () => {
      try {
        const res = await userServices.verifyPayment(sessionId);
        if (!isMounted) return;
        
        setSubscription(res.data);
        setState("success");
        updateUser({ hasActiveSubscription: true });

        timeoutId = setTimeout(() => {
          if (isMounted) {
            navigate(USER_UI_ROUTES.ONBOARDING_INTRO);
          }
        }, 3000);
      } catch (err: unknown) {
        if (!isMounted) return;

        const apiError = parseApiError(err);
        setErrorMessage(apiError.message);
        setState("error");
      }
    };

    verify();

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [sessionId, navigate]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });


  if (state === "loading") {
    return (
      <div className="w-full flex-1 min-h-[calc(100vh-80px)] flex items-center justify-center bg-transparent">
        <div className="text-center text-white">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-5">
            <Loader2 size={28} className="animate-spin text-purple-300" />
          </div>
          <p className="text-white/70 text-sm">Confirming your payment…</p>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (state === "error") {
    return (
      <div className="w-full flex-1 min-h-[calc(100vh-80px)] flex items-center justify-center px-6 bg-transparent">
        <div className="text-center text-white max-w-md">
          <div className="w-16 h-16 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto mb-5">
            <AlertCircle size={28} className="text-amber-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Payment received</h2>
          <p className="text-white/60 text-sm leading-relaxed mb-8">
            {errorMessage || "Your payment went through but we couldn't activate your subscription yet. It may take a moment."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 text-sm font-semibold transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Success
  return (
    <div className="w-full flex-1 min-h-[calc(100vh-80px)] flex items-center justify-center px-6 bg-transparent">
      <div className="w-full max-w-md text-white text-center bg-linear-to-b from-[#140b3a] to-[#0a0624] p-8 rounded-3xl border border-white/5 shadow-2xl">

        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={36} className="text-emerald-400" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-white/60 text-sm mb-8">
          Your{" "}
          <span className="text-white font-medium">{subscription?.planName}</span>{" "}
          subscription is now active.
        </p>

        {/* Subscription details */}
        {subscription && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 text-left space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Zap size={14} className="text-purple-300" />
              </div>
              <div>
                <p className="text-white/50 text-xs">Plan</p>
                <p className="text-white text-sm font-medium">{subscription.planName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Clock size={14} className="text-emerald-300" />
              </div>
              <div>
                <p className="text-white/50 text-xs">Days Remaining</p>
                <p className="text-white text-sm font-medium">{subscription.daysRemaining} days</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Calendar size={14} className="text-blue-300" />
              </div>
              <div>
                <p className="text-white/50 text-xs">Valid Until</p>
                <p className="text-white text-sm font-medium">{formatDate(subscription.endDate)}</p>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={() => navigate(USER_UI_ROUTES.ONBOARDING_INTRO)}
          className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-all active:scale-[0.98]"
        >
          Start Training
        </button>
      </div>
    </div>
  );
};

export default UserSubscriptionSuccess;