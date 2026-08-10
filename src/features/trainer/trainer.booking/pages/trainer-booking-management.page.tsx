import React, { Suspense, useState } from "react";
import {
  BookingManagementHeader,
  ManagementTab,
} from "../components/management/booking-management.header";
import { OverviewTab, TabSkeleton } from "../components/management/tabs/overview.tab";
import { AvailabilityTab } from "../components/management/tabs/availability.tab";
import { BookingSettingsTab } from "../components/management/tabs/booking-settings.tab";
import { LeaveTab } from "../components/management/tabs/leave.tab";
import { DayOverridesTab } from "../components/management/tabs/day-overrides.tab";
import { UpcomingSessionsTab } from "../components/management/tabs/upcoming-sessions.tab";
import { BookingHistoryTab } from "../components/management/tabs/booking-history.tab";


const TrainerBookingManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ManagementTab>("overview");

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
      <BookingManagementHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <Suspense fallback={<TabSkeleton rows={4} />}>
        <div className="animate-fadeIn">{renderTab()}</div>
      </Suspense>
    </div>
  );
};

export default TrainerBookingManagementPage;
