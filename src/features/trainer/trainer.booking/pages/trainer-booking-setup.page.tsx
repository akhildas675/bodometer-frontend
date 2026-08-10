import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookingSetupForm } from "../components/setup/booking-setup.form";
import { trainerAvailabilityService } from "@/modules/booking/service/trainer-availability.service";
import { TRAiNER_UI_ROUTES } from "@/constants/constant-routes/ui-routes/trainer.ui-constant.routes";

/**
 * First-time booking setup page.
 * If the trainer already has availability schedules, redirect straight to
 * the management page so they never see the setup form again.
 */
const TrainerBookingSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    trainerAvailabilityService
      .getAvailability()
      .then((res) => {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          // Already set up — go straight to management
          navigate(TRAiNER_UI_ROUTES.TRAINER_BOOKING_MANAGEMENT, { replace: true });
        } else {
          setChecking(false);
        }
      })
      .catch(() => {
        // On error, just show the setup form anyway
        setChecking(false);
      });
  }, [navigate]);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#050017] flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-2 border-purple-500/40 border-t-purple-500 rounded-full animate-spin mx-auto" />
          <p className="text-white/40 text-sm">Checking your booking status…</p>
        </div>
      </div>
    );
  }

  return <BookingSetupForm />;
};

export default TrainerBookingSetupPage;
