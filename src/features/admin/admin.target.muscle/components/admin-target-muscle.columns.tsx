import type { TableColumn } from "@/ui.components/ui/table/table.types";
import type { UpdateTargetMuscles } from "@/interface/target-muscle.interface";

export const targetMuscleColumns: TableColumn<UpdateTargetMuscles>[] = [
  {
    key: "image",
    label: "Image",
    sortable: false,
    render: (muscle) =>
      muscle.image ? (
        <img
          src={muscle.image}
          alt={muscle.title}
          className="w-12 h-12 object-cover rounded-lg border border-purple-800/40"
        />
      ) : (
        <div className="w-12 h-12 rounded-lg bg-indigo-800/50 flex items-center justify-center text-purple-500 text-xs">
          N/A
        </div>
      ),
  },
  { key: "title", label: "Title" },
  {
    key: "bodyRegion",
    label: "Body Region",
    render: (muscle) => (
      <span className="capitalize">{muscle.bodyRegion?.replace('_', ' ')}</span>
    ),
  },
  {
    key: "description",
    label: "Description",
    render: (muscle) => (
      <span className="line-clamp-2 max-w-xs text-purple-300 text-xs">
        {muscle.description}
      </span>
    ),
  },
  {
    key: "isActive",
    label: "Status",
    sortable: false,
    render: (muscle) =>
      muscle.isActive !== false ? (
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
