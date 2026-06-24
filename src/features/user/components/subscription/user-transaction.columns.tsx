import type { TableColumn } from "@/components/ui/table/table.types";
import { SubscriptionTransaction } from "@/modules/subscription/types/subscription.interface";
export const transactionColumns: TableColumn<SubscriptionTransaction>[] = [
  {
    key: "subscriptionPlanId",
    label: "Plan Name",
    render: (tx) => (
      <span className="text-white text-xs font-semibold">
        {tx.subscriptionPlanId?.name || "Custom Plan"}
      </span>
    ),
  },
  {
    key: "amount",
    label: "Amount",
    render: (tx) => (
      <span className="text-indigo-300 font-bold text-xs">
        ₹{tx.amount}
      </span>
    ),
  },
  {
    key: "paymentMethod",
    label: "Method",
    render: (tx) => (
      <div className="flex flex-col">
        <span className="text-[11px] text-slate-200 capitalize font-medium">{tx.paymentMethod}</span>
        <span className="text-[9px] text-slate-400 capitalize">{tx.paymentGateway}</span>
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
          {dateVal ? new Date(dateVal).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          }) : "N/A"}
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
