import { Edit} from "lucide-react";
import { toast } from "sonner";
import type { NavigateFunction } from "react-router-dom";

import adminServices from "@/services/admin/admin.services";

import type { OnboardingQuestion } from "@/interface/admin.interface";
import type { TableAction } from "@/components/ui/table/table.types";

import { ADMIN_UI_ROUTES } from "@/constants/constant-routes/ui-routes/admin.ui-constant-routes";

import { parseApiError } from "@/api/error.helper";

interface ModalConfig {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  variant?: "danger" | "warning" | "info";
}

interface Props {
  navigate: NavigateFunction;
  refetch: () => void;
  setModalConfig: React.Dispatch<React.SetStateAction<ModalConfig>>;
}

export const getQuestionActions = ({
  navigate,
  refetch,
  setModalConfig,
}: Props): TableAction<OnboardingQuestion>[] => {
  const handleToggleStatus = async (id: string) => {
    try {
      const res = await adminServices.toggleQuestionStatus(id);

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

      onClick: (item) => {
        navigate(ADMIN_UI_ROUTES.QUESTION_EDIT(item.questionId));
      },
    },

    {
      label: (item) => (item.isActive ? "Block" : "Unblock"),

      icon: null,

      className: (item) =>
        item.isActive
          ? "bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium"
          : "bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium",

      onClick: (item) => {
        const isBlocking = item.isActive;

        setModalConfig({
          isOpen: true,
          title: isBlocking ? "Block Question" : "Unblock Question",
          message: `Are you sure you want to ${
            isBlocking ? "block" : "unblock"
          } this question?`,
          variant: isBlocking ? "danger" : "warning",

          onConfirm: async () => {
            await handleToggleStatus(item.questionId);

            setModalConfig((prev) => ({
              ...prev,
              isOpen: false,
            }));
          },
        });
      },
    },
  ];
};
