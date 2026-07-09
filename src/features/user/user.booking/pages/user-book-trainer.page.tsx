import { bookingService } from "@/modules/booking/service/booking.service";
import { trainerService } from "@/modules/trainer/service/trainer.service";
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { parseApiError } from "@/api/error.helper";
import { TrainerDetail } from "@/interface/trainer.interface";
import { TrainerSlot } from "@/modules/booking/types/booking.interface";
import { format, parseISO, isSameDay } from "date-fns";
import { toast } from "sonner";
import { ScreenLoader } from "@/ui.components/ui/screen-loader";
import ConfirmationModal from "@/ui.components/ui/confirm.dialog";
import PrimaryButton from "@/ui.components/ui/primary.button";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";
import { USER_UI_ROUTES } from "@/constants/constant-routes/ui-routes/user.ui-constant.routes";

const UserBookTrainerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [trainer, setTrainer] = useState<TrainerDetail | null>(null);
  const [slots, setSlots] = useState<TrainerSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TrainerSlot | null>(null);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (id) fetchTrainerData();
  }, [id]);

  const fetchTrainerData = async () => {
    setIsLoading(true);
    try {
      const [trainerRes, slotsRes] = await Promise.all([
        trainerService.getTrainerById(id!),
        bookingService.getTrainerAvailableSlots(id!),
      ]);

      if (trainerRes.success && trainerRes.data) {
        setTrainer(trainerRes.data);
      }
      if (slotsRes.success && slotsRes.data) {
        setSlots(slotsRes.data);
      }
    } catch (error) {
      toast.error(parseApiError(error).message);
      navigate(-1);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Group slots by date ───────────────────────────────────────────────────
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

  // Auto-select first available date
  useEffect(() => {
    if (datesWithSlots.length > 0 && !selectedDate) {
      setSelectedDate(datesWithSlots[0]);
    }
  }, [datesWithSlots]);

  const handleBookingSubmit = async () => {
    if (!selectedSlot) return;
    setIsSubmitting(true);
    try {
      const res = await bookingService.createBooking({
        slotId: selectedSlot.id,
        note: note.trim() || undefined,
      });
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

  if (isLoading) return <ScreenLoader />;

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-white/50 hover:text-white transition text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {trainer && (
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 flex items-center gap-4">
          {trainer.profilePic ? (
            <img src={trainer.profilePic} alt={trainer.name} className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-bold text-white">
              {trainer.name.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-white">Book Session with {trainer.name}</h1>
            <p className="text-white/50 text-sm mt-0.5">
              {trainer.specializations?.map((s) => s.name).join(", ")}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date picker */}
        <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
          <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-indigo-400" />
            Select Date
          </h2>
          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
            {datesWithSlots.length > 0 ? (
              datesWithSlots.map((date, idx) => (
                <button
                  key={idx}
                  onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all border text-sm font-medium ${
                    selectedDate && isSameDay(date, selectedDate)
                      ? "bg-indigo-600/25 border-indigo-500 text-indigo-300"
                      : "bg-white/5 border-transparent hover:bg-white/8 text-white"
                  }`}
                >
                  {format(date, "EEEE, MMMM d, yyyy")}
                </button>
              ))
            ) : (
              <p className="text-white/40 text-sm text-center py-8">
                No available dates. This trainer has no open slots.
              </p>
            )}
          </div>
        </div>

        {/* Slot picker */}
        <div className="bg-white/5 rounded-2xl p-5 border border-white/10 flex flex-col">
          <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            {selectedDate ? `Slots for ${format(selectedDate, "MMM d")}` : "Available Slots"}
          </h2>

          <div className="grid grid-cols-2 gap-3 flex-1">
            {slotsForSelectedDate.length > 0 ? (
              slotsForSelectedDate.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                    selectedSlot?.id === slot.id
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                      : "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                  }`}
                >
                  {format(parseISO(slot.startTime), "HH:mm")} – {format(parseISO(slot.endTime), "HH:mm")}
                </button>
              ))
            ) : (
              <p className="col-span-2 text-white/40 text-sm text-center py-8">
                {selectedDate ? "No slots available for this date." : "Select a date to see slots."}
              </p>
            )}
          </div>

          {selectedSlot && (
            <div className="mt-5 pt-4 border-t border-white/10 space-y-4">
              <p className="text-sm text-white/50">
                Selected:{" "}
                <span className="text-white font-medium">
                  {format(parseISO(selectedSlot.startTime), "HH:mm")} – {format(parseISO(selectedSlot.endTime), "HH:mm")}
                </span>{" "}
                on{" "}
                <span className="text-white font-medium">
                  {format(parseISO(selectedSlot.startTime), "MMM d, yyyy")}
                </span>
              </p>

              <div>
                <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">
                  Add a note for the trainer (Optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Focus areas, goal setting, current fitness level..."
                  rows={3}
                  maxLength={500}
                  className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-xl p-3 resize-none focus:outline-none focus:border-indigo-500 placeholder:text-white/30"
                />
              </div>

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
        message={
          selectedSlot
            ? `Book a session with ${trainer?.name} on ${format(parseISO(selectedSlot.startTime), "MMM d, yyyy")} at ${format(parseISO(selectedSlot.startTime), "HH:mm")}? Your request will be pending until the trainer accepts.`
            : ""
        }
        variant="primary"
        confirmText="Request Booking"
      />
    </div>
  );
};

export default UserBookTrainerPage;
