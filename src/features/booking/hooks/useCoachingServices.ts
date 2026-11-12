import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CoachingListItem } from "@/features/admin/coaching/types/coaching.types";
import { coachingService } from "@/features/admin/coaching/services/coaching.service";

export const useCoachingServices = () => {
  const [services, setServices] = useState<CoachingListItem[]>([]);
  const [selectedService, setSelectedService] = useState<CoachingListItem | null>(null);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    coachingService
      .getCoachingServices()
      .then((res) => {
        if (res?.data && Array.isArray(res.data)) {
          setServices(res.data);
          if (res.data.length > 0) setSelectedService(res.data[0]);
        }
      })
      .catch(() => toast.error("Failed to load coaching services."))
      .finally(() => setLoadingServices(false));
  }, []);

  return {
    services,
    selectedService,
    setSelectedService,
    loadingServices,
  };
};
