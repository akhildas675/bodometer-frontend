import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO, isSameDay } from "date-fns";
import { toast } from "sonner";
import { CalendarDays, Clock } from "lucide-react";
import { bookingService } from "@/modules/booking/service/booking.service";
import { TrainerSlot } from "@/modules/booking/types/booking.interface";
import { parseApiError } from "@/api/error.helper";
import ConfirmationModal from "@/ui.components/ui/confirm.dialog";
import PrimaryButton from "@/ui.components/ui/primary.button";
import { USER_UI_ROUTES } from "@/constants/constant-routes/ui-routes/user.ui-constant.routes";

interface UserTrainerSlotPickerProps {
  trainerId: string;
  trainerName: string;
}

export const UserTrainerSlotPicker: React.FC<UserTrainerSlotPickerProps> = ({
  trainerId,
  trainerName,
}) => {
  const navigate = useNavigate();
  const [slots, setSlots] = useState<TrainerSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TrainerSlot | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (trainerId) fetchSlots();
  }, [trainerId]);

  const fetchSlots = async () => {
    setIsLoading(true);
    try {
      const res = await bookingService.getTrainerAvailableSlots(trainerId);
      if (res.success && res.data) {
        setSlots(res.data);
      }
    } catch (error) {
      toast.error(parseApiError(error).message);
    } finally {
      setIsLoading(false);
    }
  };

  
  const datesWithSlots = useMemo(() => {
    const seen = new Set<string>();
    const dates: Date[] = [];
    for (const slot of slots) {
      const dateKey = format(parseISO(slot.startTime), "yyyy-MM-dd");
      if (!seen.has(dateKey)) {
        seen.add(dateKey);
        dates.push(parseISO(slot.startTime));
      }
    }
    return dates.sort((a, b) => a.getTime() - b.getTime());
  }, [slots]);

  const slotsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return slots.filter((s) => isSameDay(parseISO(s.startTime), selectedDate));
  }, [slots, selectedDate]);

  
  useEffect(() => {
    if (datesWithSlots.length > 0 && !selectedDate) {
      setSelectedDate(datesWithSlots[0]);
    }
  }, [datesWithSlots, selectedDate]);

  const handleBookingSubmit = async () => {
    if (!selectedSlot) return;
    setIsSubmitting(true);
    try {
      const res = await bookingService.createBooking({ slotId: selectedSlot.id });
      if (res.success) {
        toast.success("Booking requested! Awaiting trainer approval.");
        setIsConfirmModalOpen(false);
        navigate(USER_UI_ROUTES.USER_MY_BOOKINGS);
      }
    } catch (error) {
      toast.error(parseApiError(error).message);
      setIsConfirmModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <p className="text-white/40 text-sm py-4">
        This trainer currently has no available time slots scheduled.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date picker */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
          <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-indigo-400" />
            1. Pick a Date
          </h3>
          <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
            {datesWithSlots.map((date, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedDate(date);
                  setSelectedSlot(null);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all border text-xs font-medium ${
                  selectedDate && isSameDay(date, selectedDate)
                    ? "bg-indigo-600/25 border-indigo-500 text-indigo-300"
                    : "bg-white/5 border-transparent hover:bg-white/8 text-white"
                }`}
              >
                {format(date, "EEEE, MMMM d, yyyy")}
              </button>
            ))}
          </div>
        </div>

        {/* Slot picker */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              2. Available Times
            </h3>
            <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto">
              {slotsForSelectedDate.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  className={`px-2.5 py-2 rounded-lg text-xs font-medium transition border ${
                    selectedSlot?.id === slot.id
                      ? "bg-indigo-600 border-indigo-500 text-white"
                      : "bg-white/5 border-white/10 hover:bg-white/8 text-white"
                  }`}
                >
                  {format(parseISO(slot.startTime), "HH:mm")} –{" "}
                  {format(parseISO(slot.endTime), "HH:mm")}
                </button>
              ))}
            </div>
          </div>

          {selectedSlot && (
            <div className="mt-4 pt-3 border-t border-white/5">
              <p className="text-xs text-white/50 mb-3">
                Selected:{" "}
                <span className="text-white font-medium">
                  {format(parseISO(selectedSlot.startTime), "HH:mm")} –{" "}
                  {format(parseISO(selectedSlot.endTime), "HH:mm")}
                </span>{" "}
                on{" "}
                <span className="text-white font-medium">
                  {format(parseISO(selectedSlot.startTime), "MMM d, yyyy")}
                </span>
              </p>
              <PrimaryButton
                type="button"
                onClick={() => setIsConfirmModalOpen(true)}
                loading={isSubmitting}
                text="Request Booking"
              />
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleBookingSubmit}
        title="Confirm Booking Request"
        message={`Book a session with ${trainerName} on ${
          selectedSlot ? format(parseISO(selectedSlot.startTime), "MMM d, yyyy") : ""
        } at ${selectedSlot ? format(parseISO(selectedSlot.startTime), "HH:mm") : ""}?`}
        variant="primary"
        confirmText="Request Booking"
      />
    </div>
  );
};
