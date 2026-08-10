import {
  DaySchedule,
  TrainerAvailability,
  AvailabilityValidationResult,
  ValidationErrorItem,
  Weekday,
  Shift,
} from "../types/trainer-availability.types";

export const REQUIRED_WEEKDAYS: Weekday[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function createDefaultWeeklySchedule(): DaySchedule[] {
  return REQUIRED_WEEKDAYS.map((day) => ({
    dayOfWeek: day,
    isAvailable: false,
    shifts: [],
  }));
}

export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

export function calculateDateDiffInDays(startDateStr: string, endDateStr: string): number {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
  const diffTime = end.getTime() - start.getTime();
  return Math.round(diffTime / (1000 * 3600 * 24));
}

export const WEEKDAY_MAP: Record<string, Weekday> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
  Monday: "Monday",
  Tuesday: "Tuesday",
  Wednesday: "Wednesday",
  Thursday: "Thursday",
  Friday: "Friday",
  Saturday: "Saturday",
  Sunday: "Sunday",
};

export function normalizeWeekday(dayStr?: string): Weekday {
  if (!dayStr) return "Monday";
  const mapped = WEEKDAY_MAP[dayStr] || WEEKDAY_MAP[dayStr.toUpperCase()] || WEEKDAY_MAP[dayStr.toLowerCase()];
  return mapped || (dayStr as Weekday);
}

