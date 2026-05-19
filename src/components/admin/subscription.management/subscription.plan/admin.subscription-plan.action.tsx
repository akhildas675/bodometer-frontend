import { TableAction } from "@/components/ui/table/table.types";
import { ADMIN_UI_ROUTES } from "@/constants/constant-routes/ui-routes/admin.ui-constant-routes";
import { SubscriptionPlanListItem } from "@/interface/admin.interface";
import adminServices from "@/services/admin/admin.services";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { parseApiError } from "@/api/error.helper";


export type SubscriptionModalConfig = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  variant?: "danger" | "primary";
};

export const useSubscriptionActions = (
  refetch: () => void,
  setModalConfig: React.Dispatch<React.SetStateAction<SubscriptionModalConfig>>
): TableAction<SubscriptionPlanListItem>[] => {
  const navigate = useNavigate();

  const handleToggleStatus = (plan: SubscriptionPlanListItem) => {
    const isActive = plan.isActive;
    setModalConfig({
      isOpen: true,
      title: isActive ? "Deactivate Plan" : "Activate Plan",
      message: `Are you sure you want to ${isActive ? "deactivate" : "activate"} "${plan.name}"?`,
      variant: isActive ? "danger" : "primary",
      onConfirm: async () => {
        try {
          const res = await adminServices.toggleSubscriptionPlanStatus(plan.planId);
          toast.success(res.message);
          refetch();
        } catch (error) {
          const apiError = parseApiError(error);
          toast.error(apiError.message);
        }
      },
    });
  };

  return [
    {
      label: "Edit",
      variant: "primary",
      onClick: (plan: SubscriptionPlanListItem) => navigate(ADMIN_UI_ROUTES.SUBSCRIPTION_PLAN_EDIT(plan.planId)),
    },
    {
      label: "Deactivate",
      variant: "danger",
      visible: (plan: SubscriptionPlanListItem) => plan.isActive,
      onClick: handleToggleStatus,
    },
    {
      label: "Activate",
      variant: "primary",
      visible: (plan: SubscriptionPlanListItem) => !plan.isActive,
      onClick: handleToggleStatus,
    },
  ];
};