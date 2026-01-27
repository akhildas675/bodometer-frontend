import type { TableColumn, TrainerWithProfile } from "../../ui/table/table.types";

export const trainerOnboardingColumns: TableColumn<TrainerWithProfile>[] = [
  {
    key: "user.name", // Changed from "user"
    label: "Name",
    render: (trainer) => trainer.user.name,
  },
  {
    key: "user.email", // Changed from "user"
    label: "Email",
    render: (trainer) => trainer.user.email,
  },
  {
    key: "user.phoneNumber", // Changed from "user"
    label: "Phone",
    render: (trainer) => trainer.user.phoneNumber,
  },
  {
    key: "profile.experienceInYears", // Changed from "profile"
    label: "Experience",
    render: (trainer) => `${trainer.profile.experienceInYears} years`,
  },
  {
    key: "profile.verificationStatus", // Changed from "profile"
    label: "Status",
    render: (trainer) => {
      const status = trainer.profile.verificationStatus;
      const colors = {
        pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
        approved: "text-green-400 bg-green-400/10 border-green-400/30",
        rejected: "text-red-400 bg-red-400/10 border-red-400/30",
      };
      
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[status]}`}>
          {status.toUpperCase()}
        </span>
      );
    },
  },
  {
    key: "profile.createdAt", // Changed from "profile"
    label: "Submitted",
    render: (trainer) => new Date(trainer.profile.createdAt).toLocaleDateString(),
  },
];