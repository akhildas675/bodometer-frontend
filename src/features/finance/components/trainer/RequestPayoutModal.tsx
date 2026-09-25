import React, { useState } from "react";
import { X, DollarSign, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { financeService } from "../../services/finance.service";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  onSuccess: () => void;
}

export const RequestPayoutModal: React.FC<Props> = ({
  isOpen,
  onClose,
  availableBalance,
  onSuccess,
}) => {
  const [amount, setAmount] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const numericAmount = parseFloat(amount) || 0;
  const isTooLow = numericAmount < 1000;
  const isTooHigh = numericAmount > availableBalance;
  const isValid = !isTooLow && !isTooHigh && numericAmount > 0;

  const handleMaxClick = () => {
    setAmount(availableBalance.toFixed(2));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || submitting) return;

    try {
      setSubmitting(true);
      await financeService.requestPayout(numericAmount);
      toast.success("Payout request submitted successfully!", {
        description: `₹${numericAmount.toLocaleString("en-IN")} is now queued for administrator review.`,
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to submit payout request.";
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800/80 px-6 py-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                Request Payout
              </h2>
              <p className="text-xs text-neutral-400">
                Transfer your earnings to your bank account
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Balance info box */}
          <div className="flex items-center justify-between bg-neutral-950/60 border border-neutral-800 rounded-xl p-3.5">
            <span className="text-xs text-neutral-400 font-medium">
              Available Balance
            </span>
            <span className="text-sm font-bold text-emerald-400">
              ₹{availableBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Amount input */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Payout Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 font-medium text-sm">
                ₹
              </span>
              <input
                type="number"
                step="0.01"
                min="1000"
                max={availableBalance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1000.00"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500/50 rounded-xl py-2.5 pl-8 pr-16 text-sm text-white focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={handleMaxClick}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-colors cursor-pointer"
              >
                MAX
              </button>
            </div>

            {/* Validation warnings */}
            {amount && isTooLow && (
              <p className="flex items-center gap-1.5 text-xs text-amber-400 mt-2">
                <AlertCircle size={13} />
                <span>Minimum payout amount is ₹1,000.00</span>
              </p>
            )}
            {amount && isTooHigh && (
              <p className="flex items-center gap-1.5 text-xs text-rose-400 mt-2">
                <AlertCircle size={13} />
                <span>Amount exceeds your available balance of ₹{availableBalance.toFixed(2)}</span>
              </p>
            )}
          </div>

          {/* Summary notes */}
          <div className="space-y-2 border-t border-neutral-800/60 pt-4 text-xs text-neutral-400">
            <div className="flex justify-between">
              <span>Transfer Method</span>
              <span className="text-neutral-300 font-medium">Bank Account (IMPS/NEFT)</span>
            </div>
            <div className="flex justify-between">
              <span>Platform Processing Fee</span>
              <span className="text-emerald-400 font-medium">₹0.00 (Free)</span>
            </div>
            <div className="flex justify-between">
              <span>Processing Time</span>
              <span className="text-neutral-300 font-medium">1 - 3 Business Days</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 py-2.5 px-4 rounded-xl border border-neutral-700 hover:bg-neutral-800 text-xs font-medium text-neutral-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid || submitting}
              className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
                isValid && !submitting
                  ? "bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-[0.98]"
                  : "bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700/50"
              }`}
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Confirm Request</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
