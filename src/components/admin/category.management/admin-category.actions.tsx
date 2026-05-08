import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { TableAction } from "@/components/ui/table/table.types";
import type { UpdateCategory } from "@/interface/admin.interface";
import adminServices from "@/services/admin/admin.services";
import { ADMIN_UI_ROUTES } from "@/constants/constant-routes/ui-routes/admin.ui-constant-routes";

export type CategoryModalConfig = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  variant?: "danger" | "primary";
};

export const useCategoryActions = (
  refetch: () => void,
  setModalConfig: React.Dispatch<React.SetStateAction<CategoryModalConfig>>
): TableAction<UpdateCategory>[] => {
  const navigate = useNavigate();

  const handleToggle = (cat: UpdateCategory) => {
    const isCurrentlyActive = cat.isActive;
    setModalConfig({
      isOpen: true,
      title: isCurrentlyActive ? "Block Category" : "Unblock Category",
      message: isCurrentlyActive
        ? `Are you sure you want to block "${cat.name}"?`
        : `Are you sure you want to unblock "${cat.name}"?`,
      variant: isCurrentlyActive ? "danger" : "primary",
      onConfirm: async () => {
        try {
          await adminServices.toggleCategoryStatus(cat.categoryId);
          toast.success(
            isCurrentlyActive
              ? "Category blocked successfully"
              : "Category unblocked successfully"
          );
          refetch();
        } catch (err: unknown) {
          const message =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            (err instanceof Error ? err.message : "Failed to update category status");
          toast.error(`Error: ${message}`);
          console.error("Toggle error:", err);
        }
      },
    });
  };

  return [
    {
      label: "Edit",
      variant: "primary",
      onClick: (cat) => {
        navigate(ADMIN_UI_ROUTES.CATEGORY_EDIT(cat.categoryId));
      },
    },
    {
      label: "Block",
      variant: "danger",
      // Show "Block" when active (true) or status unknown (undefined) — default to showing block
      visible: (cat) => cat.isActive !== false,
      onClick: handleToggle,
    },
    {
      label: "Unblock",
      variant: "primary",
      // Show "Unblock" only when explicitly blocked (false)
      visible: (cat) => cat.isActive === false,
      onClick: handleToggle,
    },
  ];
};
