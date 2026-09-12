import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  AlertTriangle,
  Plus,
  Trash2,
  Globe,
  CheckCircle2,
  Briefcase,
  CalendarDays,
  Clock4,
  Rocket,
} from "lucide-react";
import {
  DaySchedule,
  TrainerBookingSettingsForm,
  TrainerScheduleSetupPayload,
} from "@/features/trainer/trainer.availability/types/trainer-availability.types";
import { CoachingListItem } from "@/modules/coaching/types/coaching.interface";
import { coachingService } from "@/modules/coaching/service/coaching.service";
import {
  validateTrainerAvailability,
  createDefaultWeeklySchedule,
  normalizeWeekday,
  normalizeWeeklySchedule,
} from "@/features/trainer/trainer.availability/utils/trainer-availability.validator";
import { trainerAvailabilityService } from "@/modules/booking/service/trainer-availability.service";
import { TRAiNER_UI_ROUTES } from "@/constants/constant-routes/ui-routes/trainer.ui-constant.routes";
import {
  AVAILABILITY_STATUS,
  ADVANCE_NOTICE_HOURS,
  BUFFER_TIME_MINUTES,
  MAX_BOOKING_LIMITS,
} from "@/constants/booking.constant";

const DEFAULT_BOOKING_RULES: TrainerBookingSettingsForm = {
  serviceIds: [],
  advanceNoticeHours: ADVANCE_NOTICE_HOURS.TWO,
  bufferMinutes: BUFFER_TIME_MINUTES.TWENTY,
  maximumBookingPerDay: MAX_BOOKING_LIMITS.EIGHT,
};

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

const STEPS = [
  { id: 1, label: "Period & Timezone", icon: CalendarDays },
  { id: 2, label: "Weekly Schedule", icon: Clock4 },
  { id: 3, label: "Services", icon: Briefcase },
  { id: 4, label: "Booking Rules", icon: CheckCircle2 },
];

