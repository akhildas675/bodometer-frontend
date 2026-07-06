import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary" | "purple";
  icon?: React.ReactNode;
  size?: "md" | "lg" | "2xl";
  hideCancel?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Yes, I'm sure",
  cancelText = "Wait, let me check",
  variant = "purple",
  icon = <AlertTriangle className="w-6 h-6 text-purple-400" />,
  size = "md",
  hideCancel = false,
}: ConfirmationModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Setup color 
  let confirmBtnClass = "bg-purple-600 hover:bg-purple-500 shadow-purple-600/20";
  if (variant === "danger") {
    confirmBtnClass = "bg-red-600 hover:bg-red-500 shadow-red-600/20";
  } else if (variant === "primary") {
    confirmBtnClass = "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20";
  }

  let sizeClass = "max-w-md";
  if (size === "2xl") {
    sizeClass = "max-w-2xl";
  } else if (size === "lg") {
    sizeClass = "max-w-lg";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className={`relative bg-linear-to-br from-[#140b3a] to-[#0a0624] border border-white/10 p-8 rounded-3xl w-full shadow-2xl animate-in zoom-in-95 duration-200 ${sizeClass}`}>
        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
          {icon} {title}
        </h3>
        <div className="text-slate-300 mb-8 text-sm leading-relaxed font-medium">
          {message}
        </div>
        <div className="flex gap-4">
          {!hideCancel && (
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-full font-bold text-sm bg-white/5 text-white hover:bg-white/10 border border-white/10 transition cursor-pointer"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-3 rounded-full font-bold text-sm text-white transition shadow-lg cursor-pointer ${confirmBtnClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}