import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { TableAction } from "@/components/ui/table/table.types";
import { MealCategory } from "@/interface/health-log.interface";
import adminServices from "@/services/admin/admin.services";
import { parseApiError } from "@/api/error.helper";
import { ADMIN_UI_ROUTES } from "@/constants/constant-routes/ui-routes/admin.ui-constant-routes";

export type MealCategoryModalConfig = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  variant?: "danger" | "primary";
};

export const useMealCategoryActions = (
  refetch: () => void,
  setModalConfig: React.Dispatch<React.SetStateAction<MealCategoryModalConfig>>
): TableAction<MealCategory>[] => {
  const navigate = useNavigate();

  return [
    {
      label: "Edit",
      variant: "primary",
      onClick: (category) => {
        navigate(`${ADMIN_UI_ROUTES.MEAL_CATEGORY_FORM}?id=${category.mealCategoryId}`);
      },
    },
    {
      label: "Block",
      variant: "danger",
      visible: (category) => category.isActive !== false,
      onClick: (category) => {
        setModalConfig({
          isOpen: true,
          title: "Block Meal Category",
          message: `Are you sure you want to block ${category.title}?`,
          variant: "danger",
          onConfirm: async () => {
            try {
              if (!category.mealCategoryId) return;
              const res = await adminServices.toggleMealCategoryStatus(category.mealCategoryId);
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
      visible: (category) => category.isActive === false,
      onClick: (category) => {
        setModalConfig({
          isOpen: true,
          title: "Unblock Meal Category",
          message: `Are you sure you want to unblock ${category.title}?`,
          variant: "primary",
          onConfirm: async () => {
            try {
              if (!category.mealCategoryId) return;
              const res = await adminServices.toggleMealCategoryStatus(category.mealCategoryId);
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
