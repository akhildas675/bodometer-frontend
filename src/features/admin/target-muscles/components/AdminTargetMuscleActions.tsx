import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { TableAction } from "@/components/ui/DataTable.types";
import type { UpdateTargetMuscles } from "@/features/admin/target-muscles/types/target-muscle.types";
import { targetMuscleService } from "@/features/admin/target-muscles/services/target-muscle.service";
import { parseApiError } from "@/infrastructure/api/api-error";

export type TargetMuscleModalConfig = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  variant?: "danger" | "primary";
};

export const useTargetMuscleActions = (
  refetch: () => void,
  setModalConfig: React.Dispatch<React.SetStateAction<TargetMuscleModalConfig>>
): TableAction<UpdateTargetMuscles>[] => {
  const navigate = useNavigate();

  return [
    {
      label: "Edit",
      variant: "primary",
      onClick: (muscle) => {
        // Need to check actual route structure, typically edit uses an ID
        navigate(`/admin/target-muscles-form?edit=${muscle.targetMuscleId}`);
      },
    },
    {
      label: "Block",
      variant: "danger",
      visible: (muscle) => muscle.isActive !== false,
      onClick: (muscle) => {
        setModalConfig({
          isOpen: true,
          title: "Block Target Muscle",
          message: `Are you sure you want to block ${muscle.title}?`,
          variant: "danger",
          onConfirm: async () => {
            try {
              const res = await targetMuscleService.toggleTargetMuscleStatus(muscle.targetMuscleId);
              toast.success(res.message);
              refetch();
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
      variant: "primary",
      visible: (muscle) => muscle.isActive === false,
      onClick: (muscle) => {
        setModalConfig({
          isOpen: true,
          title: "Unblock Target Muscle",
          message: `Are you sure you want to unblock ${muscle.title}?`,
          variant: "primary",
          onConfirm: async () => {
            try {
              const res = await targetMuscleService.toggleTargetMuscleStatus(muscle.targetMuscleId);
              toast.success(res.message);
              refetch();
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
