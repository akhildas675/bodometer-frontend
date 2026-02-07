import { toast } from "sonner";
import type { AdminGetTrainersResponse } from "../../../interface/admin.interface";
import adminServices from "../../../services/admin/admin.services";
import type { TableAction } from "../../ui/table/table.types";

export interface ConfirmationState {
  isOpen: boolean;
  title: string;
  message: string;
  variant: "danger" | "primary";
  onConfirm: () => void;
}

export const useTrainerActions = (
  refreshTrainers: () => void,
  setConfirmation: (state: ConfirmationState | null) => void,
): TableAction<AdminGetTrainersResponse>[] => {
  return [
    {
      label: "Block",
      variant: "danger",
      visible: (trainer) => !trainer.isBlocked,
      onClick: async (trainer) => {
        setConfirmation({
          isOpen: true,
          title: "Block Trainer",
          message: `Are you sure you want to block ${trainer.name}? They will not be able to access their account.`,
          variant: "danger",
          onConfirm: async () => {
            try {
              await adminServices.blockTrainer(trainer.id);
              toast.success(`${trainer.name} has been blocked`);
              refreshTrainers();
            } catch {
              toast.error("Failed to block trainer");
            }
          },
        });
      },
    },
    {
      label: "Unblock",
      visible: (trainer) => trainer.isBlocked,
      onClick: async (trainer) => {
        setConfirmation({
          isOpen: true,
          title: "Unblock Trainer",
          message: `Are you sure you want to unblock ${trainer.name}? They will regain access to their account.`,
          variant: "primary",
          onConfirm: async () => {
            try {
              await adminServices.unblockTrainer(trainer.id);
              toast.success(`${trainer.name} has been unblocked`);
              refreshTrainers();
            } catch {
              toast.error("Failed to unblock trainer");
            }
          },
        });
      },
    },
  ];
};