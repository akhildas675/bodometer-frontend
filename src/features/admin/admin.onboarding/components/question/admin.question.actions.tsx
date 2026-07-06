import React from "react";
import { Edit } from "lucide-react";
import { toast } from "sonner";
import type { NavigateFunction } from "react-router-dom";

import { onboardingService } from "@/modules/onboarding/service/onboarding.service";
import type { TableAction } from "@/ui.components/ui/table/table.types";
import { OnboardingQuestion } from "@/modules/onboarding/types/onboarding.interface";
import { ADMIN_UI_ROUTES } from "@/constants/constant-routes/ui-routes/admin.ui-constant-routes";

import { parseApiError } from "@/api/error.helper";

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
  const handleToggleStatus = async (id: string) => {
    try {
      const res = await onboardingService.toggleQuestionStatus(id);
      toast.success(res.message);
      refetch();
    } catch (error: unknown) {
      const apiError = parseApiError(error);
      toast.error(apiError.message);
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
            await handleToggleStatus(item.questionId);
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
            await handleToggleStatus(item.questionId);
            setModalConfig((p) => ({ ...p, isOpen: false }));
          },
        });
      },
    },
  ];
};
