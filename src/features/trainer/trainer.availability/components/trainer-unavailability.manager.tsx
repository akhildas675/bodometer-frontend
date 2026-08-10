import React, { useState } from "react";
import { Plus, Trash2, ShieldAlert } from "lucide-react";
import {
  CreateTrainerUnavailability,
  UnavailabilityType,
} from "../types/trainer-availability.types";
import { toast } from "sonner";

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

interface TrainerUnavailabilityManagerProps {
  /**
   * Parent-owned draft list (setup mode).
   * Omit when using as a standalone management panel (e.g. LeaveTab).
   */
  unavailabilities?: CreateTrainerUnavailability[];
  /** Called with the completed leave object when Add Leave is confirmed (setup mode). */
  onAddUnavailability?: (leave: CreateTrainerUnavailability) => void;
  /** Called with the index to replace when a draft entry is edited (setup mode). */
  onUpdateUnavailability?: (
    index: number,
    leave: CreateTrainerUnavailability
  ) => void;
  /** Called with the index to remove when a draft entry is deleted (setup mode). */
  onRemoveUnavailability?: (index: number) => void;
}

export const TrainerUnavailabilityManager: React.FC<
  TrainerUnavailabilityManagerProps
> = ({
  unavailabilities,
  onAddUnavailability,
  onRemoveUnavailability,
}) => {
  // Detect which mode we're in:
  //   controlled  = props supplied by TrainerAvailabilityEditor (setup flow)
  //   standalone  = no props, rendered directly by LeaveTab
  const isControlled = unavailabilities !== undefined;
  // ── Local form-field state only ──────────────────────────────────────
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<UnavailabilityType>("VACATION");
  const [startDate, setStartDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split("T")[0];
  });
  const [reason, setReason] = useState("");

  // ── Validate and push to parent state — no API call (setup mode only) ──
  const handleAddLeave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast.error("Start date and end date are required.");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      toast.error("End date cannot be before start date.");
      return;
    }

    const leave: CreateTrainerUnavailability = {
      type,
      startDate,
      endDate,
      reason: reason.trim() || undefined,
    };

    onAddUnavailability?.(leave);

    // Reset form fields and collapse form
    setType("VACATION");
    setStartDate(new Date().toISOString().split("T")[0]);
    const d = new Date();
    d.setDate(d.getDate() + 2);
    setEndDate(d.toISOString().split("T")[0]);
    setReason("");
    setShowForm(false);

    toast.success("Leave added — will be submitted with your booking setup.");
  };

  return (
    <div className="bg-[#03000D]/80 backdrop-blur-xl border border-white/10 rounded-[22px] p-5 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert size={18} className="text-amber-400" />
            Unavailability &amp; Leave
          </h2>
          <p className="text-xs text-white/50">
            Add vacation, medical, or emergency leave to block slots from client bookings.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-xs font-bold text-purple-300 transition cursor-pointer"
        >
          <Plus size={14} /> Add Leave
        </button>
      </div>

      {/* Inline add-leave form */}
      {showForm && (
        <form
          onSubmit={handleAddLeave}
          className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-4"
        >
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">
                Start Date
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
                End Date
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
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/70 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition cursor-pointer"
            >
              Add Leave
            </button>
          </div>
        </form>
      )}

      {/* Draft/Active Leave List */}
      <div className="space-y-2.5">
        {(unavailabilities ?? []).length === 0 ? (
          <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 text-center">
            <p className="text-xs text-white/40 italic">
              No leave records found. Click "+ Add Leave" above to block vacation or time off.
            </p>
          </div>
        ) : (
          (unavailabilities ?? []).map((item, index) => {
            const config =
              LEAVE_TYPES.find((t) => t.value === item.type) || LEAVE_TYPES[0];
            const startStr = new Date(item.startDate).toLocaleDateString(
              "en-US",
              { month: "short", day: "numeric" }
            );
            const endStr = new Date(item.endDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div
                key={index}
                className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/10"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${config.color}`}
                    >
                      {config.label}
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {startStr} – {endStr}
                    </span>
                  </div>
                  {item.reason && (
                    <p className="text-[11px] text-white/50">{item.reason}</p>
                  )}
                  <p className="text-[10px] text-purple-300/60 italic">
                    Draft — will be submitted with booking setup
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveUnavailability?.(index)}
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition text-xs flex items-center gap-1 cursor-pointer"
                  title="Remove draft leave"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
