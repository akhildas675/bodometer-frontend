import type { TableAction, TrainerWithProfile } from "@/components/ui/DataTable.types";

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