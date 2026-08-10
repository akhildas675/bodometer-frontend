import React from "react";
import { Calendar as CalendarIcon, Clock, ListChecks, Globe } from "lucide-react";
import { TrainerAvailability } from "../types/trainer-availability.types";
import { calculateDateDiffInDays } from "../utils/trainer-availability.validator";

interface StatCardsProps {
  displayedAvailability: TrainerAvailability | null;
  scheduleMetrics: {
    workingDays: number;
    weeklyHoursStr: string;
    avgPerDayStr: string;
  };
  currentTimezone: string;
}

export const TrainerAvailabilityStatCards: React.FC<StatCardsProps> = ({
  displayedAvailability,
  scheduleMetrics,
  currentTimezone,
}) => {
  const formatDateShort = (iso: string) => {
    if (!iso) return "N/A";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={<CalendarIcon size={20} />}
        iconBg="bg-purple-500/10 border-purple-500/30 text-purple-400"
        label="Active Schedule Period"
        value={
          displayedAvailability
            ? `${formatDateShort(displayedAvailability.effectiveFrom)} – ${formatDateShort(
                displayedAvailability.effectiveUntil
              )}`
            : "No Active Schedule"
        }
        sub={
          displayedAvailability
            ? `${calculateDateDiffInDays(
                displayedAvailability.effectiveFrom,
                displayedAvailability.effectiveUntil
              )} days range`
            : "Create schedule to activate"
        }
        subColor={displayedAvailability ? "text-emerald-400" : "text-amber-400"}
      />
      <StatCard
        icon={<Clock size={20} />}
        iconBg="bg-sky-500/10 border-sky-500/30 text-sky-400"
        label="Weekly Working Hours"
        value={scheduleMetrics.weeklyHoursStr}
        sub={`${scheduleMetrics.avgPerDayStr} per working day`}
        subColor="text-white/50"
      />
      <StatCard
        icon={<ListChecks size={20} />}
        iconBg="bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
        label="Working Days"
        value={`${scheduleMetrics.workingDays} / 7 Days`}
        sub={`${7 - scheduleMetrics.workingDays} OFF days scheduled`}
        subColor="text-emerald-300"
      />
      <StatCard
        icon={<Globe size={20} />}
        iconBg="bg-amber-500/10 border-amber-500/30 text-amber-400"
        label="Timezone"
        value={displayedAvailability?.timeZone || currentTimezone}
        sub="Standard booking timezone"
        subColor="text-white/40"
      />
    </div>
  );
};

function StatCard({
  icon,
  iconBg,
  label,
  value,
  sub,
  subColor,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  sub: string;
  subColor: string;
}) {
  return (
    <div className="bg-[#03000D]/80 backdrop-blur-xl border border-white/10 rounded-[20px] p-5 space-y-3">
      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-white/40 mb-1">{label}</p>
        <p className="text-lg font-bold text-white leading-tight">{value}</p>
        <p className={`text-[11px] mt-0.5 ${subColor}`}>{sub}</p>
      </div>
    </div>
  );
}
