import React, { useState } from "react";
import { X } from "lucide-react";

interface RejectionModalProps {
  onClose: () => void;
  onSubmit: (reason: string) => void;
  loading: boolean;
}

const RejectionModal: React.FC<RejectionModalProps> = ({ onClose, onSubmit, loading }) => {
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim()) {
      onSubmit(reason);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#05001a] via-[#07002a] to-[#12043b] rounded-2xl max-w-md w-full p-6 border border-white/10 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">Reject Trainer</h2>
        <p className="text-slate-400 text-sm mb-6">
          Please provide a reason for rejecting this trainer application
        </p>

        <form onSubmit={handleSubmit}>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter rejection reason..."
            className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 mb-4 h-32 resize-none"
            required
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !reason.trim()}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Rejecting..." : "Reject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RejectionModal;