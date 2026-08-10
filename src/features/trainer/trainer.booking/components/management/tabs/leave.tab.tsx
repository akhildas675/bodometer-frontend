import React, { useEffect, useState } from "react";
import { ShieldAlert, Plus, Trash2, Edit2, Loader2, Calendar } from "lucide-react";
import { trainerAvailabilityService } from "@/modules/booking/service/trainer-availability.service";
import {
  CreateTrainerUnavailability,
  TrainerUnavailability,
  UnavailabilityType,
} from "@/features/trainer/trainer.availability/types/trainer-availability.types";
import { toast } from "sonner";
import { TabSkeleton, TabEmptyState } from "./overview.tab";

const LEAVE_TYPES: {
  label: string;
  value: UnavailabilityType;
  color: string;
}[] = [
  {
    label: "Vacation",
    value: "VACATION",
    color: "bg-amber-500/10 border-amber-500/30 text-amber-300",
  },
  {
    label: "Medical Leave",
    value: "MEDICAL_LEAVE",
    color: "bg-rose-500/10 border-rose-500/30 text-rose-300",
  },
  {
    label: "Emergency",
    value: "EMERGENCY",
    color: "bg-red-500/10 border-red-500/30 text-red-300",
  },
  {
    label: "Personal Leave",
    value: "PERSONAL_LEAVE",
    color: "bg-purple-500/10 border-purple-500/30 text-purple-300",
  },
];

export const LeaveTab: React.FC = () => {
  const [unavailabilities, setUnavailabilities] = useState<TrainerUnavailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [type, setType] = useState<UnavailabilityType>("VACATION");
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split("T")[0];
  });
  const [reason, setReason] = useState("");

  const fetchLeaves = async () => {
    try {
      const res = await trainerAvailabilityService.getUnavailabilities();
      if (res?.data && Array.isArray(res.data)) {
        setUnavailabilities(res.data);
      }
    } catch {
      toast.error("Failed to load leave records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const openAddForm = () => {
    setEditingId(null);
    setType("VACATION");
    setStartDate(new Date().toISOString().split("T")[0]);
    const d = new Date();
    d.setDate(d.getDate() + 2);
    setEndDate(d.toISOString().split("T")[0]);
    setReason("");
    setShowForm(true);
  };

  const openEditForm = (item: TrainerUnavailability) => {
    setEditingId(item.id);
    setType(item.type);
    setStartDate(new Date(item.startDate).toISOString().split("T")[0]);
    setEndDate(new Date(item.endDate).toISOString().split("T")[0]);
    setReason(item.reason || "");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return toast.error("Start and end date are required.");
    if (new Date(endDate) < new Date(startDate)) {
      return toast.error("End date cannot be before start date.");
    }

    setSaving(true);
    const payload: CreateTrainerUnavailability = {
      type,
      startDate,
      endDate,
      reason: reason.trim() || undefined,
    };

    try {
      if (editingId) {
        await trainerAvailabilityService.updateUnavailability(editingId, payload);
        toast.success("Leave record updated successfully.");
      } else {
        await trainerAvailabilityService.createUnavailability(payload);
        toast.success("Time off added successfully.");
      }
      setShowForm(false);
      setEditingId(null);
      fetchLeaves();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to save leave record.";
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await trainerAvailabilityService.cancelUnavailability(id);
      toast.success("Leave record removed successfully.");
      setUnavailabilities((prev) => prev.filter((u) => u.id !== id));
    } catch {
      toast.error("Failed to delete leave record.");
    }
  };

  if (loading) return <TabSkeleton rows={3} />;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert size={20} className="text-amber-400" />
            Time Off &amp; Leave
          </h2>
          <p className="text-xs text-white/50 mt-1">
            Log vacations, medical, or emergency leave to automatically block those dates from client bookings.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-xs font-bold text-purple-300 transition cursor-pointer"
        >
          <Plus size={14} /> Add Time Off
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#03000D]/80 backdrop-blur-xl border border-purple-500/20 rounded-[22px] p-5 space-y-4"
        >
          <h3 className="text-sm font-bold text-white">
            {editingId ? "Edit Leave Record" : "Add Time Off"}
          </h3>

          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1.5">
              Leave Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as UnavailabilityType)}
              className="w-full bg-[#08031A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              {LEAVE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">
                Start Date *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#08031A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">
                End Date *
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-[#08031A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1.5">
              Reason (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Annual vacation or family emergency"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-[#08031A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
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
              {saving ? "Saving…" : editingId ? "Update Leave" : "Add Leave"}
            </button>
          </div>
        </form>
      )}

      {unavailabilities.length === 0 ? (
        <TabEmptyState
          icon={Calendar}
          title="No Time Off Recorded"
          description="You currently have no vacation or leave recorded. Click '+ Add Time Off' above to schedule time off."
        />
      ) : (
        <div className="space-y-3">
          {unavailabilities.map((item) => {
            const config =
              LEAVE_TYPES.find((t) => t.value === item.type) || LEAVE_TYPES[0];
            const startStr = new Date(item.startDate).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            });
            const endStr = new Date(item.endDate).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-[#03000D]/80 border border-white/10"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${config.color}`}
                    >
                      {config.label}
                    </span>
                    <span className="text-sm font-bold text-white">
                      {startStr} – {endStr}
                    </span>
                  </div>
                  {item.reason && (
                    <p className="text-xs text-white/60">{item.reason}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditForm(item)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition cursor-pointer"
                    title="Edit leave"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 transition cursor-pointer"
                    title="Delete leave"
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
