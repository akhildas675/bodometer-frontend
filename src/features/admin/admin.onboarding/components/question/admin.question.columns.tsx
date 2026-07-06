import type { TableColumn } from "@/ui.components/ui/table/table.types";
import { OnboardingQuestion } from "@/modules/onboarding/types/onboarding.interface";
export const questionColumns: TableColumn<OnboardingQuestion>[] = [
  {
    key: "order",
    label: "Order",
    sortable: true,
    render: (item) => <span className="text-purple-300 font-semibold">#{item.order}</span>
  },
  {
    key: "question",
    label: "Question",
    sortable: true,
  },
  {
    key: "type",
    label: "Type",
    sortable: false,
    render: (item) => (
      <span className="px-2 py-1 rounded-full text-xs border border-purple-700 bg-purple-900/20 text-purple-300 capitalize">
        {String(item.type).replace('_', ' ')}
      </span>
    )
  },
  {
    key: "validation",
    label: "Required",
    sortable: false,
    render: (item) => item.validation?.required ? <span className="text-red-400 text-sm">Yes</span> : <span className="text-gray-500 text-sm">No</span>
  },
  {
    key: "createdAt",
    label: "Created At",
    sortable: true,
    render: (item) => item.createdAt ? (
      <span className="text-sm text-purple-200/80">
        {new Date(item.createdAt).toLocaleDateString()}
      </span>
    ) : <span className="text-gray-500 text-xs">—</span>
  },
  {
    key: "isActive",
    label: "Status",
    sortable: false,
    render: (item) => (
      item.isActive !== false ? (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
          Active
        </span>
      ) : (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
          Inactive
        </span>
      )
    )
  },
];
