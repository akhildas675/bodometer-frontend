import React from "react";
import { Plus, Eye, Pencil, Trash2, Layers } from "lucide-react";
import { TrainerAvailability } from "../types/trainer-availability.types";
import { calculateDateDiffInDays } from "../utils/trainer-availability.validator";

interface ListProps {
  availabilities: TrainerAvailability[];
  selectedAvailabilityId: string | null;
  onSelectAvailability: (id: string) => void;
  onOpenCreateForm: () => void;
  onOpenEditForm: (item: TrainerAvailability) => void;
  onDeletePrompt: (id: string) => void;
}

export const TrainerAvailabilityList: React.FC<ListProps> = ({
  availabilities,
  selectedAvailabilityId,
  onSelectAvailability,
  onOpenCreateForm,
  onOpenEditForm,
  onDeletePrompt,
}) => {
  const formatDateShort = (iso: string) => {
    if (!iso) return "N/A";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">All Availability Schedules</h2>
          <p className="text-xs text-white/50">
            Manage your past, active, and future availability records.
          </p>
        </div>
        <button
          onClick={onOpenCreateForm}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition"
        >
          <Plus size={14} /> New Availability Schedule
        </button>
      </div>

      {availabilities.length === 0 ? (
        <div className="bg-[#03000D]/80 border border-white/10 rounded-2xl p-8 text-center space-y-3">
          <Layers size={32} className="text-white/30 mx-auto" />
          <p className="text-sm font-semibold text-white">No Availability Schedules Found</p>
          <p className="text-xs text-white/40">
            Click "New Availability Schedule" to create your first schedule.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availabilities.map((item) => {
              const isSelected = item.id === selectedAvailabilityId;
              const diffDays = calculateDateDiffInDays(item.effectiveFrom, item.effectiveUntil);
              const tz = item.timeZone || "Asia/Kolkata";
              const isStatusActive = item.status?.toLowerCase() === "active";
              const isStatusFuture = item.status?.toLowerCase() === "future";

              return (
                <div
                  key={item.id}
                  className={`bg-[#03000D]/80 backdrop-blur-xl border rounded-[22px] p-5 sm:p-6 space-y-4 transition ${
                    isSelected
                      ? "border-purple-500/60 shadow-[0_0_25px_rgba(168,85,247,0.15)]"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  {/* Top Status Header */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                        isStatusActive
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : isStatusFuture
                          ? "bg-sky-500/10 border-sky-500/30 text-sky-400"
                          : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="text-[11px] text-white/40 font-mono">ID: {item.id.slice(0, 12)}</span>
                  </div>

                  <div>
                    <p className="text-xs text-white/40">Effective Range ({diffDays} Days)</p>
                    <p className="text-sm font-bold text-white mt-0.5">
                      {formatDateShort(item.effectiveFrom)} – {formatDateShort(item.effectiveUntil)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-white/60 pt-2 border-t border-white/10">
                    <span>TZ: {tz.split("/")[1] || tz}</span>
                    <span>
                      {item.weeklySchedule?.filter((d) => d.isAvailable).length ?? 0} Working Days
                    </span>
                  </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => onSelectAvailability(item.id)}
                    className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition flex items-center justify-center gap-1"
                  >
                    <Eye size={13} /> View Overview
                  </button>
                  <button
                    onClick={() => onOpenEditForm(item)}
                    className="flex-1 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-xs font-semibold text-purple-300 transition flex items-center justify-center gap-1"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    onClick={() => onDeletePrompt(item.id)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition"
                    title="Delete Availability"
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
