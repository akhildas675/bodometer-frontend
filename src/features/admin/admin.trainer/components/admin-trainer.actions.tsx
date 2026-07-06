import { toast } from "sonner";
import { AdminGetTrainersResponse } from "@/interface/trainer.interface";
import { trainerService } from "@/modules/trainer/service/trainer.service";
import type { TableAction } from "@/ui.components/ui/table/table.types";
import { Lock, Unlock } from "lucide-react";
import { parseApiError } from "@/api/error.helper";

export type TrainerModalConfig = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  variant?: "danger" | "primary" | "purple";
  icon?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
};


export const useTrainerActions = (
  refreshTrainers: () => void,
  setModalConfig: React.Dispatch<React.SetStateAction<TrainerModalConfig>>,
): TableAction<AdminGetTrainersResponse>[] => {
  return [
    {
      label: "Block",
      variant: "danger",
      visible: (trainer) => !trainer.isBlocked,
      onClick: (trainer) => {
        setModalConfig({
          isOpen: true,
          title: "Block Trainer",
          message: `Are you sure you want to block ${trainer.name}? This will temporarily restrict their dashboard access.`,
          variant: "danger",
          icon: <Lock className="w-6 h-6 text-red-400 animate-pulse" />,
          confirmText: "Yes, block trainer",
          cancelText: "Cancel",
          onConfirm: async () => {
            try {
              const res = await trainerService.blockTrainer(trainer.id);
              toast.success(res.message);
              refreshTrainers();
            } catch (error: unknown) {
              const apiError = parseApiError(error);
              toast.error(apiError.message);
            }
          },
        });
      },
    },
    {
      label: "Unblock",
      visible: (trainer) => trainer.isBlocked,
      onClick: (trainer) => {
        setModalConfig({
          isOpen: true,
          title: "Unblock Trainer",
          message: `Are you sure you want to restore access for ${trainer.name}?`,
          variant: "primary",
          icon: <Unlock className="w-6 h-6 text-green-400" />,
          confirmText: "Yes, unblock trainer",
          cancelText: "Cancel",
          onConfirm: async () => {
            try {
              const res = await trainerService.unblockTrainer(trainer.id);
              toast.success(res.message);
              refreshTrainers();
            } catch (error: unknown) {
              const apiError = parseApiError(error);
              toast.error(apiError.message);
            }
          },
        });
      },
    },
  ];
};
