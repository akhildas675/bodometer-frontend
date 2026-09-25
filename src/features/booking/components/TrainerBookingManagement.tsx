import React, { Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import {
  BookingManagementHeader,
  ManagementTab,
} from "@/features/booking/components/BookingManagementHeader";
import { OverviewTab, TabSkeleton } from "@/features/booking/components/tabs/OverviewTab";
import { AvailabilityTab } from "@/features/booking/components/tabs/AvailabilityTab";
import { BookingSettingsTab } from "@/features/booking/components/tabs/BookingSettingsTab";
import { LeaveTab } from "@/features/booking/components/tabs/LeaveTab";
import { DayOverridesTab } from "@/features/booking/components/tabs/DayOverridesTab";
import { UpcomingSessionsTab } from "@/features/booking/components/tabs/UpcomingSessionsTab";
import { BookingHistoryTab } from "@/features/booking/components/tabs/BookingHistoryTab";

const VALID_TABS: ManagementTab[] = [
  "overview",
  "availability",
  "booking-settings",
  "leave",
  "day-overrides",
  "upcoming-sessions",
  "booking-history",
];

export const TrainerBookingManagement: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab") as ManagementTab | null;
  const activeTab: ManagementTab =
    tabParam && VALID_TABS.includes(tabParam) ? tabParam : "overview";

  const handleTabChange = (tab: ManagementTab) => {
    setSearchParams({ tab }, { replace: true });
  };

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "availability":
        return <AvailabilityTab />;
      case "booking-settings":
        return <BookingSettingsTab />;
      case "leave":
        return <LeaveTab />;
      case "day-overrides":
        return <DayOverridesTab />;
      case "upcoming-sessions":
        return <UpcomingSessionsTab />;
      case "booking-history":
        return <BookingHistoryTab />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#050017] text-white p-4 sm:p-6 md:p-8 space-y-8 pb-32">
      <BookingManagementHeader activeTab={activeTab} onTabChange={handleTabChange} />

      <Suspense fallback={<TabSkeleton rows={4} />}>
        <div className="animate-fadeIn">{renderTab()}</div>
      </Suspense>
    </div>
  );
};

export default TrainerBookingManagement;
