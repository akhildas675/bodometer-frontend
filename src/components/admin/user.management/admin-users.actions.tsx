import adminServices from "../../../services/admin/admin.services";
import type { TableAction } from "../../ui/table/table.types";
import type { AdminGetUsersResponse } from "../../../interface/admin.interface";
import { toast } from "sonner";

export const useUserActions = (
  refreshUsers: () => void
): TableAction<AdminGetUsersResponse>[] => {
  return [
    {
      label: "Block",
      variant: "danger",
      visible: (user) => !user.isBlocked,
      onClick: async (user) => {
        try {
          console.log("Blocking user id 👉", user.id);
          await adminServices.blockUser(user.id);
          toast.success("User blocked");
          refreshUsers();
        } catch {
          toast.error("Failed to block user");
        }
      },
    },
    {
      label: "Unblock",
      visible: (user) => user.isBlocked,
      onClick: async (user) => {
        try {
          console.log("Unblocking user id 👉", user.id);
          await adminServices.unblockUser(user.id);
          toast.success("User unblocked");
          refreshUsers();
        } catch {
          toast.error("Failed to unblock user");
        }
      },
    },
  ];
};
