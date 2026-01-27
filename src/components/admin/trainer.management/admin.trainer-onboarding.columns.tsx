import type { TableColumn, TrainerWithProfile } from "../../ui/table/table.types";

export const trainerOnboardingColumns: TableColumn<TrainerWithProfile>[] = [
  {
    key: "user.name",
    label: "Name",
    render: (trainer) => trainer.user.name,
  },
  {
    key: "user.email", 
    label: "Email",
    render: (trainer) => trainer.user.email,
  },
  {
    key: "user.phoneNumber", 
    label: "Phone",
    render: (trainer) => trainer.user.phoneNumber,
  },
  {
    key: "profile.experienceInYears",
    label: "Experience",
    render: (trainer) => `${trainer.profile.experienceInYears} years`,
  },
  {
    key: "profile.verificationStatus",
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
    key: "profile.createdAt",
    label: "Submitted",
    render: (trainer) => new Date(trainer.profile.createdAt).toLocaleDateString(),
  },
];