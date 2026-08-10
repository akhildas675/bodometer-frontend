import { useState, useRef, useEffect } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface GlassDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  label?: string;
  minDate?: string;
  maxDate?: string;
  placeholder?: string;
}

export default function GlassDatePicker({
  value,
  onChange,
  label,
  minDate,
  maxDate,
  placeholder = "Select Date",
}: GlassDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    return value ? parseISO(value) : new Date();
  });

  const popoverRef = useRef<HTMLDivElement>(null);

  // Selected date object
  const selectedDate = value ? parseISO(value) : null;

  // Close popover on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const handleSelectDay = (day: Date) => {
    const formatted = format(day, "yyyy-MM-dd");
    onChange(formatted);
    setIsOpen(false);
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className="relative w-full" ref={popoverRef}>
      {label && (
        <label className="text-xs font-semibold text-purple-200/80 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <CalendarIcon size={14} className="text-purple-400" />
          {label}
        </label>
      )}

      {/* Input Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/40 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition cursor-pointer group"
      >
        <span className={selectedDate ? "font-medium text-white" : "text-white/40"}>
          {selectedDate ? format(selectedDate, "MMM dd, yyyy") : placeholder}
        </span>
        <CalendarIcon
          size={18}
          className="text-purple-400 group-hover:scale-110 transition-transform"
        />
      </button>

      {/* Calendar Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 w-72 md:w-80 bg-[#03000D] border border-purple-500/40 rounded-2xl p-4 shadow-[0_15px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200">
          {/* Calendar Month Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
            <button
              type="button"
              onClick={prevMonth}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="text-sm font-bold text-white tracking-wide">
              {format(currentMonth, "MMMM yyyy")}
            </span>

            <button
              type="button"
              onClick={nextMonth}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 text-center mb-2">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((dayName) => (
              <span key={dayName} className="text-[11px] font-semibold text-purple-300/60 uppercase">
                {dayName}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => {
              const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isTodayDate = isToday(day);

              return (
                <button
                  key={day.toISOString() + idx}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  disabled={!isCurrentMonth}
                  className={`w-9 h-9 md:w-10 md:h-10 rounded-xl text-xs font-medium flex items-center justify-center transition cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white shadow-[0_0_12px_rgba(124,58,237,0.5)] font-bold scale-105"
                      : isTodayDate
                      ? "border border-purple-400 text-purple-300 font-bold bg-purple-500/10"
                      : isCurrentMonth
                      ? "text-white/80 hover:bg-white/10 hover:text-white"
                      : "text-white/20 cursor-not-allowed"
                  }`}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>

          {/* Calendar Quick Footer */}
          <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={() => handleSelectDay(new Date())}
              className="text-purple-300 hover:text-purple-200 font-semibold cursor-pointer"
            >
              Today
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-white/40 hover:text-white cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
