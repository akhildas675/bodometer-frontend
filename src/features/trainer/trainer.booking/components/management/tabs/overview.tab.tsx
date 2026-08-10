import React, { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { trainerAvailabilityService } from "@/modules/booking/service/trainer-availability.service";
import { TrainerAvailability, TrainerBookingSettingsForm } from "@/features/trainer/trainer.availability/types/trainer-availability.types";
import { normalizeWeeklySchedule } from "@/features/trainer/trainer.availability/utils/trainer-availability.validator";
import { TrainerAvailabilityOverview } from "@/features/trainer/trainer.availability/components/trainer-availability.overview";
import { CoachingListItem } from "@/modules/coaching/types/coaching.interface";
import { coachingService } from "@/modules/coaching/service/coaching.service";

export const OverviewTab: React.FC = () => {
  const [availabilities, setAvailabilities] = useState<TrainerAvailability[]>([]);
  const [availableServices, setAvailableServices] = useState<CoachingListItem[]>([]);
  const [offeredServiceIds, setOfferedServiceIds] = useState<string[]>([]);
  const [bookingSettings, setBookingSettings] = useState<TrainerBookingSettingsForm | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      trainerAvailabilityService.getScheduleSetup().catch(() => null),
      trainerAvailabilityService.getAvailability().catch(() => null),
      coachingService.getCoachingServices().catch(() => null),
    ]).then(([setupRes, availRes, svcRes]) => {
      let list: TrainerAvailability[] = [];

      if (availRes?.data && Array.isArray(availRes.data)) {
        list = availRes.data.map((a: TrainerAvailability) => ({
          ...a,
          weeklySchedule: normalizeWeeklySchedule(a.weeklySchedule),
        }));
      }

      if (list.length === 0 && setupRes?.data?.availability) {
        const setupAvail = setupRes.data.availability;
        list = [
          {
            id: "active-setup",
            trainerId: "",
            effectiveFrom: String(setupAvail.effectiveFrom),
            effectiveUntil: String(setupAvail.effectiveUntil),
            timeZone: setupAvail.timeZone,
            weeklySchedule: normalizeWeeklySchedule(setupAvail.weeklySchedule),
            status: (setupAvail.status || "ACTIVE") as TrainerAvailability["status"],
          },
        ];
      }

      setAvailabilities(list);

      if (setupRes?.data?.settings) {
        setOfferedServiceIds(setupRes.data.settings.serviceIds || []);
        setBookingSettings(setupRes.data.settings);
      }

      if (svcRes?.data && Array.isArray(svcRes.data)) {
        setAvailableServices(svcRes.data);
      }
      setLoading(false);
    });
  }, []);

  const activeAvailability = useMemo(
    () =>
      availabilities.find((a) => a.status?.toLowerCase() === "active") ||
      availabilities[0] ||
      null,
    [availabilities]
  );

  const scheduleMetrics = useMemo(() => {
    const schedule = activeAvailability?.weeklySchedule || [];
    let workingDays = 0;
    let totalMinutes = 0;
    schedule.forEach((day) => {
      if (day.isAvailable && day.shifts?.length > 0) {
        workingDays++;
        day.shifts.forEach((s) => {
          const [sh, sm] = (s.startTime || "00:00").split(":").map(Number);
          const [eh, em] = (s.endTime || "00:00").split(":").map(Number);
          const diff = eh * 60 + em - (sh * 60 + sm);
          if (diff > 0) totalMinutes += diff;
        });
      }
    });
    const hours = Math.floor(totalMinutes / 60);
    const mins = Math.round(totalMinutes % 60);
    const avgH = workingDays > 0 ? Math.floor(totalMinutes / workingDays / 60) : 0;
    const avgM =
      workingDays > 0
        ? Math.round(((totalMinutes / workingDays / 60) - avgH) * 60)
        : 0;
    return {
      workingDays,
      weeklyHoursStr: `${hours}h${mins > 0 ? ` ${mins}m` : ""}`,
      avgPerDayStr: `${avgH}h${avgM > 0 ? ` ${avgM}m` : ""}`,
    };
  }, [activeAvailability]);

  if (loading) {
    return <TabSkeleton rows={4} />;
  }

  return (
    <TrainerAvailabilityOverview
      displayedAvailability={activeAvailability}
      scheduleMetrics={scheduleMetrics}
      timezone={activeAvailability?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone}
      availableServices={availableServices}
      offeredServiceIds={offeredServiceIds}
      bookingSettings={bookingSettings}
      onOpenCreateForm={() => {}}
      onOpenEditForm={() => {}}
    />
  );
};

// ── Shared skeleton ──────────────────────────────────────────────────
export function TabSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 rounded-2xl bg-white/[0.04] border border-white/5" />
      ))}
    </div>
  );
}

export function TabEmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="bg-[#03000D]/80 backdrop-blur-xl border border-white/10 rounded-[24px] p-10 text-center space-y-4 max-w-lg mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mx-auto">
        <Icon size={28} />
      </div>
      <div>
        <h3 className="text-base font-bold text-white">{title}</h3>
        <p className="text-xs text-white/50 mt-1 leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-sm font-bold text-white shadow-lg transition cursor-pointer"
        >
          <Plus size={15} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
