import React from "react";
import { Edit } from "lucide-react";
import { toast } from "sonner";
import type { NavigateFunction } from "react-router-dom";

import adminServices from "@/services/admin/admin.services";
import type { TableAction } from "@/components/ui/table/table.types";
import type { QuestionGroup } from "@/interface/admin.interface";
import { ADMIN_UI_ROUTES } from "@/constants/constant-routes/ui-routes/admin.ui-constant-routes";

export type GroupModalConfig = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  variant?: "danger" | "primary";
};

export const getQuestionGroupActions = (
  navigate: NavigateFunction,
  refetch: () => void,
  setModalConfig: React.Dispatch<React.SetStateAction<GroupModalConfig>>
): TableAction<QuestionGroup>[] => {
  const handleToggleStatus = async (groupId: string, isBlocking: boolean) => {
    try {
      await adminServices.toggleQuestionGroupStatus(groupId);
      toast.success(isBlocking ? "Group blocked successfully" : "Group unblocked successfully");
      refetch();
    } catch {
      toast.error(isBlocking ? "Failed to block group" : "Failed to unblock group");
    }
  };

  return [
    {
      label: "Edit",
      icon: <Edit size={16} />,
      onClick: (item) => navigate(ADMIN_UI_ROUTES.QUESTION_GROUPS_EDIT(item.groupId)),
    },
    {
      label: "Block",
      variant: "danger",
      visible: (item) => item.isActive !== false,
      onClick: (item) => {
        setModalConfig({
          isOpen: true,
          title: "Block Group",
          message: `Are you sure you want to block this group?`,
          variant: "danger",
          onConfirm: async () => {
            await handleToggleStatus(item.groupId, true);
            setModalConfig((p) => ({ ...p, isOpen: false }));
          },
        });
      },
    },
    {
      label: "Unblock",
      visible: (item) => item.isActive === false,
      onClick: (item) => {
        setModalConfig({
          isOpen: true,
          title: "Unblock Group",
          message: `Are you sure you want to unblock this group?`,
          variant: "primary",
          onConfirm: async () => {
            await handleToggleStatus(item.groupId, false);
            setModalConfig((p) => ({ ...p, isOpen: false }));
          },
        });
      },
    },
  ];
};