export function minutesToTimeString(minutes?: number): string {
  if (typeof minutes !== "number" || isNaN(minutes)) return "";
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function normalizeShift(shift: Partial<Shift>, dayOfWeek: Weekday, index: number): Shift {
  let startTime = shift.startTime || "";
  let endTime = shift.endTime || "";
  let startMinute = shift.startMinute;
  let endMinute = shift.endMinute;

  if (!startTime && typeof startMinute === "number") {
    startTime = minutesToTimeString(startMinute);
  } else if (startTime && typeof startMinute !== "number") {
    startMinute = timeToMinutes(startTime);
  }

  if (!endTime && typeof endMinute === "number") {
    endTime = minutesToTimeString(endMinute);
  } else if (endTime && typeof endMinute !== "number") {
    endMinute = timeToMinutes(endTime);
  }

  return {
    id: shift.id || `${dayOfWeek.toLowerCase()}-${index}-${Date.now()}`,
    startTime,
    endTime,
    startMinute,
    endMinute,
  };
}

export function normalizeWeeklySchedule(rawSchedule?: DaySchedule[]): DaySchedule[] {
  if (!rawSchedule || !Array.isArray(rawSchedule) || rawSchedule.length === 0) {
    return createDefaultWeeklySchedule();
  }

  const scheduleMap = new Map<string, DaySchedule>();
  rawSchedule.forEach((item) => {
    const normDay = normalizeWeekday(item.dayOfWeek);
    scheduleMap.set(normDay, item);
    if (item.dayOfWeek) {
      scheduleMap.set(String(item.dayOfWeek).toUpperCase(), item);
    }
  });

  return REQUIRED_WEEKDAYS.map((reqDay) => {
    const uppercaseDay = reqDay.toUpperCase() as Weekday;
    const found = scheduleMap.get(reqDay) || scheduleMap.get(uppercaseDay);
    if (!found) {
      return {
        dayOfWeek: uppercaseDay,
        isAvailable: false,
        shifts: [],
      };
    }

    const isAvailable = Boolean(found.isAvailable);
    const shifts = isAvailable
      ? (Array.isArray(found.shifts)
          ? found.shifts
              .filter((s) => s.startTime || typeof s.startMinute === "number")
              .map((s, idx) => normalizeShift(s, reqDay, idx))
          : [])
      : [];

    return {
      dayOfWeek: uppercaseDay,
      isAvailable,
      shifts,
    };
  });
}

export function validateTrainerAvailability(
  availability: Partial<TrainerAvailability> & { offeredServiceIds?: string[] },
  existingAvailabilities: TrainerAvailability[] = []
): AvailabilityValidationResult {
  const errors: ValidationErrorItem[] = [];

  if (availability.offeredServiceIds !== undefined && availability.offeredServiceIds.length === 0) {
    errors.push({
      field: "offeredServiceIds",
      message: "Please select at least one offered service.",
    });
  }

  // 1. Validate Date Range (Effective Period)
  if (!availability.effectiveFrom) {
    errors.push({ field: "effectiveFrom", message: "Effective From date is required." });
  }
  if (!availability.effectiveUntil) {
    errors.push({ field: "effectiveUntil", message: "Effective Until date is required." });
  }

  if (availability.effectiveFrom && availability.effectiveUntil) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareFrom = new Date(availability.effectiveFrom);
    compareFrom.setHours(0, 0, 0, 0);

    if (compareFrom.getTime() < today.getTime()) {
      errors.push({
        field: "effectiveFrom",
        message: "Effective From date cannot be in the past.",
      });
    }

    const diffDays = calculateDateDiffInDays(availability.effectiveFrom, availability.effectiveUntil);
    if (diffDays < 0) {
      errors.push({
        field: "effectiveUntil",
        message: "Effective Until date cannot be before Effective From date.",
      });
    } else if (diffDays > 90) {
      errors.push({
        field: "effectiveUntil",
        message: `Effective period (${diffDays} days) exceeds the maximum limit of 90 days.`,
      });
    }

    // Check for overlapping availability ranges
    const isOverlapping = existingAvailabilities.some((existing) => {
      if (availability.id && existing.id === availability.id) return false;
      if (existing.status === "EXPIRED") return false;

      const newStart = new Date(availability.effectiveFrom!).getTime();
      const newEnd = new Date(availability.effectiveUntil!).getTime();
      const existingStart = new Date(existing.effectiveFrom).getTime();
      const existingEnd = new Date(existing.effectiveUntil).getTime();

      return newStart <= existingEnd && newEnd >= existingStart;
    });

    if (isOverlapping) {
      errors.push({
        field: "effectiveFrom",
        message: "This date range overlaps with another existing availability schedule.",
      });
    }
  }

  // 2. Validate Weekly Schedule
  const schedule = availability.weeklySchedule || [];

  if (schedule.length !== 7) {
    errors.push({
      field: "weeklySchedule",
      message: `Weekly schedule must contain exactly 7 weekdays. Found ${schedule.length}.`,
    });
  }

  const seenDays = new Set<Weekday>();
  schedule.forEach((daySchedule) => {
    const normDay = normalizeWeekday(daySchedule.dayOfWeek);
    if (seenDays.has(normDay)) {
      errors.push({
        field: "weeklySchedule",
        dayOfWeek: normDay,
        message: `Duplicate day found in schedule: ${normDay}.`,
      });
    }
    seenDays.add(normDay);
  });

  REQUIRED_WEEKDAYS.forEach((reqDay) => {
    if (!seenDays.has(reqDay)) {
      errors.push({
        field: "weeklySchedule",
        dayOfWeek: reqDay,
        message: `Missing day in weekly schedule: ${reqDay}.`,
      });
    }
  });

  // 3. Day-by-day and Shift validation
  schedule.forEach((daySchedule) => {
    const dayOfWeek = normalizeWeekday(daySchedule.dayOfWeek);
    const { isAvailable, shifts: rawShifts } = daySchedule;
    const shifts = Array.isArray(rawShifts)
      ? rawShifts.map((s, idx) => normalizeShift(s, dayOfWeek, idx))
      : [];

    if (!isAvailable) {
      // OFF day -> no shifts
      if (shifts && shifts.length > 0) {
        errors.push({
          field: "shifts",
          dayOfWeek,
          message: `${dayOfWeek} is set to OFF but has ${shifts.length} shift(s). OFF days must have no shifts.`,
        });
      }
    } else {
      // Working day -> at least one shift
      if (!shifts || shifts.length === 0) {
        errors.push({
          field: "shifts",
          dayOfWeek,
          message: `${dayOfWeek} is marked as working but has no shifts assigned. Please add at least one shift.`,
        });
      } else {
        const sortedShifts = [...shifts].sort(
          (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
        );

        sortedShifts.forEach((shift, index) => {
          if (!shift.startTime || !shift.endTime) {
            errors.push({
              field: "shiftTime",
              dayOfWeek,
              shiftId: shift.id,
              message: `${dayOfWeek} shift requires both start and end times to be specified.`,
            });
            return;
          }

          const startMins = timeToMinutes(shift.startTime);
          const endMins = timeToMinutes(shift.endTime);

          if (startMins >= endMins) {
            errors.push({
              field: "shiftTime",
              dayOfWeek,
              shiftId: shift.id,
              message: `${dayOfWeek} shift (${shift.startTime} – ${shift.endTime}): Start time must be strictly before end time.`,
            });
          } else if (endMins - startMins < 30) {
            errors.push({
              field: "shiftTime",
              dayOfWeek,
              shiftId: shift.id,
              message: `${dayOfWeek} shift (${shift.startTime} – ${shift.endTime}) must be at least 30 minutes in duration.`,
            });
          }

          if (index < sortedShifts.length - 1) {
            const nextShift = sortedShifts[index + 1];
            if (nextShift.startTime && nextShift.endTime) {
              const nextStartMins = timeToMinutes(nextShift.startTime);
              if (endMins > nextStartMins) {
                errors.push({
                  field: "shiftOverlap",
                  dayOfWeek,
                  shiftId: shift.id,
                  message: `${dayOfWeek}: Shift ${shift.startTime}–${shift.endTime} overlaps with shift ${nextShift.startTime}–${nextShift.endTime}.`,
                });
              }
            }
          }
        });
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}
