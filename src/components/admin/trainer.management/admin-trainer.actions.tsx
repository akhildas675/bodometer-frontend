import { toast } from "sonner";
import type { AdminGetTrainersResponse } from "@/interface/admin.interface";
import adminServices from "@/services/admin/admin.services";
import type { TableAction } from "@/components/ui/table/table.types";

export type TrainerModalConfig = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  variant?: "danger" | "primary";
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
          message: `Are you sure you want to block ${trainer.name}?`,
          variant: "danger",
          onConfirm: async () => {
            try {
              await adminServices.blockTrainer(trainer.id);
              toast.success("Trainer blocked");
              refreshTrainers();
            } catch {
              toast.error("Failed to block user");
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
          message: `Are you sure you want to unblock ${trainer.name}?`,
          variant: "primary",
          onConfirm: async () => {
            try {
              await adminServices.unblockTrainer(trainer.id);
              toast.success("Trainer unblocked");
              refreshTrainers();
            } catch {
              toast.error("Failed to unblock user");
            }
          },
        });
      },
    },
  ];
};
