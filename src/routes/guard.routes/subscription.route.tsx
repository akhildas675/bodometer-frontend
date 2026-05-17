import { Navigate, Outlet, useLocation } from "react-router-dom";
import { USER_UI_ROUTES } from "@/constants/constant-routes/ui-routes/user.ui-constant.routes";
import userServices from "@/services/user/user.services";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";

const SubscriptionRoute = () => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  // Determine if store already contains verified cache flags to prevent redundant waterfalls
  const hasCachedFlags =
    user &&
    user.hasActiveSubscription !== undefined &&
    user.onboardingComplete !== undefined;

  const [loading, setLoading] = useState(!hasCachedFlags);
  const [hasSubscription, setHasSubscription] = useState(
    user?.hasActiveSubscription ?? false
  );
  const [isOnboarded, setIsOnboarded] = useState(
    user?.onboardingComplete ?? false
  );

  useEffect(() => {
    if (hasCachedFlags) {
      // Instantly ready!
      setLoading(false);
      return;
    }

    let isMounted = true;
    const checkStatus = async () => {
      try {
        const subscriptionRes = await userServices.getActiveSubscription();
        if (!isMounted) return;

        const subActive = !!subscriptionRes.data;
        setHasSubscription(subActive);

        if (subActive) {
          // Fetch onboarding completed state
          const onboardingRes = await userServices.getOnboardingStatus();
          if (isMounted) {
            setIsOnboarded(!!onboardingRes.data?.completed);
          }
        }
      } catch (err) {
        console.error("Failed to verify account status:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkStatus();

    return () => {
      isMounted = false;
    };
  }, [hasCachedFlags]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050017] text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <Sparkles size={18} className="animate-pulse" />
          <span className="text-sm tracking-wide">Verifying your account…</span>
        </div>
      </div>
    );
  }

  // 1. If user is NOT subscribed, force to Subscriptions page
  if (!hasSubscription) {
    return <Navigate to={USER_UI_ROUTES.USER_SUBSCRIPTIONS} replace />;
  }

  // 2. If user IS subscribed, but NOT onboarded, force them to finish onboarding.
  const isAccessingOnboarding = location.pathname.toLowerCase().includes("/onboarding");

  if (!isOnboarded && !isAccessingOnboarding) {
    return <Navigate to={USER_UI_ROUTES.ONBOARDING_INTRO} replace />;
  }

  // 3. Render outlet for onboarded users or users actively completing onboarding
  return <Outlet />;
};

export default SubscriptionRoute;