export const BookingSetupForm: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  // Form State
  const [effectiveFrom, setEffectiveFrom] = useState<string>(
    () => new Date().toISOString().split("T")[0]
  );
  const [effectiveUntil, setEffectiveUntil] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  });
  const [timezone, setTimezone] = useState<string>(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata"
  );
  const [weeklySchedule, setWeeklySchedule] = useState<DaySchedule[]>(
    createDefaultWeeklySchedule
  );
  const [bookingRules, setBookingRules] =
    useState<TrainerBookingSettingsForm>(DEFAULT_BOOKING_RULES);
  const [availableServices, setAvailableServices] = useState<CoachingListItem[]>(
    []
  );
  const [offeredServiceIds, setOfferedServiceIds] = useState<string[]>([]);

  useEffect(() => {
    coachingService
      .getCoachingServices()
      .then((res) => {
        if (res?.data && Array.isArray(res.data)) {
          setAvailableServices(res.data);
        
          setOfferedServiceIds([]);
        }
      })
      .catch(() => { });
  }, []);

  const periodDays = useMemo(() => {
    const s = new Date(effectiveFrom);
    const e = new Date(effectiveUntil);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return 0;
    return Math.round((e.getTime() - s.getTime()) / (1000 * 3600 * 24));
  }, [effectiveFrom, effectiveUntil]);

  const currentFormPayload = useMemo(
    () => ({
      effectiveFrom,
      effectiveUntil,
      timezone,
      weeklySchedule,
      bookingRules,
      offeredServiceIds,
    }),
    [effectiveFrom, effectiveUntil, timezone, weeklySchedule, bookingRules, offeredServiceIds]
  );

  const validationResult = useMemo(
    () => validateTrainerAvailability(currentFormPayload, []),
    [currentFormPayload]
  );

  const workingDaysCount = weeklySchedule.filter(
    (d) => d.isAvailable && d.shifts.length > 0
  ).length;

  // Shift handlers
  const handleToggleDay = (dayIndex: number) => {
    setWeeklySchedule((prev) =>
      prev.map((item, idx) => {
        if (idx !== dayIndex) return item;
        const nextState = !item.isAvailable;
        return { ...item, isAvailable: nextState, shifts: nextState ? item.shifts : [] };
      })
    );
  };

  const handleAddShift = (dayIndex: number) => {
    setWeeklySchedule((prev) =>
      prev.map((item, idx) => {
        if (idx !== dayIndex) return item;
        const normDay = normalizeWeekday(item.dayOfWeek);
        return {
          ...item,
          isAvailable: true,
          shifts: [
            ...item.shifts,
            { id: `${normDay.toLowerCase()}-${Date.now()}`, startTime: "", endTime: "" },
          ],
        };
      })
    );
  };

  const handleRemoveShift = (dayIndex: number, shiftId: string) => {
    setWeeklySchedule((prev) =>
      prev.map((item, idx) => {
        if (idx !== dayIndex) return item;
        const updated = item.shifts.filter((s) => s.id !== shiftId);
        return { ...item, shifts: updated, isAvailable: updated.length > 0 ? item.isAvailable : false };
      })
    );
  };

  const handleShiftTimeChange = (
    dayIndex: number,
    shiftId: string,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setWeeklySchedule((prev) =>
      prev.map((item, idx) => {
        if (idx !== dayIndex) return item;
        return {
          ...item,
          shifts: item.shifts.map((s) => (s.id === shiftId ? { ...s, [field]: value } : s)),
        };
      })
    );
  };

  const handleSubmit = async () => {
    if (!validationResult.isValid) {
      setShowValidationErrors(true);
      toast.error("Please fix all validation errors before submitting.");
      return;
    }
    if (offeredServiceIds.length === 0) {
      setShowValidationErrors(true);
      toast.error("Please select at least one offered service.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: TrainerScheduleSetupPayload = {
        availability: {
          effectiveFrom: new Date(effectiveFrom).toISOString(),
          effectiveUntil: new Date(effectiveUntil).toISOString(),
          timeZone: timezone,
          weeklySchedule: normalizeWeeklySchedule(weeklySchedule),
          status: AVAILABILITY_STATUS.ACTIVE,
        },
        settings: {
          serviceIds: offeredServiceIds,
          advanceNoticeHours: bookingRules.advanceNoticeHours,
          bufferMinutes: bookingRules.bufferMinutes,
          maximumBookingPerDay: bookingRules.maximumBookingPerDay,
        },
      };

      await trainerAvailabilityService.saveScheduleSetup(payload);
      toast.success("Booking setup complete! Redirecting to your management dashboard...");
      setTimeout(() => navigate(TRAiNER_UI_ROUTES.TRAINER_BOOKING_MANAGEMENT), 1200);
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string; errors?: Record<string, string> } };
        message?: string;
      };
      const detailMsg = err.response?.data?.errors
        ? Object.values(err.response.data.errors).join(" | ")
        : err.response?.data?.message || err.message || "Failed to save booking setup.";
      toast.error(detailMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050017] text-white pb-32">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-purple-900/20 to-transparent border-b border-white/5 px-6 py-12 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(168,85,247,0.12),transparent_70%)]" />
        <div className="relative max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
            <Rocket size={13} /> One-time Setup
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Complete Your Booking Setup
          </h1>
          <p className="text-white/50 text-sm leading-relaxed">
            Configure your weekly schedule, timezone, services, and booking rules —
            all in one step. You can fine-tune everything later.
          </p>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 font-medium">Step {step.id}</p>
                  <p className="text-xs font-bold text-white">{step.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Validation Banner */}
        {showValidationErrors && !validationResult.isValid && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-300">
              <AlertTriangle size={16} />
              Please fix these issues before submitting ({validationResult.errors.length})
            </div>
            <ul className="list-disc list-inside text-xs space-y-1 pl-1 text-amber-200/80">
              {validationResult.errors.map((err, idx) => (
                <li key={idx}>{err.message}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-6">
          {/* ── Step 1: Period & Timezone ── */}
          <SectionCard
            number="1"
            title="Effective Period & Timezone"
            badge={
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${periodDays > 0 && periodDays <= 90
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                  }`}
              >
                {periodDays} Days {periodDays > 90 ? "(Exceeds 90-day limit!)" : ""}
              </span>
            }
          >
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
          </SectionCard>

          {/* ── Step 2: Weekly Schedule ── */}
          <SectionCard
            number="2"
            title="Weekly Schedule"
            badge={
              <span className="text-xs text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
                {workingDaysCount} Working / 7 Days
              </span>
            }
          >
            <div className="space-y-3">
              {weeklySchedule.map((dayItem, dayIdx) => {
                const normDay = normalizeWeekday(dayItem.dayOfWeek);
                const dayErrors = validationResult.errors.filter(
                  (e) => e.dayOfWeek && normalizeWeekday(e.dayOfWeek) === normDay
                );
                const hasError = showValidationErrors && dayErrors.length > 0;

                return (
                  <div
                    key={normDay}
                    className={`border rounded-2xl p-4 transition-all ${hasError
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
                          className={`relative w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${dayItem.isAvailable
                              ? "bg-gradient-to-r from-purple-600 to-purple-500"
                              : "bg-white/10"
                            }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${dayItem.isAvailable ? "translate-x-5" : "translate-x-0"
                              }`}
                          />
                        </button>
                        <span className="font-semibold text-sm text-white">{normDay}</span>
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
                                    handleShiftTimeChange(dayIdx, shift.id, "startTime", e.target.value)
                                  }
                                  className="bg-transparent text-xs font-medium text-white focus:outline-none"
                                />
                                <span className="text-white/30 text-xs">–</span>
                                <input
                                  type="time"
                                  value={shift.endTime}
                                  onChange={(e) =>
                                    handleShiftTimeChange(dayIdx, shift.id, "endTime", e.target.value)
                                  }
                                  className="bg-transparent text-xs font-medium text-white focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveShift(dayIdx, shift.id)}
                                  className="ml-1 text-white/30 hover:text-red-400 transition cursor-pointer"
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
                          <span className="text-xs text-white/40 italic">OFF Day — click to enable</span>
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
          </SectionCard>

          {/* ── Step 3: Services ── */}
          <SectionCard
            number="3"
            title="Offered Services"
            badge={
              <span className="text-xs text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full font-semibold">
                {offeredServiceIds.length} Selected
              </span>
            }
          >
            {availableServices.length === 0 ? (
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-white/40 italic">
                No coaching services found. Services will appear automatically when added
                by Admin.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableServices.map((svc) => {
                  const svcId =
                    svc._id || svc.coachingId || svc.serviceId || svc.serviceType;
                  const isSelected = offeredServiceIds.includes(svcId);
                  return (
                    <div
                      key={svcId}
                      onClick={() =>
                        setOfferedServiceIds((prev) =>
                          isSelected
                            ? prev.filter((id) => id !== svcId)
                            : [...prev, svcId]
                        )
                      }
                      className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 ${isSelected
                          ? "bg-purple-500/10 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                          : "bg-white/[0.02] border-white/10 hover:border-white/20"
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => { }}
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
          </SectionCard>

          {/* ── Step 4: Booking Rules ── */}
          <SectionCard number="4" title="Booking Rules">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                  className="w-full bg-[#050017] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
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
                  className="w-full bg-[#050017] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
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
                  className="w-full bg-[#050017] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  {Object.values(MAX_BOOKING_LIMITS).map((v) => (
                    <option key={v} value={v}>
                      {v} Sessions / Day
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </SectionCard>

          {/* ── Single CTA ── */}
          <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/10 border border-purple-500/30 rounded-[24px] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Rocket size={18} className="text-purple-400" />
                Ready to activate your booking system?
              </h4>
              <p className="text-xs text-white/50 mt-1">
                This will publish your schedule and make you available for client bookings.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="shrink-0 px-8 py-3 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 shadow-[0_0_30px_rgba(168,85,247,0.35)] transition flex items-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  <Rocket size={16} /> Complete Booking Setup
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


function SectionCard({
  number,
  title,
  badge,
  children,
}: {
  number: string;
  title: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#03000D]/80 backdrop-blur-xl border border-white/10 rounded-[22px] p-5 sm:p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-base font-bold text-white flex items-center gap-3">
          <span className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 text-xs font-extrabold shrink-0">
            {number}
          </span>
          {title}
        </h3>
        {badge}
      </div>
      {children}
    </div>
  );
}
