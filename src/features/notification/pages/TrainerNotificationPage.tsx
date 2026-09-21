import React from "react";
import NotificationCenter from "@/features/notification/components/NotificationCenter";
import { useAuthStore } from "@/stores/auth.store";

export const TrainerNotificationPage: React.FC = () => {

  const role = useAuthStore((state)=>state.user?.role);


 
  return <NotificationCenter role={role} title="Trainer Notification Center" />;
};

export default TrainerNotificationPage;
