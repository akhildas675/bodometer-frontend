
import { TableColumn } from "@/components/ui/DataTable.types";
import type { SortOption } from "@/components/ui/SortControl";
export function extractSortOptions<T>(
  columns: TableColumn<T>[]
): SortOption<keyof T>[] {
  return columns
    .filter((col) => col.sortable !== false) 
    .map((col) => ({
      label: col.label,
      value: col.key as keyof T,

    }));
}

