import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import type { TableAction } from "@/components/ui/table/table.types";
import type { SubscriptionFeature } from "@/interface/admin.interface";
import adminServices from "@/services/admin/admin.services";
import { ADMIN_UI_ROUTES } from "@/constants/constant-routes/ui-routes/admin.ui-constant-routes";

export type FeatureModalConfig = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  variant?: "danger" | "primary";
};

export const useSubscriptionFeatureActions = (
  refetch: () => void,
  setModalConfig: React.Dispatch<React.SetStateAction<FeatureModalConfig>>
): TableAction<SubscriptionFeature>[] => {
  const navigate = useNavigate();

// admin.subscription-feature.action.ts
const handleToggle = (feature: SubscriptionFeature) => {
  const isCurrentlyActive = feature.isActive;
  setModalConfig({
    isOpen: true,
    title: isCurrentlyActive ? "Deactivate Feature" : "Activate Feature",
    message: isCurrentlyActive
      ? `Are you sure you want to deactivate "${feature.title}"?`
      : `Are you sure you want to activate "${feature.title}"?`,
    variant: isCurrentlyActive ? "danger" : "primary",
    onConfirm: async () => {
      try {
        const featureId = feature.subscriptionFeatureId;
    
        await adminServices.toggleSubscriptionFeatureStatus(featureId!);
        toast.success(
          isCurrentlyActive
            ? "Feature deactivated successfully"
            : "Feature activated successfully"
        );
        refetch();
      } catch {
        toast.error("Failed to update feature status");
      }
    },
  });
};



  return [
    {
      label: "Edit",
      variant: "primary",
      onClick: (feature) => {
        const featureId = feature.subscriptionFeatureId;
        navigate(ADMIN_UI_ROUTES.SUBSCRIPTION_FEATURE_EDIT(featureId!));
      },
    },
    {
      label: "Deactivate",
      variant: "danger",
      visible: (feature) => feature.isActive !== false,
      onClick: handleToggle,
    },
    {
      label: "Activate",
      variant: "primary",
      visible: (feature) => feature.isActive === false,
      onClick: handleToggle,
    },
    
  ];
};