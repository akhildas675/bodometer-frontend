import { CheckCircle, Zap, Star, Crown, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

import { useFetch } from "@/hooks/useFetch";
import userServices from "@/services/user/user.services";
import { SubscriptionPlan } from "@/interface/admin.interface";
import { ActiveSubscription } from "@/interface/user.interface";

/* ── tier config (no "type" label shown to user) ── */
const TIER_STYLES = [
  {
    icon: <Zap size={20} className="text-slate-300" />,
    glow: "hover:shadow-[0_0_32px_rgba(148,163,184,0.12)]",
    border: "border-slate-700/60 hover:border-slate-500",
    bg: "bg-slate-800/40",
    btnClass: "bg-slate-600 hover:bg-slate-500 text-white",
    priceColor: "text-white",
    badge: null,
  },
  {
    icon: <Star size={20} className="text-violet-300" />,
    glow: "hover:shadow-[0_0_40px_rgba(139,92,246,0.25)]",
    border: "border-violet-500/50 hover:border-violet-400",
    bg: "bg-violet-950/30",
    btnClass: "bg-violet-600 hover:bg-violet-500 text-white",
    priceColor: "text-violet-300",
    badge: "Most Popular",
  },
  {
    icon: <Crown size={20} className="text-amber-300" />,
    glow: "hover:shadow-[0_0_40px_rgba(251,191,36,0.2)]",
    border: "border-amber-500/40 hover:border-amber-400",
    bg: "bg-amber-950/20",
    btnClass: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white",
    priceColor: "text-amber-300",
    badge: "Premium",
  },
];

const UserSubscription = () => {
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const { data: plansData, loading: plansLoading } = useFetch<SubscriptionPlan[]>(
    () =>
      userServices
        .getMySubscriptions()
        .then((res) =>
          Array.isArray(res.data) ? res.data : ([] as unknown as SubscriptionPlan[])
        )
  );

  // Sort cheapest → most expensive so tier index maps correctly
  const plans = Array.isArray(plansData)
    ? [...plansData].sort((a, b) => a.price - b.price)
    : [];

  const { data: activeSubscription, loading: activeLoading } = useFetch<ActiveSubscription | null>(
    () => userServices.getActiveSubscription().then((res) => res.data)
  );

  const handleSubscribe = async (planId: string) => {
    try {
      setCheckoutLoading(planId);
      const res = await userServices.createCheckoutSession(planId);
    window.location.href = res.data.checkoutUrl;
    } catch {
      toast.error("Failed to initiate payment. Please try again.");
    } finally {
      setCheckoutLoading(null);
    }
  };

  if (plansLoading || activeLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-3 text-slate-400">
          <Sparkles size={18} className="animate-pulse" />
          <span className="text-sm tracking-wide">Loading plans…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white max-w-5xl mx-auto px-4 py-8">

      {/* Active Subscription Banner */}
      {activeSubscription && (
        <div className="bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/30 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-violet-600/30 flex items-center justify-center">
                <Star size={20} className="text-violet-300" />
              </div>
              <div>
                <p className="text-violet-300 text-sm font-medium">Current Plan</p>
                <h2 className="text-white text-xl font-bold">{activeSubscription.planName}</h2>
                <p className="text-slate-400 text-sm">
                  Expires {new Date(activeSubscription.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-sm">Days Remaining</p>
              <p className="text-white text-3xl font-bold">{activeSubscription.daysRemaining}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {activeSubscription ? "Upgrade Your Plan" : "Choose Your Plan"}
        </h1>
        <p className="text-slate-400 text-sm">
          {activeSubscription
            ? "Manage your subscription or view your active plan"
            : "Start your fitness journey with the right plan"}
        </p>
      </div>

      {/* Plans Grid */}
      {!plans.length ? (
        <div className="text-center text-slate-500 py-20 text-sm">
          No plans available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {plans.map((plan, index) => {
            const tier = TIER_STYLES[index] ?? TIER_STYLES[0];
            const planId =
              plan.subscriptionPlanId ||
              plan.planId ||
              (plan as { _id?: string })._id ||
              "";
            const name = plan.name || plan.name;
            const duration = plan.durationInDays || plan.durationInDays || 30;
            const isCurrentPlan = activeSubscription?.planId === planId;
            const isPopular = !!plan.isPopular;

            return (
              <div
                key={planId}
                className={`
                  relative rounded-2xl border p-6 flex flex-col
                  transition-all duration-300
                  ${tier.bg} ${tier.border} ${tier.glow}
                  ${isPopular ? "md:-translate-y-3 shadow-xl" : ""}
                  ${isCurrentPlan ? "ring-2 ring-violet-500" : ""}
                `}
              >
                {/* Badge */}
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span
                      className={`
                        text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap
                        ${isPopular
                          ? "bg-violet-600 text-white"
                          : "bg-amber-600 text-white"}
                      `}
                    >
                      {tier.badge}
                    </span>
                  </div>
                )}

                {/* Icon + Name */}
                <div className="flex items-center gap-3 mb-4 mt-2">
                  <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                    {tier.icon}
                  </div>
                  <h3 className="text-white font-semibold text-base leading-tight">
                    {name}
                  </h3>
                </div>

                {/* Price */}
                <div className="mb-1">
                  <span className={`text-4xl font-bold ${tier.priceColor}`}>
                    ₹{plan.price}
                  </span>
                </div>
                <p className="text-slate-500 text-xs mb-4">
                  for {duration} days
                </p>

                {/* Description */}
                <p className="text-slate-400 text-sm leading-relaxed mb-5">
                  {plan.description}
                </p>

                {/* Divider */}
                <div className="border-t border-white/5 mb-5" />

                {/* Features */}
                <ul className="space-y-2.5 mb-6 flex-grow">
                  {Array.isArray(plan.features) &&
                    plan.features.map((feature, i) => {
                      const featureText =
                        typeof feature === "string"
                          ? feature
                          : feature.title ||
                            (feature.limit
                              ? `${feature.limit} ${feature.limitType || ""}`
                              : "Feature");

                      return (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-sm text-slate-300"
                        >
                          <CheckCircle
                            size={15}
                            className="text-emerald-400 flex-shrink-0 mt-0.5"
                          />
                          <span>{featureText}</span>
                        </li>
                      );
                    })}
                </ul>

                {/* CTA */}
                <div className="mt-auto">
                  {isCurrentPlan ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl bg-white/5 text-slate-400 text-sm font-semibold cursor-not-allowed border border-white/10"
                    >
                      Current Plan
                    </button>
                  ) : activeSubscription ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl bg-white/5 text-slate-500 text-sm font-semibold cursor-not-allowed"
                    >
                      Already Subscribed
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubscribe(planId)}
                      disabled={checkoutLoading === planId}
                      className={`
                        w-full py-2.5 rounded-xl text-sm font-semibold
                        transition-all duration-200 active:scale-[0.98]
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${tier.btnClass}
                      `}
                    >
                      {checkoutLoading === planId ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="animate-spin h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              className="opacity-25"
                              cx="12" cy="12" r="10"
                              stroke="currentColor" strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8z"
                            />
                          </svg>
                          Processing…
                        </span>
                      ) : (
                        "Get Started"
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserSubscription;