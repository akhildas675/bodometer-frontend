import type { TableColumn } from "@/ui.components/ui/table/table.types";
import { SubscriptionTransaction } from "@/modules/subscription/types/subscription.interface";

export const transactionColumns: TableColumn<SubscriptionTransaction>[] = [
  {
    key: "subscriptionPlanId",
    label: "Plan Details",
    render: (tx) => {
      const isUpgrade = tx.type === "UPGRADE" || !!tx.oldPlanId;
      return (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-white text-xs font-semibold">
              {tx.subscriptionPlanId?.name || "Subscription Plan"}
            </span>
            {isUpgrade ? (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-violet-500/20 text-violet-300 border border-violet-500/30">
                Upgrade
              </span>
            ) : (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Purchase
              </span>
            )}
          </div>
          {isUpgrade && (
            <span className="text-[10px] text-slate-400">
              {tx.oldPlanId?.name ? `From ${tx.oldPlanId.name}` : "Plan Upgrade"}
              {!!tx.oldPlanUnusedValue && ` (Credit: ₹${tx.oldPlanUnusedValue})`}
            </span>
          )}
        </div>
      );
    },
  },
  {
    key: "amount",
    label: "Amount Paid",
    render: (tx) => (
      <div className="flex flex-col">
        <span className="text-indigo-300 font-bold text-xs">
          ₹{tx.amount}
        </span>
        {tx.type === "UPGRADE" && tx.upgradeAmount !== undefined && (
          <span className="text-[9px] text-slate-400">Prorated charge</span>
        )}
      </div>
    ),
  },
  {
    key: "paymentMethod",
    label: "Method",
    render: (tx) => (
      <div className="flex flex-col">
        <span className="text-[11px] text-slate-200 capitalize font-medium">
          {tx.paymentMethod?.replace("_", " ")}
        </span>
        <span className="text-[9px] text-slate-400 capitalize">
          {tx.paymentGateway}
        </span>
      </div>
    ),
  },
  {
    key: "createdAt",
    label: "Paid Date",
    render: (tx) => {
      const dateVal = tx.paidAt || tx.createdAt;
      return (
        <span className="text-[11px] text-slate-300">
          {dateVal
            ? new Date(dateVal).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "N/A"}
        </span>
      );
    },
  },
  {
    key: "paymentStatus",
    label: "Payment Status",
    render: (tx) => {
      const status = tx.paymentStatus?.toLowerCase() || "pending";
      if (status === "success" || status === "paid" || status === "completed") {
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/15 text-green-400 border border-green-500/30">
            Success
          </span>
        );
      } else if (status === "failed") {
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/30">
            Failed
          </span>
        );
      } else {
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 animate-pulse">
            Pending
          </span>
        );
      }
    },
  },
];
