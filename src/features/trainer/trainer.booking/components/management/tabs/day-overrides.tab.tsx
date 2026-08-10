import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, CalendarDays } from "lucide-react";
import { trainerAvailabilityService } from "@/modules/booking/service/trainer-availability.service";
import { TrainerAvailabilityOverride } from "@/features/trainer/trainer.availability/types/trainer-availability.types";
import { TabSkeleton, TabEmptyState } from "./overview.tab";

export const DayOverridesTab: React.FC = () => {
  const [overrides, setOverrides] = useState<TrainerAvailabilityOverride[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [reason, setReason] = useState("");

  const fetchOverrides = async () => {
    try {
      const res = await trainerAvailabilityService.getOverrides();
      if (res?.data && Array.isArray(res.data)) {
        setOverrides(res.data);
      }
    } catch {
      console.warn("Could not load day overrides.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverrides();
  }, []);

  const timeToMinute = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const minuteToTime = (m: number) => {
    const hh = String(Math.floor(m / 60)).padStart(2, "0");
    const mm = String(m % 60).padStart(2, "0");
    return `${hh}:${mm}`;
  };

  const openAddForm = () => {
    setEditingId(null);
    setDate(new Date().toISOString().split("T")[0]);
    setStartTime("09:00");
    setEndTime("17:00");
    setReason("");
    setShowForm(true);
  };

  const openEditForm = (override: TrainerAvailabilityOverride) => {
    setEditingId(override.id);
    setDate(new Date(override.date).toISOString().split("T")[0]);
    if (override.shifts && override.shifts.length > 0) {
      setStartTime(minuteToTime(override.shifts[0].startMinute));
      setEndTime(minuteToTime(override.shifts[0].endMinute));
    }
    setReason(override.reason || "");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return toast.error("Please select a date.");
    if (timeToMinute(endTime) <= timeToMinute(startTime)) {
      return toast.error("End time must be after start time.");
    }
    setSaving(true);
    const payload = {
      date,
      shifts: [
        { startMinute: timeToMinute(startTime), endMinute: timeToMinute(endTime) },
      ],
      reason: reason.trim() || undefined,
    };

    try {
      if (editingId) {
        await trainerAvailabilityService.updateOverride(editingId, payload);
        toast.success("Special date hours updated.");
      } else {
        await trainerAvailabilityService.createOverride(payload);
        toast.success("Special date hours added.");
      }
      setShowForm(false);
      setEditingId(null);
      setReason("");
      fetchOverrides();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message || err.message || "Failed to save override.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await trainerAvailabilityService.cancelOverride(id);
      toast.success("Override removed.");
      setOverrides((prev) => prev.filter((o) => o.id !== id));
    } catch {
      toast.error("Failed to remove override.");
    }
  };

  const activeOverrides = overrides.filter((o) => o.status === "ACTIVE");

  if (loading) return <TabSkeleton rows={3} />;

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarDays size={20} className="text-purple-400" />
            Special Date Hours &amp; Overrides
          </h2>
          <p className="text-xs text-white/50 mt-1">
            Set special one-off working hours for a specific date (e.g. Aug 17: 15:00–18:00) without changing your weekly recurring schedule.
          </p>
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-xs font-bold text-purple-300 transition cursor-pointer"
        >
          <Plus size={14} /> Add Special Hours
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#03000D]/80 backdrop-blur-xl border border-purple-500/20 rounded-[22px] p-5 space-y-4"
        >
          <h3 className="text-sm font-bold text-white">
            {editingId ? "Edit Special Date Hours" : "Add Special Date Hours"}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/60">Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-[#050017] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/60">Start Time *</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full bg-[#050017] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/60">End Time *</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full bg-[#050017] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/60">Reason (optional)</label>
            <input
              type="text"
              placeholder="e.g., Extended hours for annual event"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-[#050017] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/70 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition disabled:opacity-60 cursor-pointer"
            >
              {saving ? "Saving…" : editingId ? "Update Hours" : "Add Special Hours"}
            </button>
          </div>
        </form>
      )}

      {activeOverrides.length === 0 ? (
        <TabEmptyState
          icon={CalendarDays}
          title="No Special Date Hours"
          description="You have no date-specific overrides. Click '+ Add Special Hours' above to customise your availability for a specific calendar date."
        />
      ) : (
        <div className="space-y-3">
          {activeOverrides.map((override) => {
            const dateStr = new Date(override.date).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            return (
              <div
                key={override.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-[#03000D]/80 border border-white/10"
              >
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">{dateStr}</p>
                  <div className="flex flex-wrap gap-2">
                    {override.shifts.map((s, i) => {
                      const toStr = (m: number) =>
                        `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
                      return (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-200 text-xs"
                        >
                          {toStr(s.startMinute)} – {toStr(s.endMinute)}
                        </span>
                      );
                    })}
                  </div>
                  {override.reason && (
                    <p className="text-[11px] text-white/50">{override.reason}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditForm(override)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition cursor-pointer"
                    title="Edit special hours"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleCancel(override.id)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 transition cursor-pointer"
                    title="Remove override"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
