import React from "react";
import { DaySchedule, Shift } from "../types/trainer-availability.types";
import { REQUIRED_WEEKDAYS } from "../utils/trainer-availability.validator";

interface DayGridProps {
  weeklySchedule: DaySchedule[];
}

const CAL_START_HOUR = 6;
const CAL_END_HOUR = 22;
const CAL_HOURS = Array.from(
  { length: CAL_END_HOUR - CAL_START_HOUR + 1 },
  (_, i) => CAL_START_HOUR + i
);

function formatHourLabel(h: number) {
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12} ${period}`;
}

function getShiftDetails(s: Shift) {
  let startHour = 0;
  let endHour = 0;
  let label = "";

  if (typeof s.startMinute === "number") {
    startHour = s.startMinute / 60;
  } else if (s.startTime && s.startTime.includes(":")) {
    const [h, m] = s.startTime.split(":").map(Number);
    startHour = h + m / 60;
  }

  if (typeof s.endMinute === "number") {
    endHour = s.endMinute / 60;
  } else if (s.endTime && s.endTime.includes(":")) {
    const [h, m] = s.endTime.split(":").map(Number);
    endHour = h + m / 60;
  }

  if (s.startTime && s.endTime) {
    label = `${s.startTime} - ${s.endTime}`;
  } else {
    const startH = Math.floor(startHour);
    const startM = Math.round((startHour - startH) * 60);
    const endH = Math.floor(endHour);
    const endM = Math.round((endHour - endH) * 60);
    const sStr = `${startH < 10 ? "0" + startH : startH}:${startM < 10 ? "0" + startM : startM}`;
    const eStr = `${endH < 10 ? "0" + endH : endH}:${endM < 10 ? "0" + endM : endM}`;
    label = `${sStr} - ${eStr}`;
  }

  return { startHour, endHour, label };
}

export const TrainerAvailabilityDayGrid: React.FC<DayGridProps> = ({ weeklySchedule }) => {
  return (
    <div className="bg-[#03000D]/80 backdrop-blur-xl border border-white/10 rounded-[22px] p-5 sm:p-6 space-y-4">
      <h2 className="text-lg font-bold text-white flex items-center justify-between">
        <span>Visual Calendar Schedule</span>
        <span className="text-xs font-normal text-white/40">6:00 AM – 10:00 PM</span>
      </h2>
      <div className="overflow-x-auto">
        <div className="min-w-[360px]">
          {/* Day Headers */}
          <div className="grid grid-cols-[40px_repeat(7,1fr)] gap-1 mb-2 text-center text-[10px] text-white/40 font-semibold">
            <div />
            {REQUIRED_WEEKDAYS.map((d) => (
              <div key={d}>{d.substring(0, 3)}</div>
            ))}
          </div>

          {/* Grid Rows */}
          <div className="grid grid-cols-[40px_repeat(7,1fr)] gap-1">
            {CAL_HOURS.map((h) => (
              <React.Fragment key={h}>
                <div className="text-[9px] text-white/30 text-right pr-1 pt-0.5">
                  {formatHourLabel(h)}
                </div>
                {weeklySchedule.map((daySchedule) => (
                  <div
                    key={daySchedule.dayOfWeek}
                    className="h-8 border-t border-white/5 relative bg-white/[0.01] rounded"
                  >
                    {daySchedule.isAvailable &&
                      daySchedule.shifts &&
                      daySchedule.shifts
                        .filter((s) => {
                          const { startHour } = getShiftDetails(s);
                          return Math.floor(startHour) === h;
                        })
                        .map((s, idx) => {
                          const { startHour, endHour, label } = getShiftDetails(s);
                          const heightRows = Math.max(endHour - startHour, 0.5);
                          return (
                            <div
                              key={s.id || `shift-${idx}`}
                              style={{ height: `${heightRows * 32}px` }}
                              className="absolute left-0 right-0 top-0 rounded bg-emerald-500/20 border border-emerald-500/50 z-10 px-1 py-0.5 overflow-hidden shadow-sm"
                            >
                              <span className="text-[8px] font-bold text-emerald-200 block truncate leading-tight">
                                {label}
                              </span>
                            </div>
                          );
                        })}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-[11px] text-white/50 pt-3 border-t border-white/10">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Working Shift
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-white/20" /> OFF / Unavailable
        </span>
      </div>
    </div>
  );
};
