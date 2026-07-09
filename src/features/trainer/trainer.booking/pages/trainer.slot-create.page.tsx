import React, { useState } from "react";
import TrainerSlotCreate from "../components/trainer-slot.create";
import TrainerSlotList from "../components/trainer-slot.list";

const TrainerSlotCreatePage: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-10">
      {/* Availability Create Section */}
      <TrainerSlotCreate onSuccess={handleRefresh} isEmbedded={true} />

      <hr className="border-white/10" />

      {/* Slots Table Section */}
      <TrainerSlotList key={refreshTrigger} isSubSection={true} />
    </div>
  );
};

export default TrainerSlotCreatePage;
