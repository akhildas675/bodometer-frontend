import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface DeleteModalProps {
  deleteConfirmId: string | null;
  onCancel: () => void;
  onConfirmDelete: (id: string) => void;
}

export const TrainerAvailabilityDeleteModal: React.FC<DeleteModalProps> = ({
  deleteConfirmId,
  onCancel,
  onConfirmDelete,
}) => {
  if (!deleteConfirmId) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#050017] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 text-red-400">
            <AlertTriangle size={20} /> Delete Availability Schedule
          </h3>
          <button onClick={onCancel} className="text-white/40 hover:text-white">
            <X size={18} />
          </button>
        </div>
        <p className="text-sm text-white/70">
          Are you sure you want to delete availability record{" "}
          <code className="font-mono text-purple-300">{deleteConfirmId}</code>? This action logs the deletion ID to the console ready for your backend API service.
        </p>
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirmDelete(deleteConfirmId)}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white transition"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};
