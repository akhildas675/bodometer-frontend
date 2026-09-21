import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { TableAction } from "@/components/ui/DataTable.types";
import { UpdateCoaching } from "@/features/admin/coaching/types/coaching.types";
import { parseApiError } from "@/infrastructure/api/api-error";
import { coachingService } from "@/features/admin/coaching/services/coaching.service";
import { ADMIN_UI_ROUTES } from "@/constants/routes/admin.routes";

export type CoachingModalConfig = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  variant?: "danger" | "primary";
};

export const useCoachingActions = (
  refetch: () => void,
  setModalConfig: React.Dispatch<React.SetStateAction<CoachingModalConfig>>
): TableAction<UpdateCoaching>[] => {
  const navigate = useNavigate();

  return [
    {
      label: "Edit",
      variant: "primary",
      onClick: (coaching) => {
        const id = coaching.coachingId || coaching._id || coaching.serviceId;
        if (id) {
          navigate(ADMIN_UI_ROUTES.COACHING_EDIT(id));
        }
      },
    },
    {
      label: "Block",
      variant: "danger",
      visible: (coaching) => coaching.isActive !== false,
      onClick: (coaching) => {
        const id = coaching.coachingId || coaching._id || coaching.serviceId;
        if (!id) return;
        setModalConfig({
          isOpen: true,
          title: "Block Coaching Service",
          message: `Are you sure you want to block ${coaching.serviceType}?`,
          variant: "danger",
          onConfirm: async () => {
            try {
              const res = await coachingService.toggleCoachingStatus(id);
              toast.success(res.message || "Status updated successfully");
              refetch();
            } catch (error: unknown) {
              const apiError = parseApiError(error);
              toast.error(apiError.message);
            }
          },
        });
      },
    },
    {
      label: "Unblock",
      variant: "primary",
      visible: (coaching) => coaching.isActive === false,
      onClick: (coaching) => {
        const id = coaching.coachingId || coaching._id || coaching.serviceId;
        if (!id) return;
        setModalConfig({
          isOpen: true,
          title: "Unblock Coaching Service",
          message: `Are you sure you want to unblock ${coaching.serviceType}?`,
          variant: "primary",
          onConfirm: async () => {
            try {
              const res = await coachingService.toggleCoachingStatus(id);
              toast.success(res.message || "Status updated successfully");
              refetch();
            } catch (error: unknown) {
              const apiError = parseApiError(error);
              toast.error(apiError.message);
            }
          },
        });
      },
    },
  ];
};
