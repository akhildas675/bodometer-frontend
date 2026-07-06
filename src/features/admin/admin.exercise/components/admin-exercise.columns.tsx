import type { TableColumn } from "@/ui.components/ui/table/table.types";
import type { ExerciseRow } from "@/interface/exercise.interface";

export const exerciseColumns: TableColumn<ExerciseRow>[] = [
  {
    key: "media",
    label: "Image",
    sortable: false,
    render: (exercise) =>
      exercise.media?.image ? (
        <img
          src={exercise.media.image}
          alt={exercise.title}
          className="w-12 h-12 object-cover rounded-lg border border-purple-800/40"
        />
      ) : (
        <div className="w-12 h-12 rounded-lg bg-indigo-800/50 flex items-center justify-center text-purple-500 text-xs">
          N/A
        </div>
      ),
  },
  { key: "title", label: "Title", sortable: true },
  {
    key: "difficulty",
    label: "Difficulty",
    sortable: true,
    render: (exercise) => {
      const colorMap: Record<string, string> = {
        beginner: "bg-green-500/20 text-green-400 border-green-500/30",
        intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        advanced: "bg-red-500/20 text-red-400 border-red-500/30",
      };
      const cls = colorMap[exercise.difficulty] ?? "bg-purple-500/20 text-purple-400 border-purple-500/30";
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium border capitalize ${cls}`}>
          {exercise.difficulty}
        </span>
      );
    },
  },
  {
    key: "isCompound",
    label: "Type",
    sortable: false,
    render: (exercise) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${exercise.isCompound ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" : "bg-slate-500/20 text-slate-400 border-slate-500/30"}`}>
        {exercise.isCompound ? "Compound" : "Isolation"}
      </span>
    ),
  },
  {
    key: "description",
    label: "Description",
    render: (exercise) => (
      <span className="line-clamp-2 max-w-xs text-purple-300 text-xs">
        {exercise.description}
      </span>
    ),
  },
  {
    key: "isActive",
    label: "Status",
    sortable: false,
    render: (exercise) =>
      exercise.isActive !== false ? (
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
