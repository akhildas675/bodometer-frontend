import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  clientBookingService,
  AvailableSlot,
  AvailableDateOverview,
} from "@/features/booking/services/client-booking.service";
import { CoachingListItem } from "@/features/admin/coaching/types/coaching.types";

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export const useBookingSlots = (
  trainerId: string,
  selectedService: CoachingListItem | null,
) => {
  const [activeMonth, setActiveMonth] = useState<string>(getCurrentMonth);
  const [availableDates, setAvailableDates] = useState<AvailableDateOverview[]>([]);
  const [loadingDates, setLoadingDates] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Fetch available-dates overview when service or month changes
  const fetchMonthOverview = useCallback(() => {
    if (!trainerId || !selectedService) return;
    const svcId =
      selectedService._id ||
      selectedService.coachingId ||
      selectedService.serviceId ||
      selectedService.serviceType;

    setLoadingDates(true);
    setAvailableDates([]);
    setSelectedDate("");
    setAvailableSlots([]);
    setSelectedSlot(null);

    clientBookingService
      .getAvailableDates(trainerId, svcId, activeMonth)
      .then((dates) => {
        setAvailableDates(dates);
        const first = dates.find((d) => d.isAvailable && d.status === "AVAILABLE");
        if (first) setSelectedDate(first.date);
      })
      .catch(() => toast.error("Could not load available dates for this month."))
      .finally(() => setLoadingDates(false));
  }, [trainerId, selectedService, activeMonth]);

  useEffect(() => {
    fetchMonthOverview();
  }, [fetchMonthOverview]);

  // Fetch time slots whenever date changes
  useEffect(() => {
    if (!trainerId || !selectedService || !selectedDate) {
      setAvailableSlots([]);
      return;
    }
    const svcId =
      selectedService._id ||
      selectedService.coachingId ||
      selectedService.serviceId ||
      selectedService.serviceType;

    setLoadingSlots(true);
    setSelectedSlot(null);

    clientBookingService
      .getAvailableSlots(trainerId, svcId, selectedDate)
      .then((slots) => setAvailableSlots(slots))
      .catch(() => {
        setAvailableSlots([]);
        toast.error("Could not calculate available slots for selected date.");
      })
      .finally(() => setLoadingSlots(false));
  }, [trainerId, selectedService, selectedDate]);

  return {
    activeMonth,
    setActiveMonth,
    availableDates,
    loadingDates,
    selectedDate,
    setSelectedDate,
    availableSlots,
    selectedSlot,
    setSelectedSlot,
    loadingSlots,
    fetchMonthOverview,
  };
};
