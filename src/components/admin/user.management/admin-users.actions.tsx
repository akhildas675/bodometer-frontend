import adminServices from "../../../services/admin/admin.services";
import type { TableAction } from "../../ui/table/table.types";
import type { AdminGetUsersResponse } from "../../../interface/admin.interface";
import { toast } from "sonner";

export type UserModalConfig = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  variant?: "danger" | "primary";
};

export const useUserActions = (
  refreshUsers: () => void,
  setModalConfig: React.Dispatch<React.SetStateAction<UserModalConfig>>,
): TableAction<AdminGetUsersResponse>[] => {
  return [
    {
      label: "Block",
      variant: "danger",
      visible: (user) => !user.isBlocked,
      onClick: (user) => {
        setModalConfig({
          isOpen: true,
          title: "Block Trainer",
          message: `Are you sure you want to block ${user.name}?`,
          variant: "danger",
          onConfirm: async () => {
            try {
              await adminServices.blockTrainer(user.id);
              toast.success("User blocked");
              refreshUsers();
            } catch {
              toast.error("Failed to block user");
            }
          },
        });
      },
    },
    {
      label: "Unblock",
      visible: (user) => user.isBlocked,
      onClick: (user) => {
        setModalConfig({
          isOpen: true,
          title: "Unblock Trainer",
          message: `Are you sure you want to unblock ${user.name}?`,
          variant: "primary",
          onConfirm: async () => {
            try {
              await adminServices.unblockTrainer(user.id);
              toast.success("Trainer unblocked");
              refreshUsers();
            } catch {
              toast.error("Failed to unblock user");
            }
          },
        });
      },
    },
  ];
};
