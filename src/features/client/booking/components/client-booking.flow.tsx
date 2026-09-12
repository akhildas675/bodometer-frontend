import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Clock,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ShieldAlert,
  CalendarDays,
  Wallet,
  XCircle,
  ShieldCheck,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { USER_UI_ROUTES } from "@/constants/constant-routes/ui-routes/user.ui-constant.routes";
import { subscriptionService } from "@/modules/subscription/service/subscription.service";
import { CoachingListItem } from "@/modules/coaching/types/coaching.interface";
import { coachingService } from "@/modules/coaching/service/coaching.service";
import {
  clientBookingService,
  AvailableSlot,
  AvailableDateOverview,
} from "@/modules/booking/service/client-booking.service";
import { walletService, UserWalletData } from "@/modules/wallet/service/wallet.service";
import { BookingCalendar } from "./booking-calendar";

interface ClientBookingFlowProps {
  trainerId: string;
  trainerName?: string;
}

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export const ClientBookingFlow: React.FC<ClientBookingFlowProps> = ({
  trainerId,
  trainerName = "Trainer",
}) => {
  const navigate = useNavigate();
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);

  const [services, setServices] = useState<CoachingListItem[]>([]);
  const [selectedService, setSelectedService] = useState<CoachingListItem | null>(null);

  const [activeMonth, setActiveMonth] = useState<string>(getCurrentMonth);
  const [availableDates, setAvailableDates] = useState<AvailableDateOverview[]>([]);
  const [loadingDates, setLoadingDates] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  // 0. Check active subscription
  useEffect(() => {
    subscriptionService
      .getActiveSubscription()
      .then((res) => {
        if (res?.data) {
          setHasSubscription(true);
        } else {
          toast.error("Active subscription required to book a session. Redirecting to plans...");
          navigate(USER_UI_ROUTES.USER_SUBSCRIPTIONS, { replace: true });
        }
      })
      .catch(() => {
        toast.error("Active subscription required to book a session. Redirecting to plans...");
        navigate(USER_UI_ROUTES.USER_SUBSCRIPTIONS, { replace: true });
      })
      .finally(() => {
        setCheckingSubscription(false);
      });
  }, [navigate]);

  // 1. Fetch active coaching services
  useEffect(() => {
    coachingService
      .getCoachingServices()
      .then((res) => {
        if (res?.data && Array.isArray(res.data)) {
          const active = res.data.filter((s) => s.isActive !== false);
          setServices(active);
          if (active.length > 0) setSelectedService(active[0]);
        }
      })
      .catch(() => toast.error("Failed to load coaching services."))
      .finally(() => setLoadingServices(false));
  }, []);

  // 2. Fetch available-dates overview when service or month changes
  const fetchMonthOverview = useCallback(() => {
    if (!trainerId || !selectedService) return;
    const svcId =
      selectedService._id ||
      selectedService.coachingId ||
      selectedService.serviceId ||
      selectedService.serviceType;

    setLoadingDates(true);
    setAvailableDates([]);
    setSelectedDate("");
    setAvailableSlots([]);
    setSelectedSlot(null);

    clientBookingService
      .getAvailableDates(trainerId, svcId, activeMonth)
      .then((dates) => {
        setAvailableDates(dates);
        const first = dates.find((d) => d.isAvailable && d.status === "AVAILABLE");
        if (first) setSelectedDate(first.date);
      })
      .catch(() => toast.error("Could not load available dates for this month."))
      .finally(() => setLoadingDates(false));
  }, [trainerId, selectedService, activeMonth]);

  useEffect(() => {
    fetchMonthOverview();
  }, [fetchMonthOverview]);

  // 3. Fetch time slots whenever date changes
  useEffect(() => {
    if (!trainerId || !selectedService || !selectedDate) {
      setAvailableSlots([]);
      return;
    }
    const svcId =
      selectedService._id ||
      selectedService.coachingId ||
      selectedService.serviceId ||
      selectedService.serviceType;

    setLoadingSlots(true);
    setSelectedSlot(null);

    clientBookingService
      .getAvailableSlots(trainerId, svcId, selectedDate)
      .then((slots) => setAvailableSlots(slots))
      .catch(() => {
        setAvailableSlots([]);
        toast.error("Could not calculate available slots for selected date.");
      })
      .finally(() => setLoadingSlots(false));
  }, [trainerId, selectedService, selectedDate]);

  // State for Wallet & Payment Modal
  const [wallet, setWallet] = useState<UserWalletData | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"WALLET" | "ONLINE" | "SPLIT">("WALLET");

  // Fetch wallet balance
  useEffect(() => {
    walletService.getWalletBalance().then(setWallet).catch(() => null);
  }, []);

  const openConfirmationModal = () => {
    if (!selectedService || !selectedSlot) {
      toast.error("Please select a service and an available time slot.");
      return;
    }
    const balance = wallet?.balance || 0;
    const price = selectedService.price || 0;

    if (balance >= price) {
      setSelectedPaymentMethod("WALLET");
    } else if (balance > 0) {
      setSelectedPaymentMethod("SPLIT");
    } else {
      setSelectedPaymentMethod("ONLINE");
    }
    setShowConfirmModal(true);
  };

  const handleExecuteBooking = async () => {
    if (!selectedService || !selectedSlot) return;
    const svcId =
      selectedService.id ||
      selectedService.coachingId ||
      selectedService._id ||
      selectedService.serviceId ||
      selectedService.serviceType;

    setBookingInProgress(true);
    try {
      const response = await clientBookingService.createBooking({
        trainerId,
        serviceId: svcId,
        bookingDate: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        bufferEndTime: selectedSlot.bufferEndTime,
        paymentMethod: selectedPaymentMethod,
      });

      setShowConfirmModal(false);

      if (response.checkoutUrl) {
        toast.success("Redirecting to secure payment checkout...");
        window.location.href = response.checkoutUrl;
      } else {
        toast.success("Session booked successfully!");
        window.location.href = `/client/booking/success?bookingId=${response.booking.id}`;
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to complete booking. Slot may have been taken.",
      );
    } finally {
      setBookingInProgress(false);
    }
  };

  if (checkingSubscription || loadingServices) {
    return (
      <div className="p-8 space-y-4 animate-pulse max-w-4xl mx-auto">
        <div className="flex items-center gap-3 text-purple-400 mb-2">
          <Sparkles className="animate-spin text-purple-400" size={20} />
          <span className="text-sm font-medium text-white/70">Checking subscription status...</span>
        </div>
        <div className="h-10 w-48 bg-white/5 rounded-xl" />
        <div className="h-64 bg-white/5 rounded-2xl" />
      </div>
    );
  }

  if (!hasSubscription) {
    return null;
  }

  const selectedDateLabel = selectedDate
    ? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <Sparkles className="text-purple-400" size={28} />
            Book Session with {trainerName}
          </h1>
          <p className="text-xs sm:text-sm text-white/50 mt-1">
            Select a service, pick an available date, then choose a time slot.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Step 1: Select Service */}
          <div className="bg-[#03000D]/80 backdrop-blur-xl border border-white/10 rounded-[24px] p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs">
                1
              </span>
              Select Coaching Service
            </div>

            {services.length === 0 ? (
              <p className="text-xs text-white/40 italic">No coaching services available.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((svc) => {
                  const svcId = svc._id || svc.coachingId || svc.serviceId || svc.serviceType;
                  const isSelected =
                    selectedService &&
                    (selectedService._id ||
                      selectedService.coachingId ||
                      selectedService.serviceId ||
                      selectedService.serviceType) === svcId;

                  return (
                    <div
                      key={svcId}
                      onClick={() => setSelectedService(svc)}
                      className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? "bg-purple-500/10 border-purple-500/60 shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/50"
                          : "bg-white/[0.02] border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-white">{svc.serviceType}</h3>
                          {isSelected && <CheckCircle2 size={16} className="text-purple-400" />}
                        </div>
                        {svc.description && (
                          <p className="text-[11px] text-white/50 mt-1 line-clamp-2 leading-relaxed">
                            {svc.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                        <span className="text-white/60 flex items-center gap-1">
                          <Clock size={13} /> {svc.durationMinutes} mins
                        </span>
                        <span className="font-extrabold text-purple-300">Rs.{svc.price}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Step 2: Calendar – Available Dates */}
          <div className="bg-[#03000D]/80 backdrop-blur-xl border border-white/10 rounded-[24px] p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs">
                2
              </span>
              <CalendarDays size={14} />
              Select Available Date
            </div>

            {!selectedService ? (
              <p className="text-xs text-white/40 italic">Please select a service first.</p>
            ) : (
              <BookingCalendar
                availableDates={availableDates}
                selectedDate={selectedDate}
                activeMonth={activeMonth}
                loading={loadingDates}
                onDateSelect={(date) => {
                  setSelectedDate(date);
                  setSelectedSlot(null);
                }}
                onMonthChange={setActiveMonth}
              />
            )}
          </div>

          {/* Step 3: Time Slots */}
          {selectedDate && (
            <div className="bg-[#03000D]/80 backdrop-blur-xl border border-white/10 rounded-[24px] p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs">
                    3
                  </span>
                  Available Time Slots
                </div>
                <span className="text-xs text-white/40">{availableSlots.length} Slots Found</span>
              </div>

              <p className="text-xs text-white/50 -mt-1">{selectedDateLabel}</p>

              {loadingSlots ? (
                <div className="p-8 text-center space-y-2">
                  <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-white/50">Calculating live bookable slots...</p>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-center space-y-2">
                  <ShieldAlert className="text-amber-400 mx-auto" size={24} />
                  <p className="text-xs font-semibold text-amber-200">No slots available for this date.</p>
                  <p className="text-[11px] text-amber-200/60 leading-relaxed">
                    The trainer may be fully booked on {selectedDateLabel}. Select another available date.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availableSlots.map((slot, index) => {
                    const isSelected = selectedSlot?.startTime === slot.startTime;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3 rounded-xl border text-center transition cursor-pointer flex items-center justify-center gap-2 text-xs font-bold ${
                          isSelected
                            ? "bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-600/30"
                            : "bg-white/[0.03] text-white/80 border-white/10 hover:border-purple-500/40 hover:text-white"
                        }`}
                      >
                        <Clock size={14} />
                        {slot.formattedTime}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <div className="bg-[#03000D]/80 backdrop-blur-xl border border-white/10 rounded-[24px] p-6 space-y-6 sticky top-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CreditCard className="text-purple-400" size={18} />
              Booking Summary
            </h2>

            <div className="space-y-3 border-b border-white/10 pb-4 text-xs">
              <div className="flex justify-between">
                <span className="text-white/40">Trainer</span>
                <span className="text-white font-semibold">{trainerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Service</span>
                <span className="text-white font-semibold">{selectedService?.serviceType || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Date</span>
                <span className="text-white font-semibold">
                  {selectedDate
                    ? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Time Slot</span>
                <span className="text-purple-300 font-semibold">
                  {selectedSlot?.formattedTime || "Select a slot"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50">Total Amount</span>
              <span className="text-xl font-extrabold text-white">
                Rs.{selectedService?.price || 0}
              </span>
            </div>

            <button
              type="button"
              disabled={!selectedSlot || bookingInProgress}
              onClick={openConfirmationModal}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-sm font-extrabold text-white shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Proceed to Booking & Payment <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation & Payment Method Selection Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#0A051D] border border-purple-500/30 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="text-purple-400" size={20} />
                Confirm Session Booking
              </h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-white/40 hover:text-white transition cursor-pointer"
              >
                <XCircle size={18} />
              </button>
            </div>

            {/* Session Summary Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-white/40">Trainer</span>
                <span className="text-white font-bold">{trainerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Service</span>
                <span className="text-white font-bold">{selectedService?.serviceType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Scheduled Time</span>
                <span className="text-purple-300 font-bold">
                  {selectedDate} ({selectedSlot?.formattedTime})
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10 text-sm">
                <span className="text-white/60">Total Fee</span>
                <span className="text-emerald-400 font-extrabold">Rs.{selectedService?.price}</span>
              </div>
            </div>

            {/* Wallet Info Badge */}
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-3 flex items-center justify-between text-xs">
              <span className="text-purple-300 font-semibold flex items-center gap-2">
                <Wallet size={16} /> Bodometer Wallet Balance:
              </span>
              <span className="text-white font-extrabold">Rs.{wallet?.balance || 0}</span>
            </div>

            {/* Payment Method Radio Options */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-white/50 block">Select Payment Method</label>

              {/* Wallet Option */}
              {(wallet?.balance || 0) >= (selectedService?.price || 0) && (
                <div
                  onClick={() => setSelectedPaymentMethod("WALLET")}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                    selectedPaymentMethod === "WALLET"
                      ? "bg-purple-900/40 border-purple-500 text-white shadow-lg"
                      : "bg-white/5 border-white/10 text-white/70 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Wallet size={18} className="text-purple-400" />
                    <div>
                      <p className="text-xs font-bold">Pay 100% via Bodometer Wallet</p>
                      <p className="text-[10px] text-white/40">Instant checkout using your Rs.{(wallet?.balance || 0).toLocaleString()} balance</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={selectedPaymentMethod === "WALLET"}
                    onChange={() => setSelectedPaymentMethod("WALLET")}
                    className="accent-purple-500 cursor-pointer"
                  />
                </div>
              )}

              {/* Split Payment Option */}
              {(wallet?.balance || 0) > 0 && (wallet?.balance || 0) < (selectedService?.price || 0) && (
                <div
                  onClick={() => setSelectedPaymentMethod("SPLIT")}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                    selectedPaymentMethod === "SPLIT"
                      ? "bg-purple-900/40 border-purple-500 text-white shadow-lg"
                      : "bg-white/5 border-white/10 text-white/70 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Wallet size={18} className="text-emerald-400" />
                    <div>
                      <p className="text-xs font-bold">Split Payment (Wallet + Card)</p>
                      <p className="text-[10px] text-white/40">
                        Pay Rs.{wallet?.balance || 0} via Wallet + Rs.{(selectedService?.price || 0) - (wallet?.balance || 0)} via Gateway
                      </p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={selectedPaymentMethod === "SPLIT"}
                    onChange={() => setSelectedPaymentMethod("SPLIT")}
                    className="accent-purple-500 cursor-pointer"
                  />
                </div>
              )}

              {/* Full Online Payment Option */}
              <div
                onClick={() => setSelectedPaymentMethod("ONLINE")}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                  selectedPaymentMethod === "ONLINE"
                    ? "bg-purple-900/40 border-purple-500 text-white shadow-lg"
                    : "bg-white/5 border-white/10 text-white/70 hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard size={18} className="text-purple-300" />
                  <div>
                    <p className="text-xs font-bold">Online Payment (Stripe / Credit Card)</p>
                    <p className="text-[10px] text-white/40">Pay full Rs.{(selectedService?.price || 0).toLocaleString()} via payment gateway</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={selectedPaymentMethod === "ONLINE"}
                  onChange={() => setSelectedPaymentMethod("ONLINE")}
                  className="accent-purple-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteBooking}
                disabled={bookingInProgress}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-2 shadow-lg shadow-purple-600/30 disabled:opacity-50"
              >
                {bookingInProgress ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <ShieldCheck size={14} />
                )}
                {bookingInProgress
                  ? "Processing..."
                  : selectedPaymentMethod === "ONLINE"
                  ? "Pay Online via Card / Gateway"
                  : selectedPaymentMethod === "SPLIT"
                  ? "Pay Split & Proceed to Gateway"
                  : "Confirm & Pay via Wallet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
