import type { TableColumn } from "@/ui.components/ui/table/table.types";
import { MealCategory } from "@/modules/meal-category/types/meal-category.interface";
export const mealCategoryColumns: TableColumn<MealCategory>[] = [
  {
    key: "title",
    label: "Title",
    render: (category) => <span className="font-medium text-purple-200">{category.title}</span>,
  },
  {
    key: "description",
    label: "Description",
    sortable: false,
    render: (category) => (
      <p className="text-gray-400 line-clamp-2 max-w-md" title={category.description}>
        {category.description}
      </p>
    ),
  },
  {
    key: "isActive",
    label: "Status",
    sortable: false,
    render: (category) =>
      category.isActive !== false ? (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
          Active
        </span>
      ) : (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
          Blocked
        </span>
      ),
  },
];
