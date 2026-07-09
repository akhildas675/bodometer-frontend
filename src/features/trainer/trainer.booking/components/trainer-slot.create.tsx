import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDays, format, isBefore } from "date-fns";
import { toast } from "sonner";
import { SLOT_DURATION, SlotDuration } from "@/modules/booking/constant/constant.types/booking.constant";
import { CreateAvailabilityPayload } from "@/modules/booking/types/booking.interface";
import { bookingService } from "@/modules/booking/service/booking.service";
import { parseApiError } from "@/api/error.helper";

interface ShiftRow {
  id: string;
  startTime: string;
  endTime: string;
  duration: SlotDuration;
}

const DURATION_OPTIONS = Object.values(SLOT_DURATION) as SlotDuration[];
const MAX_SHIFTS_PER_DAY = 4;

const createEmptyShift = (): ShiftRow => ({
  id: crypto.randomUUID(),
  startTime: "",
  endTime: "",
  duration: 30,
});

const TODAY = new Date().getTime();
const MAX_DATE = addDays(TODAY, 7);

interface TrainerSlotCreateProps {
  onSuccess?: () => void;
  isEmbedded?: boolean;
}

const TrainerSlotCreate = ({ onSuccess, isEmbedded }: TrainerSlotCreateProps) => {
  const navigate = useNavigate();

  const [date, setDate] = useState<string>("");
  const [shifts, setShifts] = useState<ShiftRow[]>([createEmptyShift()]);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const minDateStr = format(TODAY, "yyyy-MM-dd");
  const maxDateStr = format(MAX_DATE, "yyyy-MM-dd");

  const updateShift = (id: string, patch: Partial<ShiftRow>) => {
    setShifts((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const addShiftRow = () =>
    setShifts((prev) => (prev.length >= MAX_SHIFTS_PER_DAY ? prev : [...prev, createEmptyShift()]));

  const removeShiftRow = (id: string) =>
    setShifts((prev) => (prev.length > 1 ? prev.filter((s) => s.id !== id) : prev));

  const { shiftErrors, overlapError, hasBlockingError } = useMemo(() => {

    const now = new Date();

const selectedDate = date ? new Date(date) : null;

const isToday =
  selectedDate &&
  selectedDate.getFullYear() === now.getFullYear() &&
  selectedDate.getMonth() === now.getMonth() &&
  selectedDate.getDate() === now.getDate();


    const shiftErrors: Record<string, string> = {};
    const parsedRanges: { id: string; start: Date; end: Date }[] = [];

    for (const shift of shifts) {
      if (!shift.startTime || !shift.endTime) continue;

    const [year, month, day] = date.split("-").map(Number);

const [startHour, startMinute] = shift.startTime.split(":").map(Number);
const [endHour, endMinute] = shift.endTime.split(":").map(Number);

const start = new Date(
  year,
  month - 1,
  day,
  startHour,
  startMinute
);

const end = new Date(
  year,
  month - 1,
  day,
  endHour,
  endMinute
);

      if (isToday && start <= now) {
  shiftErrors[shift.id] =
    "Start time must be later than the current time.";
  continue;
}

      if (!isBefore(start, end)) {
        shiftErrors[shift.id] = "Start time must be before end time.";
        continue;
      }

      const totalMinutes = (end.getTime() - start.getTime()) / 60000;
      if (totalMinutes < shift.duration) {
        shiftErrors[shift.id] = `This shift is shorter than the ${shift.duration}-minute slot duration.`;
        continue;
      }

      parsedRanges.push({ id: shift.id, start, end });
    }

    let overlapError = "";
    for (let i = 0; i < parsedRanges.length; i++) {
      for (let j = i + 1; j < parsedRanges.length; j++) {
        const a = parsedRanges[i];
        const b = parsedRanges[j];
        const overlaps = a.start < b.end && b.start < a.end;
        if (overlaps) {
          overlapError = "Two or more shifts overlap. Adjust the times so shifts don't intersect.";
        }
      }
    }

    const hasBlockingError =
      Object.keys(shiftErrors).length > 0 ||
      !!overlapError ||
      !date ||
      shifts.length === 0 ||
      shifts.some((s) => !s.startTime || !s.endTime);

    return { shiftErrors, overlapError, hasBlockingError };
  }, [shifts, date]);

  const handleSubmit = async () => {
    if (hasBlockingError) {
      toast.error("Fix the highlighted issues before saving.");
      return;
    }

    const payload: CreateAvailabilityPayload = {
      date,
      shifts: shifts.map((s) => {
        const [year, month, day] = date.split("-").map(Number);
        const [startH, startM] = s.startTime.split(":").map(Number);
        const [endH, endM] = s.endTime.split(":").map(Number);
        const startTime = new Date(year, month - 1, day, startH, startM).toISOString();
        const endTime = new Date(year, month - 1, day, endH, endM).toISOString();
        return { startTime, endTime, duration: s.duration };
      }),
    };
    console.log("The payload",payload)

    setIsSubmitting(true);
    try {
      const res = await bookingService.createAvailability(payload);
      if (res.success) {
        toast.success("Availability saved. Slots have been generated.");
        if (onSuccess) {
          onSuccess();
          setDate("");
          setShifts([createEmptyShift()]);
        } else {
          navigate("/trainer/slots");
        }
      }
    } catch (error) {
      toast.error(parseApiError(error).message);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className={isEmbedded ? "space-y-6" : "p-6 md:p-10 max-w-4xl mx-auto space-y-6"}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Add Availability</h1>
        <p className="text-white/60">
          Pick a date and your working shifts. Slots are generated once you save.
        </p>
      </div>

      <div className="bg-white/5 rounded-2xl border border-white/10 p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Date</label>
          <input
            type="date"
            value={date}
            min={minDateStr}
            max={maxDateStr}
            onChange={(e) => setDate(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-64 p-2.5 h-[42px]"
          />
          <p className="text-xs text-white/40 mt-1">You can only schedule within the next 7 days.</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-white/80">
              Shifts <span className="text-white/40 font-normal">({shifts.length}/{MAX_SHIFTS_PER_DAY})</span>
            </label>
            <button
              type="button"
              onClick={addShiftRow}
              disabled={shifts.length >= MAX_SHIFTS_PER_DAY}
              className="text-sm text-blue-400 hover:text-blue-300 font-medium disabled:text-white/30 disabled:cursor-not-allowed"
            >
              + Add shift
            </button>
          </div>

          {shifts.length >= MAX_SHIFTS_PER_DAY && (
            <p className="text-xs text-white/40">Maximum of {MAX_SHIFTS_PER_DAY} shifts per day.</p>
          )}

          {shifts.map((shift) => {
            const error = shiftErrors[shift.id];
            return (
              <div key={shift.id} className="rounded-xl border border-white/10 bg-black/20 p-4 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
                  <div className="flex-1 w-full">
                    <label className="block text-xs text-white/50 mb-1">Start time</label>
                    <input
                      type="time"
                      value={shift.startTime}
                      onChange={(e) => updateShift(shift.id, { startTime: e.target.value })}
                      className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-[42px]"
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-xs text-white/50 mb-1">End time</label>
                    <input
                      type="time"
                      value={shift.endTime}
                      onChange={(e) => updateShift(shift.id, { endTime: e.target.value })}
                      className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-[42px]"
                    />
                  </div>
                  <div className="w-full sm:w-40">
                    <label className="block text-xs text-white/50 mb-1">Slot duration</label>
                    <select
                      value={shift.duration}
                      onChange={(e) =>
                        updateShift(shift.id, { duration: Number(e.target.value) as SlotDuration })
                      }
                      className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-[42px]"
                    >
                      {DURATION_OPTIONS.map((d) => (
                        <option key={d} value={d}>
                          {d} min
                        </option>
                      ))}
                    </select>
                  </div>
                  {shifts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeShiftRow(shift.id)}
                      className="text-red-400 hover:text-red-300 text-sm font-medium h-[42px] px-2"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {error && <p className="text-xs text-red-400">{error}</p>}
              </div>
            );
          })}

          {overlapError && <p className="text-sm text-red-400">{overlapError}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              if (onSuccess) {
                setDate("");
                setShifts([createEmptyShift()]);
              } else {
                navigate("/trainer/slots");
              }
            }}
            className="px-4 py-2.5 rounded-lg border border-white/10 text-white/70 hover:bg-white/5 text-sm font-medium transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || hasBlockingError}
            className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
          >
            {isSubmitting ? "Saving..." : "Save Availability"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainerSlotCreate;