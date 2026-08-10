import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Calendar,
  CreditCard,
  History,
  PlusCircle,
  AlertCircle,
  XCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { walletService, UserWalletData, WalletTransactionData } from "@/modules/wallet/service/wallet.service";
import SearchBar from "@/features/controls/search/search";
import SortDropdown, { SortConfig } from "@/features/controls/sort/sort";
import Pagination from "@/features/controls/pagination/pagination";
import { toast } from "sonner";

const MAX_WALLET_LIMIT = 10000;

export const UserWalletPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [wallet, setWallet] = useState<UserWalletData | null>(null);
  const [transactions, setTransactions] = useState<WalletTransactionData[]>([]);
  const [loading, setLoading] = useState(true);

  // Search, Sort, Filter, Pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "CREDIT" | "DEBIT">("ALL");
  const [sortConfig, setSortConfig] = useState<SortConfig<"createdAt" | "amount">>({
    field: "createdAt",
    order: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Add Funds Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addAmount, setAddAmount] = useState<string>("1000");
  const [adding, setAdding] = useState(false);

  const verifiedRef = useRef<string | null>(null);

  const loadWalletData = () => {
    setLoading(true);
    Promise.all([
      walletService.getWalletBalance().catch(() => null),
      walletService.getWalletTransactions().catch(() => []),
    ])
      .then(([walletData, txsData]) => {
        if (walletData) setWallet(walletData);
        if (txsData) setTransactions(txsData);
      })
      .catch(() => toast.error("Failed to load wallet information."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const topupSuccess = searchParams.get("topup_success");
    const amountParam = searchParams.get("amount");
    const sessionIdParam = searchParams.get("session_id");

    if (topupSuccess === "true" && amountParam && sessionIdParam) {
      if (verifiedRef.current === sessionIdParam) return;
      verifiedRef.current = sessionIdParam;

      const newParams = new URLSearchParams(searchParams);
      newParams.delete("topup_success");
      newParams.delete("amount");
      newParams.delete("session_id");
      setSearchParams(newParams, { replace: true });

      const amt = Number(amountParam);
      walletService
        .verifyTopupPayment(amt, sessionIdParam)
        .then(() => {
          toast.success(`Rs.${amt.toLocaleString()} added to your wallet via payment checkout!`);
        })
        .catch(() => {})
        .finally(() => loadWalletData());
    } else {
      loadWalletData();
    }
  }, []);

  const currentBalance = wallet?.balance || 0;
  const remainingCap = Math.max(0, MAX_WALLET_LIMIT - currentBalance);
  const numAddAmount = Number(addAmount) || 0;
  const isOverLimit = currentBalance + numAddAmount > MAX_WALLET_LIMIT;

  const handleProceedToPaymentCheckout = async () => {
    if (numAddAmount <= 0) {
      toast.error("Please enter an amount greater than 0.");
      return;
    }
    if (isOverLimit) {
      toast.error(`Wallet balance cannot exceed ₹${MAX_WALLET_LIMIT.toLocaleString()}. Maximum top-up allowed right now is ₹${remainingCap.toLocaleString()}.`);
      return;
    }

    try {
      setAdding(true);
      const res = await walletService.createTopupCheckout(numAddAmount);
      if (res?.checkoutUrl) {
        toast.info("Redirecting to secure payment gateway checkout...");
        window.location.href = res.checkoutUrl;
      } else {
        await walletService.addFunds(numAddAmount);
        toast.success(`Successfully added ₹${numAddAmount.toLocaleString()} to your wallet!`);
        setShowAddModal(false);
        loadWalletData();
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to initialize payment checkout.";
      toast.error(msg);
    } finally {
      setAdding(false);
    }
  };

  // Filter, Search, Sort calculation
  let processedTxs = [...transactions];

  // 1. Filter by Type
  if (filterType !== "ALL") {
    processedTxs = processedTxs.filter((tx) => tx.type === filterType);
  }

  // 2. Search Query
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    processedTxs = processedTxs.filter(
      (tx) =>
        (tx.description && tx.description.toLowerCase().includes(q)) ||
        (tx.source && tx.source.toLowerCase().includes(q)) ||
        (tx.reference && tx.reference.toLowerCase().includes(q)) ||
        (tx.bookingId && tx.bookingId.toLowerCase().includes(q)) ||
        String(tx.amount).includes(q)
    );
  }

  // 3. Sort
  processedTxs.sort((a, b) => {
    let comparison = 0;
    if (sortConfig.field === "createdAt") {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortConfig.field === "amount") {
      comparison = a.amount - b.amount;
    }
    return sortConfig.order === "asc" ? comparison : -comparison;
  });

  // 4. Pagination calculation
  const totalItems = processedTxs.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedTxs = processedTxs.slice(startIndex, startIndex + pageSize);

  const totalCredits = transactions
    .filter((tx) => tx.type === "CREDIT")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalDebits = transactions
    .filter((tx) => tx.type === "DEBIT")
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8 text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
            <Wallet className="text-purple-400" size={30} />
            My Bodometer Wallet
          </h1>
          <p className="text-xs sm:text-sm text-white/50 mt-1">
            View your balance, add funds via payment gateway (up to ₹10,000 limit), and inspect your ledger history.
          </p>
        </div>
        <button
          onClick={loadWalletData}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition cursor-pointer"
          title="Refresh Balance"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Balance & Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Main Balance Card */}
        <div className="md:col-span-2 bg-gradient-to-br from-purple-900/60 via-[#0C0526] to-[#040114] border border-purple-500/30 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider">
              <Sparkles size={14} /> Available Balance
            </div>
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
              <ShieldCheck size={12} /> Max Limit: ₹10,000
            </span>
          </div>

          <div className="flex items-baseline justify-between flex-wrap gap-4">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Rs.{currentBalance.toLocaleString()}
              </div>
              <p className="text-xs text-white/50 mt-1">
                Remaining wallet top-up capacity: <strong className="text-purple-300">Rs.{remainingCap.toLocaleString()}</strong>
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white transition flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer"
            >
              <PlusCircle size={16} /> Add Money to Wallet
            </button>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-white/60 gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Instant Wallet Checkout Enabled for Sessions</span>
            </div>
            <a
              href="/trainers"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-xs text-white transition shadow-lg shadow-purple-600/30 cursor-pointer"
            >
              Book Session using Wallet
            </a>
          </div>
        </div>

        {/* Quick Stats Column */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="bg-[#03000D]/80 border border-white/10 rounded-2xl p-5 space-y-2 flex-1 flex flex-col justify-center">
            <div className="flex items-center justify-between text-xs text-white/50">
              <span>Total Refund Credits</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ArrowDownLeft size={16} />
              </div>
            </div>
            <p className="text-xl font-extrabold text-emerald-400">+Rs.{totalCredits.toLocaleString()}</p>
            <p className="text-[10px] text-white/35">Received from session refunds & top-ups</p>
          </div>

          <div className="bg-[#03000D]/80 border border-white/10 rounded-2xl p-5 space-y-2 flex-1 flex flex-col justify-center">
            <div className="flex items-center justify-between text-xs text-white/50">
              <span>Total Spent on Sessions</span>
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <ArrowUpRight size={16} />
              </div>
            </div>
            <p className="text-xl font-extrabold text-purple-300">-Rs.{totalDebits.toLocaleString()}</p>
            <p className="text-[10px] text-white/35">Debited for session bookings</p>
          </div>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="bg-[#03000D]/80 border border-white/10 rounded-3xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <History size={18} className="text-purple-400" />
              Transaction History Ledger
            </h2>
            <p className="text-xs text-white/50 mt-0.5">
              Complete audit log of credits and debits.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
            <button
              onClick={() => { setFilterType("ALL"); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterType === "ALL" ? "bg-purple-600 text-white shadow-md" : "text-white/60 hover:text-white"
              }`}
            >
              All ({transactions.length})
            </button>
            <button
              onClick={() => { setFilterType("CREDIT"); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterType === "CREDIT" ? "bg-emerald-600 text-white shadow-md" : "text-white/60 hover:text-white"
              }`}
            >
              Credits (+)
            </button>
            <button
              onClick={() => { setFilterType("DEBIT"); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterType === "DEBIT" ? "bg-purple-800 text-white shadow-md" : "text-white/60 hover:text-white"
              }`}
            >
              Debits (-)
            </button>
          </div>
        </div>

        {/* Search & Sort Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <SearchBar
              value={searchQuery}
              onSearch={(q) => { setSearchQuery(q); setCurrentPage(1); }}
              placeholder="Search description, reference, source..."
            />
          </div>
          <div>
            <SortDropdown<"createdAt" | "amount">
              options={[
                { label: "Date Created", value: "createdAt" },
                { label: "Amount", value: "amount" },
              ]}
              value={sortConfig}
              onSortChange={(newSort) => setSortConfig(newSort)}
            />
          </div>
        </div>

        {/* Transactions Table / List */}
        {loading ? (
          <div className="p-12 text-center text-purple-300 animate-pulse">Loading transaction ledger...</div>
        ) : paginatedTxs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <CreditCard size={36} className="text-white/20 mx-auto" />
            <p className="text-xs font-semibold text-white/60">No matching transactions found.</p>
            <p className="text-[11px] text-white/35 max-w-xs mx-auto">
              Try adjusting your search query or filter selection.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {paginatedTxs.map((tx) => {
              const isCredit = tx.type === "CREDIT";
              const dateStr = new Date(tx.createdAt).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={tx.id}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isCredit
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                      }`}
                    >
                      {isCredit ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-white">
                          {tx.description || (isCredit ? "Wallet Credit" : "Wallet Payment")}
                        </h4>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            tx.source === "BOOKING_REFUND"
                              ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                              : tx.source === "WALLET_TOPUP"
                              ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                              : tx.source === "BOOKING_PAYMENT"
                              ? "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                              : "bg-white/10 text-white/70"
                          }`}
                        >
                          {tx.source.replace("_", " ")}
                        </span>
                      </div>

                      <p className="text-[11px] text-white/40 mt-0.5 flex items-center gap-2">
                        <Calendar size={12} /> {dateStr}
                        {tx.bookingId && <span className="font-mono text-[10px] text-white/30">| Booking ID: {tx.bookingId.slice(-8)}</span>}
                      </p>
                    </div>
                  </div>

                  <div className="text-right sm:text-right flex sm:flex-col justify-between items-center sm:items-end">
                    <span
                      className={`text-base font-extrabold font-mono ${
                        isCredit ? "text-emerald-400" : "text-purple-300"
                      }`}
                    >
                      {isCredit ? "+" : "-"}Rs.{tx.amount}
                    </span>
                    <span className="text-[10px] text-emerald-400/80 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      COMPLETED
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Bar */}
        {totalItems > 0 && (
          <div className="pt-4 border-t border-white/10">
            <Pagination
              currentPage={validCurrentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={pageSize}
              onPageChange={(page) => setCurrentPage(page)}
              onItemsPerPageChange={(newSize) => { setPageSize(newSize); setCurrentPage(1); }}
            />
          </div>
        )}
      </div>

      {/* Add Funds via Payment Checkout Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#0A051D] border border-emerald-500/30 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PlusCircle className="text-emerald-400" size={20} />
                Add Money via Payment Gateway
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/40 hover:text-white transition cursor-pointer"
              >
                <XCircle size={18} />
              </button>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-xs space-y-1">
              <p className="text-emerald-300 font-bold">Secure Payment Gateway Checkout</p>
              <p className="text-emerald-200/80">
                Current Balance: <strong>Rs.{currentBalance.toLocaleString()}</strong> | Max Limit: <strong>Rs.{MAX_WALLET_LIMIT.toLocaleString()}</strong>
              </p>
              <p className="text-emerald-200/60 text-[11px] mt-1">
                You can add up to <strong>Rs.{remainingCap.toLocaleString()}</strong> to your wallet right now.
              </p>
            </div>

            {/* Quick Preset Buttons */}
            <div>
              <label className="text-[11px] font-semibold text-white/50 block mb-2">Quick Select Amount</label>
              <div className="grid grid-cols-4 gap-2">
                {[500, 1000, 2000, 5000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAddAmount(String(amt))}
                    className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      addAmount === String(amt)
                        ? "bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30"
                        : "bg-white/5 border-white/10 text-white/70 hover:border-emerald-500/40 hover:text-white"
                    }`}
                  >
                    +Rs.{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount Input */}
            <div>
              <label className="text-[11px] font-semibold text-white/50 block mb-1">Enter Top-up Amount (Rs.)</label>
              <input
                type="number"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                placeholder="E.g. 1500"
                min={1}
                max={remainingCap}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 font-bold"
              />
            </div>

            {isOverLimit && (
              <div className="flex items-center gap-1.5 text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
                <AlertCircle size={14} /> Exceeds ₹10,000 max limit by ₹{(currentBalance + numAddAmount - MAX_WALLET_LIMIT).toLocaleString()}.
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleProceedToPaymentCheckout}
                disabled={adding || isOverLimit || numAddAmount <= 0}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition disabled:opacity-40 cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-600/30"
              >
                {adding ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <ExternalLink size={14} />
                )}
                {adding ? "Initializing Gateway..." : `Pay Rs.${numAddAmount.toLocaleString()} via Gateway`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserWalletPage;
