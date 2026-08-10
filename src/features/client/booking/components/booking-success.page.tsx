import React, { useEffect, useState } from "react";
import { CheckCircle, Calendar, Clock, ArrowRight } from "lucide-react";
import { clientBookingService, BookingResponseData } from "@/modules/booking/service/client-booking.service";

export const BookingSuccessPage: React.FC = () => {
  const [booking, setBooking] = useState<BookingResponseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get("bookingId");
    const sessionId = urlParams.get("session_id");

    if (!bookingId) {
      setError("No booking ID found.");
      setLoading(false);
      return;
    }

    if (sessionId) {
      clientBookingService
        .verifyPayment(bookingId, sessionId)
        .then((res) => {
          setBooking(res);
        })
        .catch(() => {
          setError("Failed to verify payment session.");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#03000D] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-white/60">Verifying your payment and booking status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#03000D] flex items-center justify-center p-4">
        <div className="bg-[#050017] border border-white/10 rounded-3xl p-8 max-w-md text-center space-y-4">
          <p className="text-sm text-rose-400">{error}</p>
          <a
            href="/"
            className="inline-block px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03000D] flex items-center justify-center p-4">
      <div className="bg-[#050017] border border-purple-500/30 rounded-3xl p-8 sm:p-10 max-w-lg w-full text-center space-y-6 shadow-2xl shadow-purple-500/10">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
          <CheckCircle size={36} />
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-white">Booking Confirmed!</h1>
          <p className="text-xs text-white/50 mt-1">
            Your session has been successfully booked and confirmed.
          </p>
        </div>

        {booking && (
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 space-y-2 text-left text-xs">
            <div className="flex justify-between">
              <span className="text-white/40">Booking #</span>
              <span className="text-purple-300 font-mono font-bold">{booking.bookingNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Date</span>
              <span className="text-white font-semibold">
                {new Date(booking.bookingDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Time</span>
              <span className="text-white font-semibold">
                {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Status</span>
              <span className="text-emerald-400 font-bold uppercase">{booking.status}</span>
            </div>
          </div>
        )}

        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-sm font-bold text-white shadow-lg transition"
        >
          Go to Dashboard <ArrowRight size={16} />
        </a>
      </div>
    </div>
  );
};
