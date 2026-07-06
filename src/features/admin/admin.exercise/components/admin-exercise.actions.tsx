import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { TableAction } from "@/ui.components/ui/table/table.types";
import type { ExerciseRow } from "@/interface/exercise.interface";
import { exerciseService } from "@/modules/exercise/service/exercise.service";
import { parseApiError } from "@/api/error.helper";
import { ADMIN_UI_ROUTES } from "@/constants/constant-routes/ui-routes/admin.ui-constant-routes";

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
