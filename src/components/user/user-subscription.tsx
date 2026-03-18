import { CheckCircle, Zap, Crown, Star } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import SidebarLayout from "@/components/ui/app.sidebar/sidebar.layout";
import { useAuthStore } from "@/stores/auth.store";
import { useFetch } from "@/hooks/useFetch";
import userServices from "@/services/user/user.services";
import { ActiveSubscription, SubscriptionPlan } from "@/interface/user.interface";


const PLAN_ICONS = {
  basic: <Star size={24} className="text-blue-400" />,
  pro: <Zap size={24} className="text-purple-400" />,
  elite: <Crown size={24} className="text-yellow-400" />,
};

const PLAN_COLORS = {
  basic: "border-blue-500/30 hover:border-blue-500/60",
  pro: "border-purple-500/30 hover:border-purple-500/60",
  elite: "border-yellow-500/30 hover:border-yellow-500/60",
};

const PLAN_BADGE_COLORS = {
  basic: "bg-blue-500/20 text-blue-300",
  pro: "bg-purple-500/20 text-purple-300",
  elite: "bg-yellow-500/20 text-yellow-300",
};

const UserSubscription = () => {
  const user = useAuthStore((state) => state.user);

  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const { data: plans, loading: plansLoading } = useFetch<SubscriptionPlan[]>(
    () => userServices.getSubscriptions().then((res) => res.data),
  );

  const { data: activeSubscription, loading: activeLoading } =
    useFetch<ActiveSubscription | null>(
      () => userServices.getMySubscription().then((res) => res.data),
    );

  const handleSubscribe = async (planId: string) => {
    try {
      setCheckoutLoading(planId);
      const res = await userServices.createCheckoutSession(planId);
      window.location.href = res.data.url;
    } catch {
      toast.error("Failed to initiate payment. Please try again.");
    } finally {
      setCheckoutLoading(null);
    }
  };

  if (plansLoading || activeLoading) {
    return (
      <SidebarLayout role={user?.role || "user"}>
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout role={user?.role || "user"}>
      <div className="text-white max-w-5xl mx-auto">

        {/* Active Subscription Banner */}
        {activeSubscription && (
          <div className="bg-linear-to-r from-purple-600/20 to-indigo-600/20 border border-purple-500/30 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-600/30 flex items-center justify-center">
                  {PLAN_ICONS[activeSubscription.planType]}
                </div>
                <div>
                  <p className="text-purple-300 text-sm font-medium">Current Plan</p>
                  <h2 className="text-white text-xl font-bold">
                    {activeSubscription.subscriptionName}
                  </h2>
                  <p className="text-slate-400 text-sm">
                    Expires {new Date(activeSubscription.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-sm">Days Remaining</p>
                <p className="text-white text-3xl font-bold">
                  {activeSubscription.daysRemaining}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">
            {activeSubscription ? "Upgrade Your Plan" : "Choose Your Plan"}
          </h1>
          <p className="text-slate-400">
            {activeSubscription
              ? "Explore other plans available for you"
              : "Start your fitness journey with the right plan"}
          </p>
        </div>

        {/* Plans Grid */}
        {!plans?.length ? (
          <div className="text-center text-slate-400 py-20">
            No plans available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isCurrentPlan = activeSubscription?.planId === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`relative bg-white/5 rounded-2xl p-6 border transition ${
                    isCurrentPlan
                      ? "border-purple-500 bg-purple-500/10"
                      : PLAN_COLORS[plan.planType]
                  }`}
                >
                  {/* Current plan badge */}
                  {isCurrentPlan && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Current Plan
                      </span>
                    </div>
                  )}

                  {/* Plan type badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase ${PLAN_BADGE_COLORS[plan.planType]}`}>
                      {plan.planType}
                    </span>
                    {PLAN_ICONS[plan.planType]}
                  </div>

                  {/* Plan name & price */}
                  <h3 className="text-white text-xl font-bold mb-1">
                    {plan.subscriptionName}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-white">₹{plan.price}</span>
                    <span className="text-slate-400 text-sm ml-1">
                      / {plan.durationDays} days
                    </span>
                  </div>

                  {/* Live sessions */}
                  <div className="bg-white/5 rounded-lg px-3 py-2 mb-4 text-sm">
                    <span className="text-slate-400">Live Sessions: </span>
                    <span className="text-white font-semibold">
                      {plan.liveSessionCount === -1 ? "Unlimited" : plan.liveSessionCount}
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  {isCurrentPlan ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-lg bg-purple-600/30 text-purple-300 text-sm font-semibold cursor-not-allowed"
                    >
                      Active Plan
                    </button>
                  ) : activeSubscription ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-lg bg-white/5 text-slate-500 text-sm font-semibold cursor-not-allowed"
                    >
                      Already Subscribed
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={checkoutLoading === plan.id}
                      className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {checkoutLoading === plan.id ? "Processing..." : "Get Started"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default UserSubscription;