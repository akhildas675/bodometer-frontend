import React, { useCallback, useEffect, useState } from "react";
import {
  CalendarClock,
  Calendar,
  Clock,
  User,
  AlertCircle,
  XCircle,
  RefreshCw,
  Send,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Sparkles,
} from "lucide-react";
import {
  clientBookingService,
  BookingResponseData,
  AvailableSlot,
  AvailableDateOverview,
} from "@/modules/booking/service/client-booking.service";
import SearchBar from "@/features/controls/search/search";
import SortDropdown, { SortConfig } from "@/features/controls/sort/sort";
import Pagination from "@/features/controls/pagination/pagination";
import { toast } from "sonner";

// ─── Mini Calendar Component ───────────────────────────────────────────────────
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
function getMondayDow(date: Date) { return (date.getDay() + 6) % 7; }
function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }

interface MiniCalendarProps {
  trainerId: string;
  serviceId: string;
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({ trainerId, serviceId, selectedDate, onDateSelect }) => {
  const now = new Date();
  const [month, setMonth] = useState(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);
  const [overview, setOverview] = useState<AvailableDateOverview[]>([]);
  const [loading, setLoading] = useState(false);

  const today = now.toISOString().split("T")[0];
  const [year, mon] = month.split("-").map(Number);

  useEffect(() => {
    if (!trainerId || !serviceId) return;
    setLoading(true);
    clientBookingService.getAvailableDates(trainerId, serviceId, month)
      .then(setOverview)
      .catch(() => toast.error("Failed to load date overview."))
      .finally(() => setLoading(false));
  }, [trainerId, serviceId, month]);

  const dateMap = new Map<string, AvailableDateOverview>();
  for (const d of overview) dateMap.set(d.date, d);

  const firstDay = getMondayDow(new Date(year, mon - 1, 1));
  const total = daysInMonth(year, mon - 1);

  const prevMonth = () => {
    const d = new Date(year, mon - 2, 1);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };
  const nextMonth = () => {
    const d = new Date(year, mon, 1);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };

  const monthLabel = new Date(year, mon - 1, 1).toLocaleString("default", { month: "short", year: "numeric" });

  const cells: React.ReactNode[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(<div key={`e${i}`} />);
  for (let day = 1; day <= total; day++) {
    const ds = `${year}-${String(mon).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const ov = dateMap.get(ds);
    const isPast = ds < today;
    const isSelected = ds === selectedDate;
    const status = ov?.status;

    let cls = "h-7 sm:h-8 rounded-lg flex flex-col items-center justify-center text-[10px] sm:text-xs font-bold transition-all duration-100 select-none ";
    let clickable = false;

    if (isPast) { cls += "opacity-20 cursor-not-allowed text-white/30 "; }
    else if (loading) { cls += "animate-pulse bg-white/5 text-transparent cursor-default "; }
    else if (status === "AVAILABLE") {
      clickable = true;
      cls += isSelected
        ? "bg-purple-600 text-white ring-2 ring-purple-400/60 scale-105 cursor-pointer shadow-md shadow-purple-600/40 "
        : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-400/50 cursor-pointer ";
    } else if (status === "LEAVE") { cls += "bg-red-500/10 border border-red-500/20 text-red-400 opacity-60 cursor-not-allowed "; }
    else if (status === "FULL")   { cls += "bg-orange-500/10 border border-orange-500/20 text-orange-400 opacity-60 cursor-not-allowed "; }
    else if (status === "OFF")    { cls += "bg-white/[0.02] border border-white/5 text-white/20 opacity-40 cursor-not-allowed "; }
    else                          { cls += "text-white/25 cursor-not-allowed "; }

    cells.push(
      <div key={ds} onClick={clickable && !isPast ? () => onDateSelect(ds) : undefined} className={cls} title={status || ""}>
        {day}
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <button type="button" onClick={prevMonth} className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center cursor-pointer transition">
          <ChevronLeft size={13} />
        </button>
        <span className="text-xs font-bold text-white tracking-wide">{monthLabel}</span>
        <button type="button" onClick={nextMonth} className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center cursor-pointer transition">
          <ChevronRight size={13} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {DAY_LABELS.map(l => (
          <div key={l} className="text-center text-[9px] font-bold uppercase text-white/30 py-0.5">{l}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">{cells}</div>
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between pt-1.5 border-t border-white/5 text-[9px] text-white/40">
        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Available</span>
        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-orange-500" />Full</span>
        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500" />Leave</span>
        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-white/20" />Off</span>
      </div>
    </div>
  );
};

// ─── Main Tab ──────────────────────────────────────────────────────────────────
export const UpcomingSessionsTab: React.FC = () => {
  const [sessions, setSessions] = useState<BookingResponseData[]>([]);
  const [loading, setLoading] = useState(true);

  // Search, Filter, Sort, Pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortConfig, setSortConfig] = useState<SortConfig<"bookingDate" | "userName">>({
    field: "bookingDate",
    order: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);

  // Cancel Modal
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState<BookingResponseData | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  // Reschedule Modal
  const [selectedBookingForReschedule, setSelectedBookingForReschedule] = useState<BookingResponseData | null>(null);
  const [proposedDate, setProposedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [customMode, setCustomMode] = useState(false);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [proposing, setProposing] = useState(false);

  const fetchUpcoming = () => {
    setLoading(true);
    clientBookingService
      .getTrainerBookings("upcoming")
      .then((data) => setSessions(data))
      .catch(() => toast.error("Failed to load upcoming sessions."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUpcoming(); }, []);

  const loadSlotsForDate = useCallback((date: string, booking: BookingResponseData) => {
    if (!date || !booking) return;
    setSelectedSlot(null);
    setCustomMode(false);
    setCustomStart("");
    setCustomEnd("");
    setLoadingSlots(true);
    clientBookingService
      .getAvailableSlots(booking.trainerId, booking.serviceId, date)
      .then((slots) => {
        setAvailableSlots(slots);
        if (slots.length === 0) setCustomMode(true);
      })
      .catch(() => { setAvailableSlots([]); setCustomMode(true); })
      .finally(() => setLoadingSlots(false));
  }, []);

  const handleDateSelect = (date: string) => {
    setProposedDate(date);
    if (selectedBookingForReschedule) loadSlotsForDate(date, selectedBookingForReschedule);
  };

  const closeRescheduleModal = () => {
    setSelectedBookingForReschedule(null);
    setProposedDate("");
    setAvailableSlots([]);
    setSelectedSlot(null);
    setCustomMode(false);
    setCustomStart("");
    setCustomEnd("");
    setRescheduleReason("");
  };

  const handleTrainerCancel = async () => {
    if (!selectedBookingForCancel) return;
    if (!cancelReason.trim()) { toast.error("Please provide a reason for cancelling this session."); return; }
    try {
      setCancelling(true);
      await clientBookingService.cancelBooking(selectedBookingForCancel.id, cancelReason);
      toast.success("Session cancelled. 100% refund initiated to client.");
      setSelectedBookingForCancel(null);
      setCancelReason("");
      fetchUpcoming();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to cancel session.";
      toast.error(msg);
    } finally {
      setCancelling(false);
    }
  };

  const handleTrainerProposeReschedule = async () => {
    if (!selectedBookingForReschedule) return;
    if (!proposedDate) { toast.error("Please select an available date from the calendar."); return; }
    if (!rescheduleReason.trim()) { toast.error("Please enter a reason for the reschedule."); return; }

    let startISO: string;
    let endISO: string;
    let bufferISO: string;

    if (customMode) {
      if (!customStart || !customEnd) { toast.error("Please enter start and end times."); return; }
      startISO = new Date(`${proposedDate}T${customStart}:00`).toISOString();
      endISO   = new Date(`${proposedDate}T${customEnd}:00`).toISOString();
      bufferISO = new Date(new Date(endISO).getTime() + 15 * 60_000).toISOString();
    } else {
      if (!selectedSlot) { toast.error("Please select an available time slot."); return; }
      startISO  = selectedSlot.startTime;
      endISO    = selectedSlot.endTime;
      bufferISO = selectedSlot.bufferEndTime;
    }

    try {
      setProposing(true);
      await clientBookingService.proposeRescheduleByTrainer(
        selectedBookingForReschedule.id,
        startISO,
        endISO,
        bufferISO,
        rescheduleReason,
      );
      toast.success("Reschedule proposal sent to client successfully!");
      closeRescheduleModal();
      fetchUpcoming();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to propose reschedule.";
      toast.error(msg);
    } finally {
      setProposing(false);
    }
  };

  // Calculate Filter, Search, Sort, Pagination
  let processedSessions = [...sessions];

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
        (s.serviceSnapshot?.name && s.serviceSnapshot.name.toLowerCase().includes(q))
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
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarClock size={22} className="text-sky-400" />
            Upcoming Client Sessions
          </h2>
          <p className="text-xs text-white/50 mt-1">
            Manage active bookings, request reschedule proposals, or cancel sessions.
          </p>
        </div>
        <button onClick={fetchUpcoming} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition cursor-pointer">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Filter, Search, Sort Controls */}
      <div className="bg-[#03000D]/80 border border-white/10 rounded-2xl p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10 overflow-x-auto">
            {["ALL", "CONFIRMED", "RESCHEDULE_PENDING"].map((st) => (
              <button
                key={st}
                onClick={() => { setStatusFilter(st); setCurrentPage(1); }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  statusFilter === st ? "bg-sky-600 text-white shadow-md" : "text-white/60 hover:text-white"
                }`}
              >
                {st === "ALL" ? `All (${sessions.length})` : st.replace("_", " ")}
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
        <div className="p-12 text-center text-sky-300 animate-pulse">Loading upcoming sessions...</div>
      ) : paginatedSessions.length === 0 ? (
        <div className="bg-[#03000D]/80 border border-white/10 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
          <CalendarClock size={40} className="text-sky-400/40 mx-auto" />
          <h3 className="text-base font-bold text-white">No Matching Sessions</h3>
          <p className="text-xs text-white/50">No sessions match your search or filter selection.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedSessions.map((b) => {
            const startDate = new Date(b.startTime);
            const endDate   = new Date(b.endTime);
            const dateStr   = new Date(b.bookingDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
            const timeStr   = `${startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – ${endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

            return (
              <div key={b.id} className="bg-[#03000D]/80 border border-white/10 rounded-2xl p-5 space-y-4 hover:border-sky-500/30 transition relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-sky-300 bg-sky-500/10 border border-sky-500/20 px-2.5 py-0.5 rounded-full">
                    {b.bookingNumber}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    b.status === "RESCHEDULE_PENDING"
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  }`}>
                    {b.status === "RESCHEDULE_PENDING" ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
                    {b.status === "RESCHEDULE_PENDING" ? "Reschedule Pending" : "Confirmed"}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-white/80">
                  <div className="flex items-center gap-2 font-semibold text-white">
                    <User size={14} className="text-sky-400" />
                    <span>{b.userName || "Client"}</span>
                    {b.userEmail && <span className="text-[11px] text-white/40">({b.userEmail})</span>}
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <Calendar size={14} className="text-sky-400" /><span>{dateStr}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <Clock size={14} className="text-sky-400" /><span>{timeStr}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                  <span className="text-white/40">Fee: Rs.{b.price}</span>
                  <div className="flex items-center gap-2">
                    {b.status === "RESCHEDULE_PENDING" ? (
                      <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 font-semibold text-xs border border-amber-500/30 flex items-center gap-1.5">
                        <AlertCircle size={13} /> Proposal Pending
                      </span>
                    ) : (
                      <button
                        onClick={() => { setSelectedBookingForReschedule(b); setProposedDate(""); setAvailableSlots([]); setSelectedSlot(null); setCustomMode(false); }}
                        className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-semibold text-xs transition border border-purple-500/30 cursor-pointer"
                      >
                        Reschedule
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedBookingForCancel(b)}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold text-xs transition border border-rose-500/30 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
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

      {/* ─── Cancel Modal ─────────────────────────────────────────────────── */}
      {selectedBookingForCancel && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#0A051D] border border-rose-500/30 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <XCircle className="text-rose-400" size={20} /> Cancel Client Session
            </h3>
            <p className="text-xs text-white/60">
              Trainer-initiated cancellations automatically issue a <strong className="text-rose-400">100% full refund</strong> to the client. Please enter a reason below.
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="E.g., Medical emergency, unforeseen schedule conflict..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-rose-500/50"
            />
            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setSelectedBookingForCancel(null)} className="px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white transition">Close</button>
              <button onClick={handleTrainerCancel} disabled={cancelling} className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition disabled:opacity-50">
                {cancelling ? "Cancelling..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Reschedule Modal (Compact Sleek Viewport Modal) ────────────────────── */}
      {selectedBookingForReschedule && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-[#0A051D] border border-purple-500/30 rounded-3xl p-4 sm:p-5 max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex-shrink-0 pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="text-purple-400" size={18} />
                Propose Reschedule
              </h3>
              <p className="text-[11px] text-white/50 mt-0.5">
                Session <strong className="text-purple-300">#{selectedBookingForReschedule.bookingNumber}</strong> — pick an available date below.
              </p>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 scrollbar-thin scrollbar-thumb-purple-900/40">
              {/* Step 1: Calendar */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-3 space-y-2">
                <p className="text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-purple-500/20 flex items-center justify-center text-[9px]">1</span>
                  Pick a Date
                </p>
                <MiniCalendar
                  trainerId={selectedBookingForReschedule.trainerId}
                  serviceId={selectedBookingForReschedule.serviceId}
                  selectedDate={proposedDate}
                  onDateSelect={handleDateSelect}
                />
              </div>

              {/* Step 2: Slot Selection */}
              {proposedDate && (
                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-3 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-purple-500/20 flex items-center justify-center text-[9px]">2</span>
                      {customMode ? "Create Custom Time Slot" : "Select Available Slot"}
                    </p>
                    {!loadingSlots && !customMode && availableSlots.length > 0 && (
                      <button
                        type="button"
                        onClick={() => { setSelectedSlot(null); setCustomMode(true); }}
                        className="text-[10px] text-purple-400/80 hover:text-purple-300 flex items-center gap-1 transition cursor-pointer"
                      >
                        <Pencil size={10} /> Custom time
                      </button>
                    )}
                    {!loadingSlots && customMode && availableSlots.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setCustomMode(false)}
                        className="text-[10px] text-purple-400/80 hover:text-purple-300 flex items-center gap-1 transition cursor-pointer"
                      >
                        <Sparkles size={10} /> Pick available slot
                      </button>
                    )}
                  </div>

                  {loadingSlots ? (
                    <div className="flex items-center justify-center gap-2 py-3">
                      <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs text-white/40">Calculating slots…</span>
                    </div>
                  ) : customMode ? (
                    <div className="space-y-2.5">
                      {availableSlots.length === 0 && (
                        <p className="text-[10px] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-xl px-2.5 py-1.5">
                          No available slots for this date — set a custom time below.
                        </p>
                      )}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-[10px] text-white/40 block mb-1">Start Time</label>
                          <input
                            type="time"
                            value={customStart}
                            onChange={(e) => setCustomStart(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500/50"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-white/40 block mb-1">End Time</label>
                          <input
                            type="time"
                            value={customEnd}
                            onChange={(e) => setCustomEnd(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500/50"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {availableSlots.map((slot, i) => {
                        const isSelected = selectedSlot?.startTime === slot.startTime;
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            className={`p-2 rounded-xl border text-center flex items-center justify-center gap-1.5 text-xs font-bold transition cursor-pointer ${
                              isSelected
                                ? "bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30"
                                : "bg-white/[0.03] text-white/70 border-white/10 hover:border-purple-500/40 hover:text-white"
                            }`}
                          >
                            <Clock size={12} />{slot.formattedTime}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Reason */}
              <div>
                <label className="text-[11px] font-medium text-white/60 block mb-1">Reason for Reschedule</label>
                <textarea
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  placeholder="E.g., Personal emergency, shift adjustment..."
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50"
                />
              </div>
            </div>

            {/* Sticky Actions Footer */}
            <div className="flex-shrink-0 pt-3 border-t border-white/10 flex items-center justify-end gap-3">
              <button onClick={closeRescheduleModal} className="px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white transition cursor-pointer">
                Close
              </button>
              <button
                onClick={handleTrainerProposeReschedule}
                disabled={proposing}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-600/30"
              >
                {proposing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={13} />}
                {proposing ? "Sending..." : "Send Proposal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingSessionsTab;
