import type { TableColumn } from "@/components/ui/table/table.types";
import { SubscriptionFeature } from "@/interface/admin.interface";


export const subscriptionFeatureColumns: TableColumn<SubscriptionFeature>[] = [
  {
    key: "title",
    label: "Title",
    sortable: true,
    render: (feature) => (
      <div className="flex flex-col gap-0.5">
        <span className="font-medium text-white">{feature.title}</span>
      </div>
    ),
  },
  {
    key: "description",
    label: "Description",
    sortable: false,
    render: (feature) => (
      <span className="line-clamp-2 max-w-xs text-purple-300 text-xs">
        {feature.description ?? "—"}
      </span>
    ),
  },
  {
    key: "type",
    label: "Type",
    sortable: true,
    render: (feature) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium border ${
          feature.type === "boolean"
            ? "bg-sky-500/20 text-sky-400 border-sky-500/30"
            : "bg-violet-500/20 text-violet-400 border-violet-500/30"
        }`}
      >
        {feature.type}
      </span>
    ),
  },
  {
    key: "isActive",
    label: "Status",
    sortable: false,
    render: (feature) =>
      feature.isActive !== false ? (
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