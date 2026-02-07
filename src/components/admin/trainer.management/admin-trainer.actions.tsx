import { toast } from "sonner";
import type { AdminGetTrainersResponse } from "../../../interface/admin.interface";
import adminServices from "../../../services/admin/admin.services";
import type { TableAction } from "../../ui/table/table.types";

export const useTrainerActions = (
  refreshTrainers: () => void,
): TableAction<AdminGetTrainersResponse>[] => {
  return [
    {
      label: "Block",
      variant: "danger",
      visible: (trainer) => !trainer.isBlocked,
      onClick: async (trainer) => {
        const confirmed = window.confirm(
          `Are you sure you want to block ${trainer.name}?`,
        );

        if (!confirmed) return;

        try {
          await adminServices.blockTrainer(trainer.id);
          toast.success("Trainer blocked");
          refreshTrainers();
        } catch {
          toast.error("Failed to block user");
        }
      },
    },
    {
      label: "Unblock",
      visible: (trainer) => trainer.isBlocked,
      onClick: async (trainer) => {
        const confirmed = window.confirm(
          `Are you sure you want to unblock ${trainer.name}?`,
        );

        if (!confirmed) return;

        try {
          await adminServices.unblockTrainer(trainer.id);
          toast.success("Trainer unblocked");
          refreshTrainers();
        } catch {
          toast.error("Failed to unblock user");
        }
      },
    },
  ];
};
