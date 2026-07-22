import type { TableColumn } from "@/ui.components/ui/table/table.types";
import { UpdateCoaching } from "@/modules/coaching/types/coaching.interface";

export const coachingColumns: TableColumn<UpdateCoaching>[] = [
  {
    key: "serviceType",
    label: "Service Type",
    render: (coaching) => (
      <span className="font-medium text-white">{coaching.serviceType}</span>
    ),
  },
  {
    key: "durationMinutes",
    label: "Duration",
    render: (coaching) => (
      <span className="text-purple-300 text-sm">
        {coaching.durationMinutes} mins
      </span>
    ),
  },
  {
    key: "price",
    label: "Price",
    render: (coaching) => (
      <span className="font-semibold text-emerald-400">
        ${coaching.price}
      </span>
    ),
  },
  {
    key: "bookingMode",
    label: "Booking Mode",
    render: (coaching) => (
      <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
        {coaching.bookingMode}
      </span>
    ),
  },
  {
    key: "description",
    label: "Description",
    render: (coaching) => (
      <span className="line-clamp-2 max-w-xs text-purple-300 text-xs">
        {coaching.description || "N/A"}
      </span>
    ),
  },
  {
    key: "isActive",
    label: "Status",
    sortable: false,
    render: (coaching) =>
      coaching.isActive !== false ? (
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
          Active
        </span>
      ) : (
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
          Blocked
        </span>
      ),
  },
];
