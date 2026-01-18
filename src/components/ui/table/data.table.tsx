import type { TableAction, TableColumn } from "./table.types";

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  actions?: TableAction<T>[];
}

export default function DataTable<T>({
  columns,
  data,
  actions,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full border-collapse text-sm text-white">
        {/* HEADER */}
        <thead className="bg-white/5 text-left">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-4 py-3 font-semibold tracking-wide"
              >
                {col.label}
              </th>
            ))}
            {actions && (
              <th className="px-4 py-3 font-semibold">Actions</th>
            )}
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className="border-t border-white/5 hover:bg-white/5 transition"
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-3">
  {col.render ? col.render(row) : String(row[col.key])}
</td>

              ))}

              {actions && (
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {actions
                      .filter((a) => (a.visible ? a.visible(row) : true))
                      .map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => action.onClick(row)}
                          disabled={action.disabled?.(row)}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition
                            ${
                              action.variant === "danger"
                                ? "bg-red-600/80 hover:bg-red-600"
                                : "bg-indigo-600/80 hover:bg-indigo-600"
                            }
                            disabled:opacity-50`}
                        >
                          {action.label}
                        </button>
                      ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
