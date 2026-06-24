import type { TableColumn } from "@/components/ui/table/table.types";
import { SubscriptionPlanListItem } from "@/modules/subscription/types/subscription.interface";
export const subscriptionColumns: TableColumn<SubscriptionPlanListItem>[] = [
  {
    key: "name",
    label: "Name",
    render: (plan) => (
      <div className="flex items-center gap-2">
        <span className="font-semibold text-white">{plan.name}</span>
        {plan.isPopular && (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            Popular
          </span>
        )}
      </div>
    ),
  },
  {
    key: "price",
    label: "Price",
    render: (plan) => (
      <span className="text-purple-300 font-semibold">₹{plan.price}</span>
    ),
  },
  {
    key: "durationInDays",
    label: "Duration",
    render: (plan) => (
      <span className="text-white/70">{plan.durationInDays} days</span>
    ),
  },

  {
    key: "isActive",
    label: "Status",
    sortable: false,
    render: (plan) =>
      plan.isActive ? (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
          Active
        </span>
      ) : (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
          Inactive
        </span>
      ),
  },
];