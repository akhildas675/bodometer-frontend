
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { AdminGetSubscriptionResponse, TableAction } from "@/components/ui/table/table.types";
import adminServices from "@/services/admin/admin.services";




export type SubscriptionModalConfig = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  variant?: "danger" | "primary";
};

export const useSubscriptionActions = (
  navigate: ReturnType<typeof useNavigate>,
  refreshSubscriptions: () => void,
  setModalConfig: React.Dispatch<React.SetStateAction<SubscriptionModalConfig>>,
): TableAction<AdminGetSubscriptionResponse>[] => {
  return [
    {
      label: "Edit",
      variant: "primary",
      onClick: (sub) => navigate(`/admin/subscription/edit/${sub.id}`),
    },
    {
      label: "Deactivate",
      variant: "danger",
      visible: (sub) => sub.isActive,
      onClick: (sub) => {
        setModalConfig({
          isOpen: true,
          title: "Deactivate Plan",
          message: `Are you sure you want to deactivate "${sub.name}"?`,
          variant: "danger",
          onConfirm: async () => {
            try {
              await adminServices.toggleSubscriptionStatus(sub.id)
              toast.success("Plan deactivated");
              refreshSubscriptions();
            } catch {
              toast.error("Failed to deactivate plan");
            }
          },
        });
      },
    },
    {
      label: "Activate",
      variant: "primary",
      visible: (sub) => !sub.isActive,
      onClick: (sub) => {
        setModalConfig({
          isOpen: true,
          title: "Activate Plan",
          message: `Are you sure you want to activate "${sub.name}"?`,
          variant: "primary",
          onConfirm: async () => {
            try {
              await adminServices.toggleSubscriptionStatus(sub.id);
              toast.success("Plan activated");
              refreshSubscriptions();
            } catch {
              toast.error("Failed to activate plan");
            }
          },
        });
      },
    },
  ];
};