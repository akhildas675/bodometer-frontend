import type { TableAction, TrainerWithProfile } from "../../ui/table/table.types";

export const useTrainerOnboardingActions = (
  onViewDetails: (trainer: TrainerWithProfile) => void
): TableAction<TrainerWithProfile>[] => {
  return [
    {
      label: "View Details",
      variant: "primary",
      onClick: (trainer) => onViewDetails(trainer),
    },
  ];
};