
import { TableColumn } from "@/components/ui/table/table.types";
import type { SortOption } from "./sort";
export function extractSortOptions<T>(
  columns: TableColumn<T>[]
): SortOption<keyof T>[] {
  return columns
    .filter((col) => col.sortable !== false) 
    .map((col) => ({
      label: col.label,
      value: col.key,
    }));
}

