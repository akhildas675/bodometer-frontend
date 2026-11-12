import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { walletService, UserWalletData } from "@/features/user/services/wallet.service";
import {
  clientBookingService,
  AvailableSlot,
} from "@/features/booking/services/client-booking.service";
import { CoachingListItem } from "@/features/admin/coaching/types/coaching.types";

export const useBookingPayment = (
  trainerId: string,
  selectedService: CoachingListItem | null,
  selectedDate: string,
  selectedSlot: AvailableSlot | null,
) => {
  const [wallet, setWallet] = useState<UserWalletData | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"WALLET" | "ONLINE" | "SPLIT">("WALLET");
  const [bookingInProgress, setBookingInProgress] = useState(false);

  // Fetch wallet balance
  useEffect(() => {
    walletService.getWalletBalance().then(setWallet).catch(() => null);
  }, []);

  const openConfirmationModal = useCallback(() => {
    if (!selectedService || !selectedSlot) {
      toast.error("Please select a service and an available time slot.");
      return;
    }
    const balance = wallet?.balance || 0;
    const price = selectedService.price || 0;

    if (balance >= price) {
      setSelectedPaymentMethod("WALLET");
    } else if (balance > 0) {
      setSelectedPaymentMethod("SPLIT");
    } else {
      setSelectedPaymentMethod("ONLINE");
    }
    setShowConfirmModal(true);
  }, [selectedService, selectedSlot, wallet]);

  const handleExecuteBooking = useCallback(async () => {
    if (!selectedService || !selectedSlot) return;
    const svcId =
      selectedService.id ||
      selectedService.coachingId ||
      selectedService._id ||
      selectedService.serviceId ||
      selectedService.serviceType;

    setBookingInProgress(true);
    try {
      const response = await clientBookingService.createBooking({
        trainerId,
        serviceId: svcId,
        bookingDate: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        bufferEndTime: selectedSlot.bufferEndTime,
        paymentMethod: selectedPaymentMethod,
      });

      setShowConfirmModal(false);

      if (response.checkoutUrl) {
        toast.success("Redirecting to secure payment checkout...");
        window.location.href = response.checkoutUrl;
      } else {
        toast.success("Session booked successfully!");
        window.location.href = `/client/booking/success?bookingId=${response.booking.id}`;
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to complete booking. Slot may have been taken.",
      );
    } finally {
      setBookingInProgress(false);
    }
  }, [trainerId, selectedService, selectedDate, selectedSlot, selectedPaymentMethod]);

  return {
    wallet,
    showConfirmModal,
    setShowConfirmModal,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    bookingInProgress,
    openConfirmationModal,
    handleExecuteBooking,
  };
};
