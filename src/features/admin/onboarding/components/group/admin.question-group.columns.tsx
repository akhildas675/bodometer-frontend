import type { TableColumn } from "@/components/ui/table/table.types";
import { QuestionGroup } from "@/modules/onboarding/types/onboarding.interface";
export const questionGroupColumns: TableColumn<QuestionGroup>[] = [
  {
    key: "key",
    label: "Identifier Key",
    sortable: true,
  },
  {
    key: "title",
    label: "Title",
    sortable: true,
  },
  {
    key: "order",
    label: "Order",
    sortable: true,
    render: (item) => <span className="font-medium text-purple-300">{item.order}</span>,
  },
  {
    key: "isActive",
    label: "Status",
    sortable: false,
    render: (item) =>
      item.isActive !== false ? (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
          Active
        </span>
      ) : (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
          Inactive
        </span>
      ),
  },
  
];
