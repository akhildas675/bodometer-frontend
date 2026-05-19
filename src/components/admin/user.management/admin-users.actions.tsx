import adminServices from "@/services/admin/admin.services";
import type { TableAction } from "@/components/ui/table/table.types";
import type { AdminGetUsersResponse } from "@/interface/admin.interface";
import { toast } from "sonner";
import { Lock, Unlock } from "lucide-react";
import { parseApiError } from "@/api/error.helper";

export type UserModalConfig = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  variant?: "danger" | "primary" | "purple";
  icon?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
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
          title: "Block User",
          message: `Are you sure you want to block ${user.name}? This will temporarily restrict their account access.`,
          variant: "danger",
          icon: <Lock className="w-6 h-6 text-red-400 animate-pulse" />,
          confirmText: "Yes, block user",
          cancelText: "Cancel",
          onConfirm: async () => {
            try {
              const res = await adminServices.blockTrainer(user.id);
              toast.success(res.message);
              refreshUsers();
            } catch (error) {
              const apiError = parseApiError(error);
              toast.error(apiError.message);
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
          title: "Unblock User",
          message: `Are you sure you want to restore access for ${user.name}?`,
          variant: "primary",
          icon: <Unlock className="w-6 h-6 text-green-400" />,
          confirmText: "Yes, unblock user",
          cancelText: "Cancel",
          onConfirm: async () => {
            try {
              const res = await adminServices.unblockTrainer(user.id);
              toast.success(res.message);
              refreshUsers();
            } catch (error) {
              const apiError = parseApiError(error);
              toast.error(apiError.message);
            }
          },
        });
      },
    },
  ];
};
