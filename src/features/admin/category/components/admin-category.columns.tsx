import type { TableColumn } from "@/components/ui/table/table.types";
import { UpdateCategory } from "@/modules/category/types/category.interface";
export const categoryColumns: TableColumn<UpdateCategory>[] = [
  {
    key: "image",
    label: "Image",
    sortable: false,
    render: (cat) =>
      cat.image ? (
        <img
          src={cat.image}
          alt={cat.name}
          className="w-12 h-12 object-cover rounded-lg border border-purple-800/40"
        />
      ) : (
        <div className="w-12 h-12 rounded-lg bg-indigo-800/50 flex items-center justify-center text-purple-500 text-xs">
          N/A
        </div>
      ),
  },
  { key: "name", label: "Name" },
  {
    key: "description",
    label: "Description",
    render: (cat) => (
      <span className="line-clamp-2 max-w-xs text-purple-300 text-xs">
        {cat.description}
      </span>
    ),
  },
  {
    key: "isActive",
    label: "Status",
    sortable: false,
    render: (cat) =>
      cat.isActive !== false ? (
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
