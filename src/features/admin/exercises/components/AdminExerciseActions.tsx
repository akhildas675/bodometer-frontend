import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { TableAction } from "@/components/ui/DataTable.types";
import type { ExerciseRow } from "@/features/workout/types/exercise.types";
import { exerciseService } from "@/features/workout/services/exercise.service";
import { parseApiError } from "@/infrastructure/api/api-error";
import { ADMIN_UI_ROUTES } from "@/constants/routes/admin.routes";

export type ExerciseModalConfig = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  variant?: "danger" | "primary";
};

export const useExerciseActions = (
  refetch: () => void,
  setModalConfig: React.Dispatch<React.SetStateAction<ExerciseModalConfig>>
): TableAction<ExerciseRow>[] => {
  const navigate = useNavigate();

  return [
    {
      label: "Edit",
      variant: "primary",
      onClick: (exercise) => {
        navigate(`${ADMIN_UI_ROUTES.EXERCISES_FORM}?edit=${exercise.exerciseId}`);
      },
    },
    {
      label: "Block",
      variant: "danger",
      visible: (exercise) => exercise.isActive !== false,
      onClick: (exercise) => {
        setModalConfig({
          isOpen: true,
          title: "Block Exercise",
          message: `Are you sure you want to block "${exercise.title}"?`,
          variant: "danger",
          onConfirm: async () => {
            try {
              const res = await exerciseService.toggleExerciseStatus(exercise.exerciseId);
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
      visible: (exercise) => exercise.isActive === false,
      onClick: (exercise) => {
        setModalConfig({
          isOpen: true,
          title: "Unblock Exercise",
          message: `Are you sure you want to unblock "${exercise.title}"?`,
          variant: "primary",
          onConfirm: async () => {
            try {
              const res = await exerciseService.toggleExerciseStatus(exercise.exerciseId);
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
