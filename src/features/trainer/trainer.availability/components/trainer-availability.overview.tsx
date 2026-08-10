import React from "react";
import { Calendar as CalendarIcon, Clock, Users, Pencil, Plus, Briefcase } from "lucide-react";
import { TrainerAvailability, TrainerBookingSettingsForm } from "../types/trainer-availability.types";
import { CoachingListItem } from "@/modules/coaching/types/coaching.interface";
import { TrainerAvailabilityStatCards } from "./trainer-availability.stat-cards";
import { TrainerAvailabilityDayGrid } from "./trainer-availability.day-grid";

interface OverviewProps {
  displayedAvailability: TrainerAvailability | null;
  scheduleMetrics: {
    workingDays: number;
    weeklyHoursStr: string;
    avgPerDayStr: string;
  };
  timezone: string;
  availableServices: CoachingListItem[];
  offeredServiceIds?: string[];
  bookingSettings?: TrainerBookingSettingsForm | null;
  onOpenCreateForm: () => void;
  onOpenEditForm: (availability: TrainerAvailability) => void;
}

function formatShiftTime(shift: { startTime?: string; endTime?: string; startMinute?: number; endMinute?: number }): string {
  if (shift.startTime && shift.endTime) {
    return `${shift.startTime} – ${shift.endTime}`;
  }

  let startStr = "";
  let endStr = "";

  if (typeof shift.startMinute === "number") {
    const h = Math.floor(shift.startMinute / 60);
    const m = Math.round(shift.startMinute % 60);
    startStr = `${h < 10 ? "0" + h : h}:${m < 10 ? "0" + m : m}`;
  }

  if (typeof shift.endMinute === "number") {
    const h = Math.floor(shift.endMinute / 60);
    const m = Math.round(shift.endMinute % 60);
    endStr = `${h < 10 ? "0" + h : h}:${m < 10 ? "0" + m : m}`;
  }

  return `${startStr || "00:00"} – ${endStr || "00:00"}`;
}

