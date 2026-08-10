import React from "react";
import {
  AlertTriangle,
  Plus,
  Trash2,
  Globe,
  Send,
  Briefcase,
} from "lucide-react";
import {
  DaySchedule,
  AvailabilityValidationResult,
  Shift,
  TrainerBookingSettingsForm,
  CreateTrainerUnavailability,
} from "../types/trainer-availability.types";
import { CoachingListItem } from "@/modules/coaching/types/coaching.interface";
import { calculateDateDiffInDays, normalizeWeekday, timeToMinutes } from "../utils/trainer-availability.validator";
import { ADVANCE_NOTICE_HOURS, BUFFER_TIME_MINUTES, MAX_BOOKING_LIMITS } from "@/constants/booking.constant";
import { TrainerAvailabilityDayGrid } from "./trainer-availability.day-grid";
import { TrainerUnavailabilityManager } from "./trainer-unavailability.manager";

const DEFAULT_TIMEZONES = [
  { label: "Asia/Kolkata (GMT +05:30)", value: "Asia/Kolkata" },
  { label: "America/New_York (EST)", value: "America/New_York" },
  { label: "Europe/London (GMT)", value: "Europe/London" },
  { label: "America/Los_Angeles (PST)", value: "America/Los_Angeles" },
  { label: "UTC (Coordinated Universal Time)", value: "UTC" },
];

function getTimezoneOptions(selectedTz?: string) {
  const detectedTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const options = [...DEFAULT_TIMEZONES];

  [detectedTz, selectedTz].forEach((tz) => {
    if (tz && !options.some((o) => o.value === tz)) {
      options.unshift({ label: `${tz} (Auto Detected)`, value: tz });
    }
  });

  return options;
}

interface EditorProps {
  editingId: string | null;
  effectiveFrom: string;
  setEffectiveFrom: (val: string) => void;
  effectiveUntil: string;
  setEffectiveUntil: (val: string) => void;
  timezone: string;
  setTimezone: (val: string) => void;
  weeklySchedule: DaySchedule[];
  setWeeklySchedule: React.Dispatch<React.SetStateAction<DaySchedule[]>>;
  bookingRules: TrainerBookingSettingsForm;
  setBookingRules: React.Dispatch<React.SetStateAction<TrainerBookingSettingsForm>>;
  offeredServiceIds: string[];
  setOfferedServiceIds: React.Dispatch<React.SetStateAction<string[]>>;
  unavailabilities: CreateTrainerUnavailability[];
   onAddUnavailability: (
    leave: CreateTrainerUnavailability
  ) => void;

  onUpdateUnavailability: (
    index: number,
    leave: CreateTrainerUnavailability
  ) => void;

  onRemoveUnavailability: (
    index: number
  ) => void;
  availableServices: CoachingListItem[];
  validationResult: AvailabilityValidationResult;
  showValidationErrors?: boolean;
  onPublishAll: () => void;
  onCancel: () => void;
}

