import React, { Suspense, useState } from "react";
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
