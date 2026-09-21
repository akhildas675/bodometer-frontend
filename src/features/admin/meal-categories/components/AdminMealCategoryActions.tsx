import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { TableAction } from "@/components/ui/DataTable.types";
import { MealCategory } from "@/features/admin/meal-categories/types/meal-category.types";
import mealCategoryService from "@/features/admin/meal-categories/services/meal-category.service";
import { parseApiError } from "@/infrastructure/api/api-error";
import { ADMIN_UI_ROUTES } from "@/constants/routes/admin.routes";

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
              const res = await mealCategoryService.toggleMealCategoryStatus(category.mealCategoryId);
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
              const res = await mealCategoryService.toggleMealCategoryStatus(category.mealCategoryId);
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
