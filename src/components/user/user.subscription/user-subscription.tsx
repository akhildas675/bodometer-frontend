import { CheckCircle, Zap, Star, Crown, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useState, useCallback, useEffect } from "react";

import { useFetch } from "@/hooks/useFetch";
import userServices from "@/services/user/user.services";
import { SubscriptionPlan, SubscriptionTransaction, PaginatedResponse } from "@/interface/admin.interface";
import { ActiveSubscription } from "@/interface/user.interface";

import DataTable from "@/components/ui/table/data.table";
import SearchBar from "@/components/controls/search/search";
import SortDropdown, { type SortConfig } from "@/components/controls/sort/sort";
import { extractSortOptions } from "@/components/controls/sort/sort.label";
import Pagination from "@/components/controls/pagination/pagination";
import { useTableFetch } from "@/hooks/useTableFetch";

import { transactionColumns } from "./user-transaction.columns";

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

  // Transaction Table State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig<keyof SubscriptionTransaction>>({
    field: "createdAt",
    order: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchTransactionsFn = useCallback(
    async () =>
      userServices.getMyTransactions({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery || undefined,
        sortBy: sortConfig.field ? String(sortConfig.field) : undefined,
        sortOrder: sortConfig.order,
        status: statusFilter || undefined,
      }),
    [searchQuery, statusFilter, sortConfig, currentPage, itemsPerPage]
  );

  const { data: txResponse, loading: txLoading, refetch: refetchTransactions } =
    useTableFetch<PaginatedResponse<SubscriptionTransaction>>(fetchTransactionsFn, false);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback(
    (sort: SortConfig<keyof SubscriptionTransaction>) => {
      setSortConfig(sort);
      setCurrentPage(1);
    },
    []
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleItemsPerPageChange = useCallback((items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    refetchTransactions();
  }, [searchQuery, statusFilter, sortConfig, currentPage, itemsPerPage, refetchTransactions]);

  const sortOptions = extractSortOptions(transactionColumns);

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
          {plans.map((plan) => {
            // Decide the tier style based on price rank dynamically
            let tierIndex = 0;
            if (plans.length > 1) {
              const prices = plans.map((p) => p.price);
              const maxPrice = Math.max(...prices);
              const minPrice = Math.min(...prices);
              if (plan.price === maxPrice) {
                tierIndex = 2; // Premium style
              } else if (plan.price === minPrice) {
                tierIndex = 0; // Starter style
              } else {
                tierIndex = 1; // Pro style
              }
            } else {
              tierIndex = 0;
            }
            const tier = TIER_STYLES[tierIndex];
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

      {/* Divider */}
      <div className="border-t border-white/10 my-16" />

      {/* Transaction History Section */}
      <div className="text-white space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Subscription Purchase History
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            View, search, track, and manage all your subscription plans transaction history
          </p>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <SearchBar
            value={searchQuery}
            onSearch={handleSearch}
            placeholder="Search transactions by plan..."
            disabled={txLoading}
            className="flex-grow md:max-w-md"
          />

          {/* Status Filter Dropdown */}
          <div className="flex items-center bg-[#171c35] border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300">
            <label htmlFor="status-select" className="mr-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              Status:
            </label>
            <select
              id="status-select"
              value={statusFilter}
              onChange={handleStatusChange}
              disabled={txLoading}
              className="bg-transparent border-none text-white text-sm focus:outline-none cursor-pointer focus:ring-0"
            >
              <option value="" className="bg-slate-900 text-white">All Statuses</option>
              <option value="success" className="bg-slate-900 text-white">Success</option>
              <option value="pending" className="bg-slate-900 text-white">Pending</option>
              <option value="failed" className="bg-slate-900 text-white">Failed</option>
            </select>
          </div>

          <SortDropdown<keyof SubscriptionTransaction>
            options={sortOptions}
            value={sortConfig}
            onSortChange={handleSortChange}
            disabled={txLoading}
            className="w-64"
            placeholder="Sort by..."
          />
        </div>

        {txLoading ? (
          <div className="flex justify-center items-center py-20 text-purple-300 gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-purple-500 border-t-transparent animate-spin"></div>
            <span>Loading transaction history...</span>
          </div>
        ) : (
          <>
            <DataTable<SubscriptionTransaction>
              columns={transactionColumns}
              data={txResponse?.data || []}
            />

            {(!txResponse?.data || txResponse.data.length === 0) && (
              <div className="text-center py-12 text-slate-400 border border-white/5 rounded-xl bg-white/[0.02] mt-4">
                No subscription transactions found matching your criteria.
              </div>
            )}

            {txResponse?.pagination && txResponse.data.length > 0 && (
              <div className="mt-6">
                <Pagination
                  currentPage={Number(txResponse.pagination.currentPage)}
                  totalPages={Number(txResponse.pagination.totalPages)}
                  totalItems={Number(txResponse.pagination.totalItems)}
                  itemsPerPage={Number(txResponse.pagination.itemsPerPage)}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  disabled={txLoading}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserSubscription;