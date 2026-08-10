import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Clock, Users, Zap, Settings2, Save } from "lucide-react";
import { trainerAvailabilityService } from "@/modules/booking/service/trainer-availability.service";
import { TrainerBookingSettingsForm } from "@/features/trainer/trainer.availability/types/trainer-availability.types";
import {
  ADVANCE_NOTICE_HOURS,
  BUFFER_TIME_MINUTES,
  MAX_BOOKING_LIMITS,
} from "@/constants/booking.constant";
import { CoachingListItem } from "@/modules/coaching/types/coaching.interface";
import { coachingService } from "@/modules/coaching/service/coaching.service";
import { TabSkeleton } from "./overview.tab";

export const BookingSettingsTab: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<TrainerBookingSettingsForm>({
    serviceIds: [],
    advanceNoticeHours: ADVANCE_NOTICE_HOURS.TWO,
    bufferMinutes: BUFFER_TIME_MINUTES.FIFTEEN,
    maximumBookingPerDay: MAX_BOOKING_LIMITS.EIGHT,
  });
  const [availableServices, setAvailableServices] = useState<CoachingListItem[]>([]);

  useEffect(() => {
    Promise.all([
      trainerAvailabilityService.getScheduleSetup().catch(() => null),
      coachingService.getCoachingServices().catch(() => null),
    ]).then(([setupRes, svcRes]) => {
      if (setupRes?.data?.settings) {
        setSettings({
          serviceIds: setupRes.data.settings.serviceIds || [],
          advanceNoticeHours: setupRes.data.settings.advanceNoticeHours,
          bufferMinutes: setupRes.data.settings.bufferMinutes,
          maximumBookingPerDay: setupRes.data.settings.maximumBookingPerDay,
        });
      }
      if (svcRes?.data && Array.isArray(svcRes.data)) {
        setAvailableServices(svcRes.data);
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await trainerAvailabilityService.updateBookingSettings({
        serviceIds: settings.serviceIds,
        advanceNoticeHours: settings.advanceNoticeHours,
        bufferMinutes: settings.bufferMinutes,
        maximumBookingPerDay: settings.maximumBookingPerDay,
      });
      toast.success("Booking settings updated successfully.");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(
        err.response?.data?.message || err.message || "Failed to update booking settings."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <TabSkeleton rows={3} />;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings2 size={20} className="text-purple-400" />
          Booking Settings
        </h2>
        <p className="text-xs text-white/50 mt-1">
          Control how clients can book sessions with you. Each change only affects this
          section.
        </p>
      </div>

      {/* Rules Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <RuleCard
          icon={<Clock size={18} />}
          label="Advance Notice"
          sublabel="Min notice before booking"
          color="sky"
        >
          <select
            value={settings.advanceNoticeHours}
            onChange={(e) =>
              setSettings((r) => ({ ...r, advanceNoticeHours: Number(e.target.value) }))
            }
            className="w-full bg-[#050017] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 mt-2"
          >
            {Object.values(ADVANCE_NOTICE_HOURS).map((v) => (
              <option key={v} value={v}>
                {v} Hours
              </option>
            ))}
          </select>
        </RuleCard>

        <RuleCard
          icon={<Zap size={18} />}
          label="Buffer Time"
          sublabel="Gap between sessions"
          color="amber"
        >
          <select
            value={settings.bufferMinutes}
            onChange={(e) =>
              setSettings((r) => ({ ...r, bufferMinutes: Number(e.target.value) }))
            }
            className="w-full bg-[#050017] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 mt-2"
          >
            {Object.values(BUFFER_TIME_MINUTES).map((v) => (
              <option key={v} value={v}>
                {v} Minutes
              </option>
            ))}
          </select>
        </RuleCard>

        <RuleCard
          icon={<Users size={18} />}
          label="Max Sessions / Day"
          sublabel="Daily capacity limit"
          color="emerald"
        >
          <select
            value={settings.maximumBookingPerDay}
            onChange={(e) =>
              setSettings((r) => ({ ...r, maximumBookingPerDay: Number(e.target.value) }))
            }
            className="w-full bg-[#050017] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 mt-2"
          >
            {Object.values(MAX_BOOKING_LIMITS).map((v) => (
              <option key={v} value={v}>
                {v} Sessions
              </option>
            ))}
          </select>
        </RuleCard>
      </div>

      {/* Offered Services */}
      <div className="bg-[#03000D]/80 backdrop-blur-xl border border-white/10 rounded-[22px] p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Offered Services</h3>
          <span className="text-xs text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full font-semibold">
            {settings.serviceIds.length} Selected
          </span>
        </div>
        {availableServices.length === 0 ? (
          <p className="text-xs text-white/40 italic">No coaching services found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableServices.map((svc) => {
              const svcId = svc._id || svc.coachingId || svc.serviceId || svc.serviceType;
              const isSelected = settings.serviceIds.includes(svcId);
              return (
                <div
                  key={svcId}
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      serviceIds: isSelected
                        ? prev.serviceIds.filter((id) => id !== svcId)
                        : [...prev.serviceIds, svcId],
                    }))
                  }
                  className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                    isSelected
                      ? "bg-purple-500/10 border-purple-500/50"
                      : "bg-white/[0.02] border-white/10 hover:border-white/20"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="mt-0.5 cursor-pointer"
                  />
                  <div>
                    <p className="text-xs font-bold text-white">{svc.serviceType}</p>
                    <p className="text-[11px] text-white/40">{svc.durationMinutes} mins</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-sm font-bold text-white shadow-lg transition disabled:opacity-60 cursor-pointer"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={15} />
          )}
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </div>
    </div>
  );
};

function RuleCard({
  icon,
  label,
  sublabel,
  color,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  color: "sky" | "amber" | "emerald" | "purple";
  children: React.ReactNode;
}) {
  const colorMap = {
    sky: "bg-sky-500/10 border-sky-500/30 text-sky-400",
    amber: "bg-amber-500/10 border-amber-500/30 text-amber-400",
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    purple: "bg-purple-500/10 border-purple-500/30 text-purple-400",
  };
  return (
    <div className="bg-[#03000D]/80 backdrop-blur-xl border border-white/10 rounded-[22px] p-5 space-y-2">
      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colorMap[color]}`}>
        {icon}
      </div>
      <p className="text-sm font-bold text-white">{label}</p>
      <p className="text-[11px] text-white/40">{sublabel}</p>
      {children}
    </div>
  );
}
