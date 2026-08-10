import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AvailableDateOverview } from "@/modules/booking/service/client-booking.service";

interface BookingCalendarProps {
  availableDates: AvailableDateOverview[];
  selectedDate: string;
  activeMonth: string; // "YYYY-MM"
  loading: boolean;
  onDateSelect: (date: string) => void;
  onMonthChange: (month: string) => void;
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

/** Returns 0=Sun…6=Sat ? converts to Mon=0…Sun=6 */
function getMondayBasedDow(date: Date) {
  return (date.getDay() + 6) % 7;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  availableDates,
  selectedDate,
  activeMonth,
  loading,
  onDateSelect,
  onMonthChange,
}) => {
  const [year, month] = activeMonth.split("-").map(Number);
  const today = new Date().toISOString().split("T")[0];

  const dateMap = new Map<string, AvailableDateOverview>();
  for (const d of availableDates) {
    dateMap.set(d.date, d);
  }

  const daysInMonth = getDaysInMonth(year, month - 1);
  const firstDay = getMondayBasedDow(new Date(year, month - 1, 1));

  const goPrev = () => {
    const d = new Date(year, month - 2, 1);
    onMonthChange(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };
  const goNext = () => {
    const d = new Date(year, month, 1);
    onMonthChange(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };

  const monthLabel = new Date(year, month - 1, 1).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const cells: React.ReactNode[] = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`empty-${i}`} />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const overview = dateMap.get(dateStr);
    const isPast = dateStr < today;
    const isToday = dateStr === today;
    const isSelected = dateStr === selectedDate;
    const status = overview?.status;

    let cellClass =
      "relative flex flex-col items-center justify-center h-12 rounded-xl text-xs font-semibold transition-all duration-150 select-none ";
    let dayClass = "text-sm font-bold ";
    let badge: React.ReactNode = null;
    let tooltip = "";
    let clickable = false;

    if (isPast) {
      cellClass += "opacity-30 cursor-not-allowed ";
      dayClass += "text-white/30 ";
    } else if (loading) {
      cellClass += "cursor-default animate-pulse bg-white/5 ";
      dayClass += "text-transparent ";
    } else if (!overview) {
      cellClass += "opacity-40 cursor-not-allowed bg-white/[0.02] ";
      dayClass += "text-white/30 ";
    } else if (status === "AVAILABLE") {
      clickable = true;
      if (isSelected) {
        cellClass +=
          "bg-gradient-to-br from-purple-600 to-purple-500 shadow-lg shadow-purple-600/40 ring-2 ring-purple-400/60 cursor-pointer scale-105 ";
        dayClass += "text-white ";
      } else {
        cellClass +=
          "bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-400/60 hover:shadow-emerald-500/20 hover:shadow-md cursor-pointer ";
        dayClass += "text-emerald-300 ";
      }
      badge = (
        <span className="text-[9px] font-semibold text-emerald-400/90 leading-none mt-0.5">
          {overview.slotCount} slot{overview.slotCount !== 1 ? "s" : ""}
        </span>
      );
      tooltip = `${overview.slotCount} available slot(s)`;
    } else if (status === "LEAVE") {
      cellClass +=
        "bg-red-500/10 border border-red-500/25 cursor-not-allowed opacity-70 ";
      dayClass += "text-red-400 ";
      badge = (
        <span className="text-[9px] font-semibold text-red-400/80 leading-none mt-0.5">
          Leave
        </span>
      );
      tooltip = "Trainer on leave";
    } else if (status === "FULL") {
      cellClass +=
        "bg-orange-500/10 border border-orange-500/25 cursor-not-allowed opacity-70 ";
      dayClass += "text-orange-400 ";
      badge = (
        <span className="text-[9px] font-semibold text-orange-400/80 leading-none mt-0.5">
          Full
        </span>
      );
      tooltip = "Fully booked";
    } else {
      cellClass += "bg-white/[0.02] border border-white/5 cursor-not-allowed opacity-40 ";
      dayClass += "text-white/30 ";
      tooltip = "Trainer off-duty";
    }

    if (isToday && !isSelected) {
      cellClass += "ring-1 ring-purple-500/50 ";
    }

    cells.push(
      <div
        key={dateStr}
        title={tooltip}
        onClick={clickable && !isPast ? () => onDateSelect(dateStr) : undefined}
        className={cellClass}
      >
        <span className={dayClass}>{day}</span>
        {badge}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition cursor-pointer"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-bold text-white">{monthLabel}</span>
        <button
          type="button"
          onClick={goNext}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {DAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-center text-[10px] font-bold uppercase tracking-wider text-white/30 py-1"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-2 border-t border-white/5">
        <LegendDot color="bg-emerald-500" label="Available" />
        <LegendDot color="bg-orange-500" label="Fully Booked" />
        <LegendDot color="bg-red-500" label="On Leave" />
        <LegendDot color="bg-white/20" label="Off-Duty" />
      </div>
    </div>
  );
};

const LegendDot: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-medium">
    <span className={`w-2 h-2 rounded-full ${color}`} />
    {label}
  </div>
);
