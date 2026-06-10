import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userServices from "@/services/user/user.services";
import { parseApiError } from "@/api/error.helper";
import type { TrainerDynamicSlot, TrainerDetail } from "@/interface/user.interface";
import { format, parseISO, isSameDay, addDays } from "date-fns";
import { toast } from "sonner";
import { ScreenLoader } from "@/components/ui/screen-loader";
import InputBox from "@/components/ui/input.box";
import PrimaryButton from "@/components/ui/primary.button";
import ConfirmationModal from "@/components/ui/confirm.dialog";
import { ArrowLeft } from "lucide-react";

const UserBookTrainerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [trainer, setTrainer] = useState<TrainerDetail | null>(null);
  const [slots, setSlots] = useState<TrainerDynamicSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<TrainerDynamicSlot | null>(null);
  const [userNotes, setUserNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTrainerData();
    }
  }, [id]);

  const fetchTrainerData = async () => {
    setIsLoading(true);
    try {
      const [trainerRes, slotsRes] = await Promise.all([
        userServices.getTrainerById(id!),
        userServices.getTrainerSlots(id!, {
          from: new Date().toISOString(),
          to: addDays(new Date(), 60).toISOString()
        })
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

  const availableSlotsForDate = slots.filter(
    slot => isSameDay(parseISO(slot.date), selectedDate)
  );

  const datesWithSlots = Array.from(new Set(slots.map(s => s.date)))
    .map(d => parseISO(d))
    .sort((a, b) => a.getTime() - b.getTime());

  const handleBookingSubmit = async () => {
    if (!selectedSlot || !id) return;

    setIsSubmitting(true);
    try {
      const res = await userServices.createBooking({
        trainerId: id,
        date: selectedSlot.date,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        userNotes: userNotes.trim(),
        bookingType: "ONLINE"
      });

      if (res.success) {
        toast.success("Booking requested successfully!");
        setIsConfirmModalOpen(false);
        navigate("/my-bookings");
      }
    } catch (error) {
      toast.error(parseApiError(error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <ScreenLoader />;

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-white/60 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Trainer
      </button>

      {trainer && (
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 flex items-center gap-4">
          {trainer.profilePic ? (
            <img src={trainer.profilePic} alt={trainer.name} className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-bold">
              {trainer.name.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-white">Book Session with {trainer.name}</h1>
            <p className="text-white/60">{trainer.specializations.map(s => s.name).join(", ")}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date Selection */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-4">Select Date</h2>
          <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
            {datesWithSlots.length > 0 ? (
              datesWithSlots.map((date, idx) => (
                <button
                  key={idx}
                  onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition border ${
                    isSameDay(date, selectedDate)
                      ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                      : "bg-white/5 border-transparent hover:bg-white/10 text-white"
                  }`}
                >
                  {format(date, "EEEE, MMMM dd, yyyy")}
                </button>
              ))
            ) : (
              <p className="text-white/60 text-center py-4">No available dates found.</p>
            )}
          </div>
        </div>

        {/* Slot Selection & Form */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-4">
            Available Slots for {format(selectedDate, "MMM dd")}
          </h2>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            {availableSlotsForDate.length > 0 ? (
              availableSlotsForDate.map((slot, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSlot(slot)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition border ${
                    selectedSlot?.startTime === slot.startTime
                      ? "bg-indigo-600 border-indigo-500 text-white"
                      : "bg-white/5 border-transparent hover:bg-white/10 text-white"
                  }`}
                >
                  {slot.startTime} - {slot.endTime}
                </button>
              ))
            ) : (
              <p className="col-span-2 text-white/60 text-center py-4">No available slots for this date.</p>
            )}
          </div>

          {selectedSlot && (
            <div className="mt-auto space-y-4 pt-4 border-t border-white/10">

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Notes for Trainer (Optional)</label>
                <InputBox
                  id="userNotes"
                  type="text"
                  placeholder="What are your goals for this session?"
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                />
              </div>
              <PrimaryButton
                type="button"
                onClick={() => setIsConfirmModalOpen(true)}
                disabled={isSubmitting}
                text={isSubmitting ? "Processing..." : "Confirm Booking"}
              />
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleBookingSubmit}
        title="Confirm Booking"
        message={`Are you sure you want to book a session with ${trainer?.name} on ${selectedSlot ? format(parseISO(selectedSlot.date), "MMM dd, yyyy") : ""} at ${selectedSlot?.startTime}?`}
        variant="primary"
        confirmText="Yes, book now"
      />
    </div>
  );
};

export default UserBookTrainerPage;
