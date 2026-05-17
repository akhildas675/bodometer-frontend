import React from "react";
import { Edit } from "lucide-react";
import { toast } from "sonner";
import type { NavigateFunction } from "react-router-dom";

import adminServices from "@/services/admin/admin.services";
import type { TableAction } from "@/components/ui/table/table.types";
import type { OnboardingQuestion } from "@/interface/admin.interface";
import { ADMIN_UI_ROUTES } from "@/constants/constant-routes/ui-routes/admin.ui-constant-routes";

export type QuestionModalConfig = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  variant?: "danger" | "primary";
};

export const getQuestionActions = (
  navigate: NavigateFunction,
  refetch: () => void,
  setModalConfig: React.Dispatch<React.SetStateAction<QuestionModalConfig>>
): TableAction<OnboardingQuestion>[] => {
  const handleToggleStatus = async (id: string, isBlocking: boolean) => {
    try {
      await adminServices.toggleQuestionStatus(id);
      toast.success(isBlocking ? "Question blocked successfully" : "Question unblocked successfully");
      refetch();
    } catch {
      toast.error(isBlocking ? "Failed to block question" : "Failed to unblock question");
    }
  };

  return [
    {
      label: "Edit",
      icon: <Edit size={16} />,
      onClick: (item) => navigate(ADMIN_UI_ROUTES.QUESTION_EDIT(item.questionId)),
    },
    {
      label: "Block",
      variant: "danger",
      visible: (item) => item.isActive !== false,
      onClick: (item) => {
        setModalConfig({
          isOpen: true,
          title: "Block Question",
          message: `Are you sure you want to block this question?`,
          variant: "danger",
          onConfirm: async () => {
            await handleToggleStatus(item.questionId, true);
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
          title: "Unblock Question",
          message: `Are you sure you want to unblock this question?`,
          variant: "primary",
          onConfirm: async () => {
            await handleToggleStatus(item.questionId, false);
            setModalConfig((p) => ({ ...p, isOpen: false }));
          },
        });
      },
    },
  ];
};