export const TrainerAvailabilityEditor: React.FC<EditorProps> = ({
  editingId,
  effectiveFrom,
  setEffectiveFrom,
  effectiveUntil,
  setEffectiveUntil,
  timezone,
  setTimezone,
  weeklySchedule,
  setWeeklySchedule,
  bookingRules,
  setBookingRules,
  offeredServiceIds,
  setOfferedServiceIds,
  availableServices,
  unavailabilities,
  onAddUnavailability,
  onUpdateUnavailability,
  onRemoveUnavailability,
  validationResult,
  showValidationErrors = false,
  onPublishAll,
  onCancel,
}) => {
  const periodDays = calculateDateDiffInDays(effectiveFrom, effectiveUntil);

  const handleToggleDay = (dayIndex: number) => {
    setWeeklySchedule((prev) =>
      prev.map((item, idx) => {
        if (idx !== dayIndex) return item;
        const nextState = !item.isAvailable;
        return {
          ...item,
          isAvailable: nextState,
          shifts: nextState ? item.shifts : [],
        };
      })
    );
  };

  const handleAddShift = (dayIndex: number) => {
    setWeeklySchedule((prev) =>
      prev.map((item, idx) => {
        if (idx !== dayIndex) return item;
        const normDayName = normalizeWeekday(item.dayOfWeek);
        const newShift: Shift = {
          id: `${normDayName.toLowerCase()}-${Date.now()}`,
          startTime: "",
          endTime: "",
        };
        return {
          ...item,
          isAvailable: true,
          shifts: [...item.shifts, newShift],
        };
      })
    );
  };

  const handleRemoveShift = (dayIndex: number, shiftId: string) => {
    setWeeklySchedule((prev) =>
      prev.map((item, idx) => {
        if (idx !== dayIndex) return item;
        const updatedShifts = item.shifts.filter((s) => s.id !== shiftId);
        return {
          ...item,
          shifts: updatedShifts,
          isAvailable: updatedShifts.length > 0 ? item.isAvailable : false,
        };
      })
    );
  };

  const handleShiftTimeChange = (
    dayIndex: number,
    shiftId: string,
    field: "startTime" | "endTime",
    value: string
  ) => {
    const minutes = timeToMinutes(value);
    setWeeklySchedule((prev) =>
      prev.map((item, idx) => {
        if (idx !== dayIndex) return item;
        return {
          ...item,
          shifts: item.shifts.map((s) => {
            if (s.id !== shiftId) return s;
            if (field === "startTime") {
              return { ...s, startTime: value, startMinute: minutes };
            } else {
              return { ...s, endTime: value, endMinute: minutes };
            }
          }),
        };
      })
    );
  };

  const workingDaysCount = weeklySchedule.filter((d) => d.isAvailable && d.shifts.length > 0).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            {editingId ? "Update Availability Schedule" : "Create New Trainer Availability"}
            {editingId && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Edit Mode
              </span>
            )}
          </h2>
          <p className="text-xs text-white/50 mt-1">
            Define your custom weekday shift timings, timezone, offered services, and effective period (up to 90 days).
          </p>
        </div>
        <button
          onClick={onCancel}
          className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition cursor-pointer"
        >
          Cancel
        </button>
      </div>

      {showValidationErrors && !validationResult.isValid && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-5 space-y-2 text-amber-200">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-300">
            <AlertTriangle size={18} />
            Validation Requirements ({validationResult.errors.length})
          </div>
          <ul className="list-disc list-inside text-xs space-y-1 pl-1 text-amber-200/80">
            {validationResult.errors.map((err, idx) => (
              <li key={idx}>{err.message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 items-start">
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-[#03000D]/80 backdrop-blur-xl border border-white/10 rounded-[22px] p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center justify-between">
              <span>1. Effective Period & Timezone</span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                  periodDays > 0 && periodDays <= 90
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}
              >
                {periodDays} Days {periodDays > 90 ? "(Exceeds 90-day limit!)" : ""}
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-purple-200/70 uppercase tracking-wider">
                  Effective From *
                </label>
                <input
                  type="date"
                  value={effectiveFrom}
                  onChange={(e) => setEffectiveFrom(e.target.value)}
                  className="w-full bg-[#050017] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-purple-200/70 uppercase tracking-wider">
                  Effective Until * (Max 90 days)
                </label>
                <input
                  type="date"
                  value={effectiveUntil}
                  onChange={(e) => setEffectiveUntil(e.target.value)}
                  className="w-full bg-[#050017] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-purple-200/70 uppercase tracking-wider flex items-center gap-1">
                  <Globe size={12} /> Timezone *
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full bg-[#050017] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  {getTimezoneOptions(timezone).map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-[#03000D]/80 backdrop-blur-xl border border-white/10 rounded-[22px] p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-base font-bold text-white">
                2. Custom Weekday Shifts (7 Weekdays Required)
              </h3>
              <span className="text-xs text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
                {workingDaysCount} Working / 7 Days
              </span>
            </div>

            <div className="space-y-3">
              {weeklySchedule.map((dayItem, dayIdx) => {
                const normDayName = normalizeWeekday(dayItem.dayOfWeek);
                const dayErrors = validationResult.errors.filter(
                  (e) => e.dayOfWeek && normalizeWeekday(e.dayOfWeek) === normDayName
                );
                const hasError = showValidationErrors && dayErrors.length > 0;

                return (
                  <div
                    key={normDayName}
                    className={`border rounded-2xl p-4 transition-all ${
                      hasError
                        ? "bg-red-500/[0.04] border-red-500/40"
                        : dayItem.isAvailable
                        ? "bg-white/[0.02] border-purple-500/20"
                        : "bg-white/[0.01] border-white/5 opacity-70"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-[140px]">
                        <button
                          type="button"
                          onClick={() => handleToggleDay(dayIdx)}
                          className={`relative w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${
                            dayItem.isAvailable
                              ? "bg-gradient-to-r from-purple-600 to-purple-500"
                              : "bg-white/10"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                              dayItem.isAvailable ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                        <span className="font-semibold text-sm text-white">
                          {normDayName}
                        </span>
                      </div>

                      <div className="flex-1">
                        {dayItem.isAvailable ? (
                          <div className="flex flex-wrap items-center gap-2">
                            {dayItem.shifts.map((shift) => (
                              <div
                                key={shift.id}
                                className="flex items-center gap-1.5 bg-white/5 border border-purple-500/30 rounded-lg px-2.5 py-1.5"
                              >
                                <input
                                  type="time"
                                  value={shift.startTime}
                                  onChange={(e) =>
                                    handleShiftTimeChange(
                                      dayIdx,
                                      shift.id,
                                      "startTime",
                                      e.target.value
                                    )
                                  }
                                  className="bg-transparent text-xs font-medium text-white focus:outline-none"
                                />
                                <span className="text-white/30 text-xs">–</span>
                                <input
                                  type="time"
                                  value={shift.endTime}
                                  onChange={(e) =>
                                    handleShiftTimeChange(
                                      dayIdx,
                                      shift.id,
                                      "endTime",
                                      e.target.value
                                    )
                                  }
                                  className="bg-transparent text-xs font-medium text-white focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveShift(dayIdx, shift.id)}
                                  className="ml-1 text-white/30 hover:text-red-400 transition cursor-pointer"
                                  title="Remove shift"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => handleAddShift(dayIdx)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold transition cursor-pointer"
                            >
                              <Plus size={12} /> Add Shift
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-white/40 italic">OFF Day (0 shifts)</span>
                        )}
                      </div>
                    </div>

                    {hasError && (
                      <div className="mt-2 text-[11px] text-red-300/90 flex items-center gap-1.5 pt-2 border-t border-red-500/20">
                        <AlertTriangle size={12} />
                        {dayErrors.map((e) => e.message).join(" | ")}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <TrainerAvailabilityDayGrid weeklySchedule={weeklySchedule} />
        </div>

        <div className="xl:col-span-2 space-y-6">
          <div className="bg-[#03000D]/80 backdrop-blur-xl border border-white/10 rounded-[22px] p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase size={18} className="text-purple-400" />
                3. Offered Services *
              </h3>
              <span className="text-xs text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full font-semibold">
                {offeredServiceIds.length} Selected
              </span>
            </div>
            <p className="text-xs text-white/50">
              Select which services you are offering during this availability schedule. At least one service is required.
            </p>

            {availableServices.length === 0 ? (
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-white/40 italic">
                No coaching services found. Services will populate automatically when added by Admin.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {availableServices.map((svc) => {
                  const serviceId = svc._id || svc.coachingId || svc.serviceId || svc.serviceType;
                  const isSelected = offeredServiceIds.includes(serviceId);
                  return (
                    <div
                      key={serviceId}
                      onClick={() => {
                        setOfferedServiceIds((prev) =>
                          isSelected
                            ? prev.filter((id) => id !== serviceId)
                            : [...prev, serviceId]
                        );
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                        isSelected
                          ? "bg-purple-500/10 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                          : "bg-white/[0.02] border-white/10 hover:border-white/20"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="mt-0.5 rounded border-white/20 text-purple-600 focus:ring-purple-500 bg-transparent cursor-pointer"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-white truncate">
                            {svc.serviceType}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-purple-200 border border-white/10 shrink-0 font-medium">
                            {svc.durationMinutes} mins
                          </span>
                        </div>
                        {svc.description && (
                          <p className="text-[11px] text-white/40 mt-1 line-clamp-2">
                            {svc.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-[#03000D]/80 backdrop-blur-xl border border-white/10 rounded-[22px] p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-white">4. Booking Rules</h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/70">
                  Minimum Advance Notice (Hours)
                </label>
                <select
                  value={bookingRules.advanceNoticeHours}
                  onChange={(e) =>
                    setBookingRules((r) => ({
                      ...r,
                      advanceNoticeHours: Number(e.target.value),
                    }))
                  }
                  className="w-full bg-[#050017] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  {Object.values(ADVANCE_NOTICE_HOURS).map((v) => (
                    <option key={v} value={v}>
                      {v} Hours
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/70">
                  Buffer Time Between Sessions (Minutes)
                </label>
                <select
                  value={bookingRules.bufferMinutes}
                  onChange={(e) =>
                    setBookingRules((r) => ({
                      ...r,
                      bufferMinutes: Number(e.target.value),
                    }))
                  }
                  className="w-full bg-[#050017] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  {Object.values(BUFFER_TIME_MINUTES).map((v) => (
                    <option key={v} value={v}>
                      {v} Minutes
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/70">
                  Max Sessions Per Day
                </label>
                <select
                  value={bookingRules.maximumBookingPerDay}
                  onChange={(e) =>
                    setBookingRules((r) => ({
                      ...r,
                      maximumBookingPerDay: Number(e.target.value),
                    }))
                  }
                  className="w-full bg-[#050017] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  {Object.values(MAX_BOOKING_LIMITS).map((v) => (
                    <option key={v} value={v}>
                      {v} Sessions / Day
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <TrainerUnavailabilityManager
            unavailabilities={unavailabilities}
            onAddUnavailability={onAddUnavailability}
            onUpdateUnavailability={onUpdateUnavailability}
            onRemoveUnavailability={onRemoveUnavailability}
          />
        </div>
      </div>

      <div className="bg-[#03000D]/80 backdrop-blur-xl border border-purple-500/30 rounded-[22px] p-5 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Send size={16} className="text-purple-400" />
              {editingId ? "Update Availability & Booking Settings" : "Publish Availability & Booking Settings"}
            </h4>
            <p className="text-xs text-white/50 mt-0.5">
              Submit your shift schedule, effective date range, timezone, offered services, and booking rules together.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onPublishAll}
              className="px-6 py-2.5 rounded-xl font-bold text-xs text-white transition flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 shadow-lg cursor-pointer"
            >
              <Send size={15} />
              {editingId ? "Update Availability & Settings" : "Publish Availability & Settings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
