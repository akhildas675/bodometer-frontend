import React from "react";
import {
  LayoutDashboard,
  CalendarDays,
  Settings2,
  ShieldAlert,
  CalendarOff,
  CalendarClock,
  History,
} from "lucide-react";

export type ManagementTab =
  | "overview"
  | "availability"
  | "booking-settings"
  | "leave"
  | "day-overrides"
  | "upcoming-sessions"
  | "booking-history";

const TABS: {
  id: ManagementTab;
  label: string;
  icon: React.ElementType;
  color: string;
}[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, color: "text-purple-400" },
  { id: "availability", label: "Availability", icon: CalendarDays, color: "text-sky-400" },
  {
    id: "booking-settings",
    label: "Booking Settings",
    icon: Settings2,
    color: "text-amber-400",
  },
  { id: "leave", label: "Leave", icon: ShieldAlert, color: "text-rose-400" },
  {
    id: "day-overrides",
    label: "Day Overrides",
    icon: CalendarOff,
    color: "text-violet-400",
  },
  {
    id: "upcoming-sessions",
    label: "Upcoming Sessions",
    icon: CalendarClock,
    color: "text-sky-300",
  },
  {
    id: "booking-history",
    label: "Booking History",
    icon: History,
    color: "text-emerald-400",
  },
];

interface BookingManagementHeaderProps {
  activeTab: ManagementTab;
  onTabChange: (tab: ManagementTab) => void;
}

export const BookingManagementHeader: React.FC<BookingManagementHeaderProps> = ({
  activeTab,
  onTabChange,
}) => {
  const activeTabConfig = TABS.find((t) => t.id === activeTab);

  return (
    <div className="border-b border-white/10 pb-6 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Booking Management
          </h1>
          <p className="text-white/50 text-xs sm:text-sm mt-1">
            {activeTabConfig?.label} — each section manages its own data independently.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 self-start">
          {activeTabConfig && (
            <>
              <activeTabConfig.icon size={14} className={activeTabConfig.color} />
              <span className="text-xs font-semibold text-purple-200">
                {activeTabConfig.label}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Tab Bar — scrollable on mobile */}
      <div className="overflow-x-auto -mb-px">
        <div className="flex items-center gap-1 min-w-max bg-white/[0.03] border border-white/10 rounded-2xl p-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-[0_2px_12px_rgba(168,85,247,0.35)]"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon
                  size={13}
                  className={isActive ? "text-white" : tab.color}
                />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
