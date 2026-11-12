import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { subscriptionService } from "@/features/subscription/services/subscription.service";
import { USER_UI_ROUTES } from "@/constants/routes/user.routes";

export const useSubscriptionCheck = () => {
  const navigate = useNavigate();
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);

  useEffect(() => {
    subscriptionService
      .getActiveSubscription()
      .then((res) => {
        if (res?.data) {
          setHasSubscription(true);
        } else {
          toast.error("Active subscription required to book a session. Redirecting to plans...");
          navigate(USER_UI_ROUTES.USER_SUBSCRIPTIONS, { replace: true });
        }
      })
      .catch(() => {
        toast.error("Active subscription required to book a session. Redirecting to plans...");
        navigate(USER_UI_ROUTES.USER_SUBSCRIPTIONS, { replace: true });
      })
      .finally(() => {
        setCheckingSubscription(false);
      });
  }, [navigate]);

  return {
    checkingSubscription,
    hasSubscription,
  };
};
