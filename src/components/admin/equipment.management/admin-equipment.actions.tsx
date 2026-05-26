import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { TableAction } from "@/components/ui/table/table.types";
import type { UpdateEquipment } from "@/interface/equipment.interface";
import adminServices from "@/services/admin/admin.services";
import { parseApiError } from "@/api/error.helper";

export type EquipmentModalConfig = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  variant?: "danger" | "primary";
};

export const useEquipmentActions = (
  refetch: () => void,
  setModalConfig: React.Dispatch<React.SetStateAction<EquipmentModalConfig>>
): TableAction<UpdateEquipment>[] => {
  const navigate = useNavigate();

  return [
    {
      label: "Edit",
      variant: "primary",
      onClick: (equipment) => {
        // We route to the equipment form with ID query or edit path depending on the app's routing
        // For Bodometer, we usually use the form page and pass state or check params. Let's assume edit page path.
        navigate(`/admin/equipment-form?edit=${equipment.equipmentId}`);
      },
    },
    {
      label: "Block",
      variant: "danger",
      visible: (equipment) => equipment.isActive !== false,
      onClick: (equipment) => {
        setModalConfig({
          isOpen: true,
          title: "Block Equipment",
          message: `Are you sure you want to block ${equipment.title}?`,
          variant: "danger",
          onConfirm: async () => {
            try {
              const res = await adminServices.toggleEquipmentStatus(equipment.equipmentId);
              toast.success(res.message);
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
      visible: (equipment) => equipment.isActive === false,
      onClick: (equipment) => {
        setModalConfig({
          isOpen: true,
          title: "Unblock Equipment",
          message: `Are you sure you want to unblock ${equipment.title}?`,
          variant: "primary",
          onConfirm: async () => {
            try {
              const res = await adminServices.toggleEquipmentStatus(equipment.equipmentId);
              toast.success(res.message);
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
