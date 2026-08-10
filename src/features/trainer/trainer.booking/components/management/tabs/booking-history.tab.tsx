import React, { useEffect, useState } from "react";
import { History, Calendar, Clock, User, XCircle, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { clientBookingService, BookingResponseData } from "@/modules/booking/service/client-booking.service";
import SearchBar from "@/features/controls/search/search";
import SortDropdown, { SortConfig } from "@/features/controls/sort/sort";
import Pagination from "@/features/controls/pagination/pagination";
import { toast } from "sonner";

export const BookingHistoryTab: React.FC = () => {
  const [historySessions, setHistorySessions] = useState<BookingResponseData[]>([]);
  const [loading, setLoading] = useState(true);

  // Search, Filter, Sort, Pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortConfig, setSortConfig] = useState<SortConfig<"bookingDate" | "userName">>({
    field: "bookingDate",
    order: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);

  const fetchHistory = () => {
    setLoading(true);
    clientBookingService
      .getTrainerBookings("history")
      .then((data) => setHistorySessions(data))
      .catch(() => toast.error("Failed to load booking history."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getStatusBadge = (b: BookingResponseData) => {
    switch (b.status.toUpperCase()) {
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 size={12} /> Completed
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <XCircle size={12} /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
            <AlertCircle size={12} /> {b.status}
          </span>
        );
    }
  };

  // Search, Filter, Sort, Pagination calculation
  let processedSessions = [...historySessions];

  if (statusFilter !== "ALL") {
    processedSessions = processedSessions.filter((s) => s.status.toUpperCase() === statusFilter);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    processedSessions = processedSessions.filter(
      (s) =>
        s.bookingNumber.toLowerCase().includes(q) ||
        (s.userName && s.userName.toLowerCase().includes(q)) ||
        (s.userEmail && s.userEmail.toLowerCase().includes(q)) ||
        (s.serviceSnapshot?.name && s.serviceSnapshot.name.toLowerCase().includes(q)) ||
        (s.serviceName && s.serviceName.toLowerCase().includes(q))
    );
  }

  processedSessions.sort((a, b) => {
    let comparison = 0;
    if (sortConfig.field === "bookingDate") {
      comparison = new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    } else if (sortConfig.field === "userName") {
      comparison = (a.userName || "").localeCompare(b.userName || "");
    }
    return sortConfig.order === "asc" ? comparison : -comparison;
  });

  const totalItems = processedSessions.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedSessions = processedSessions.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6 max-w-5xl text-white">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <History size={22} className="text-purple-400" />
            Booking History
          </h2>
          <p className="text-xs text-white/50 mt-1">
            View completed sessions, past bookings, and cancellation audit records.
          </p>
        </div>
        <button
          onClick={fetchHistory}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition cursor-pointer"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Filter, Search & Sort Controls Bar */}
      <div className="bg-[#03000D]/80 border border-white/10 rounded-2xl p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10 overflow-x-auto">
            {["ALL", "COMPLETED", "CANCELLED"].map((st) => (
              <button
                key={st}
                onClick={() => { setStatusFilter(st); setCurrentPage(1); }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  statusFilter === st ? "bg-purple-600 text-white shadow-md" : "text-white/60 hover:text-white"
                }`}
              >
                {st === "ALL" ? `All (${historySessions.length})` : st}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <SearchBar
              value={searchQuery}
              onSearch={(q) => { setSearchQuery(q); setCurrentPage(1); }}
              placeholder="Search by client name, email, booking #..."
            />
          </div>
          <div>
            <SortDropdown<"bookingDate" | "userName">
              options={[
                { label: "Session Date", value: "bookingDate" },
                { label: "Client Name", value: "userName" },
              ]}
              value={sortConfig}
              onSortChange={(newSort) => setSortConfig(newSort)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-purple-300 animate-pulse">Loading booking history...</div>
      ) : paginatedSessions.length === 0 ? (
        <div className="bg-[#03000D]/80 border border-white/10 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
          <History size={40} className="text-purple-400/40 mx-auto" />
          <h3 className="text-base font-bold text-white">No Matching History</h3>
          <p className="text-xs text-white/50">No sessions match your search query or filter selection.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedSessions.map((b) => {
              const startDate = new Date(b.startTime);
              const endDate = new Date(b.endTime);
              const dateStr = new Date(b.bookingDate).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              const timeStr = `${startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – ${endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

              return (
                <div
                  key={b.id}
                  className="bg-[#03000D]/80 border border-white/10 rounded-2xl p-5 space-y-3 hover:border-purple-500/30 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
                      {b.bookingNumber}
                    </span>
                    {getStatusBadge(b)}
                  </div>

                  <div className="space-y-1.5 text-xs text-white/80">
                    <div className="flex items-center gap-2 font-semibold text-white">
                      <User size={14} className="text-purple-400" />
                      <span>{b.userName || "Client"}</span>
                      {b.userEmail && <span className="text-[11px] text-white/40">({b.userEmail})</span>}
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <Calendar size={14} className="text-purple-400" />
                      <span>{dateStr}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <Clock size={14} className="text-purple-400" />
                      <span>{timeStr}</span>
                    </div>
                  </div>

                  {b.cancellationDetails && (
                    <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-xs space-y-1 text-rose-300">
                      <div className="font-bold flex items-center justify-between">
                        <span>Cancelled by {b.cancellationDetails.cancelledBy}</span>
                        <span>Refund: {b.cancellationDetails.refundPercentage}% (Rs.{b.cancellationDetails.refundAmount})</span>
                      </div>
                      <p className="text-[11px] text-rose-200/80">Reason: {b.cancellationDetails.reason}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-white/40">
                    <span>Fee: Rs.{b.price}</span>
                    <span>Service: {b.serviceSnapshot?.name || b.serviceName || "Coaching"}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Bar */}
          {totalItems > 0 && (
            <div className="pt-4 border-t border-white/10 bg-[#03000D]/80 p-4 rounded-2xl">
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
      )}
    </div>
  );
};

export default BookingHistoryTab;