export const TrainerAvailabilityOverview: React.FC<OverviewProps> = ({
  displayedAvailability,
  scheduleMetrics,
  timezone,
  availableServices,
  offeredServiceIds = [],
  bookingSettings,
  onOpenCreateForm,
  onOpenEditForm,
}) => {
  if (!displayedAvailability) {
    return (
      <div className="space-y-8">
        <TrainerAvailabilityStatCards
          displayedAvailability={null}
          scheduleMetrics={scheduleMetrics}
          currentTimezone={timezone}
        />
        <div className="bg-[#03000D]/80 backdrop-blur-xl border border-white/10 rounded-[24px] p-8 md:p-12 text-center max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mx-auto">
            <CalendarIcon size={32} />
          </div>
          <h2 className="text-xl font-bold text-white">No Active Trainer Availability</h2>
          <p className="text-sm text-white/50 leading-relaxed">
            You currently have no active availability schedule. Create a new schedule by defining your weekday shifts, timezone, offered services, and effective period (up to 90 days).
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenCreateForm}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-sm font-bold text-white shadow-lg transition"
            >
              <Plus size={16} /> Create Trainer Availability
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter services offered by this availability settings
  const offeredServices = availableServices.filter((s) => {
    const sId = s._id || s.coachingId || s.serviceId || s.serviceType;
    return offeredServiceIds.includes(sId);
  });

  const isStatusActive = displayedAvailability.status?.toLowerCase() === "active";
  const isStatusFuture = displayedAvailability.status?.toLowerCase() === "future";

  return (
    <div className="space-y-8">
      <TrainerAvailabilityStatCards
        displayedAvailability={displayedAvailability}
        scheduleMetrics={scheduleMetrics}
        currentTimezone={timezone}
      />

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 items-start">
        {/* Left Column: Weekly Schedule & Offered Services Details */}
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-[#03000D]/80 backdrop-blur-xl border border-white/10 rounded-[22px] p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  Weekly Schedule Details
                  <span className="text-xs font-normal text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
                    {scheduleMetrics.workingDays} Working Days • {scheduleMetrics.weeklyHoursStr}
                  </span>
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase border ${
                    isStatusActive
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : isStatusFuture
                      ? "bg-sky-500/10 border-sky-500/30 text-sky-400"
                      : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  }`}
                >
                  {displayedAvailability.status}
                </span>
                <button
                  onClick={() => onOpenEditForm(displayedAvailability)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition"
                >
                  <Pencil size={13} /> Edit
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {displayedAvailability.weeklySchedule.map((dayItem) => (
                <div
                  key={dayItem.dayOfWeek}
                  className={`border rounded-2xl p-4 transition-all ${
                    dayItem.isAvailable
                      ? "bg-white/[0.02] border-purple-500/20"
                      : "bg-white/[0.01] border-white/5 opacity-60"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-[140px]">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          dayItem.isAvailable ? "bg-emerald-400" : "bg-white/20"
                        }`}
                      />
                      <span className="font-semibold text-sm text-white">
                        {dayItem.dayOfWeek}
                      </span>
                    </div>

                    <div className="flex-1">
                      {dayItem.isAvailable && dayItem.shifts.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-2">
                          {dayItem.shifts.map((shift, sIdx) => (
                            <span
                              key={shift.id || `shift-${sIdx}`}
                              className="px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-200 text-xs font-medium"
                            >
                              {formatShiftTime(shift)}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-white/40 italic">OFF Day</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Offered Services Card */}
          <div className="bg-[#03000D]/80 backdrop-blur-xl border border-white/10 rounded-[22px] p-5 sm:p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Briefcase size={18} className="text-purple-400" />
              Offered Services ({offeredServices.length})
            </h2>
            {offeredServices.length === 0 ? (
              <p className="text-xs text-white/40 italic">
                No specific services linked to this schedule yet. Edit schedule to select services provided.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2.5">
                {offeredServices.map((s) => (
                  <div
                    key={s._id || s.coachingId || s.serviceType}
                    className="px-3.5 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-200 flex items-center gap-2"
                  >
                    <span className="font-bold">{s.serviceType}</span>
                    <span className="text-[10px] text-white/40 px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                      {s.durationMinutes} mins
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Booking Rules Card */}
          {(() => {
            const advanceNoticeHours = bookingSettings?.advanceNoticeHours ?? 2;
            const bufferMinutes = bookingSettings?.bufferMinutes ?? 15;
            const maximumBookingPerDay = bookingSettings?.maximumBookingPerDay ?? 8;
            return (
              <div className="bg-[#03000D]/80 backdrop-blur-xl border border-white/10 rounded-[22px] p-5 sm:p-6 space-y-4">
                <h2 className="text-lg font-bold text-white">Booking Rules</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <RuleDisplayCard
                    icon={<Clock size={16} />}
                    label="Advance Notice"
                    value={`${advanceNoticeHours} Hours`}
                    sub="Min notice required"
                  />
                  <RuleDisplayCard
                    icon={<Clock size={16} />}
                    label="Buffer Time"
                    value={`${bufferMinutes} Mins`}
                    sub="Between sessions"
                  />
                  <RuleDisplayCard
                    icon={<Users size={16} />}
                    label="Max Sessions"
                    value={`${maximumBookingPerDay} / Day`}
                    sub="Daily capacity"
                  />
                </div>
              </div>
            );
          })()}
        </div>

        {/* Right Column: Visual Day Grid */}
        <div className="xl:col-span-2 space-y-6">
          <TrainerAvailabilityDayGrid weeklySchedule={displayedAvailability.weeklySchedule} />
        </div>
      </div>
    </div>
  );
};

function RuleDisplayCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5">
      <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
        {icon}
      </div>
      <p className="text-[11px] font-semibold text-white/60">{label}</p>
      <p className="text-sm font-bold text-white">{value}</p>
      <p className="text-[10px] text-white/30">{sub}</p>
    </div>
  );
}
