import type { AdminGetSubscriptionResponse, TableColumn } from "@/components/ui/table/table.types";


export const subscriptionColumns: TableColumn<AdminGetSubscriptionResponse>[] = [
  { key: "name", label: "Plan Name", sortable: true },
  { key: "description", label: "Description", sortable: false },
  {
    key: "price",
    label: "Price",
    sortable: true,
    render: (sub) => <span>₹{sub.price}</span>,
  },
  {
    key: "durationInDays",
    label: "Duration",
    sortable: true,
    render: (sub) => <span>{sub.durationInDays} days</span>,
  },
  {
    key: "isActive",
    label: "Status",
    sortable: true,
    render: (sub) => (
      <span style={{ color: sub.isActive ? "green" : "red" }}>
        {sub.isActive ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    key: "createdAt",
    label: "Created",
    sortable: true,
    render: (sub) => new Date(sub.createdAt).toLocaleDateString(),
  },
];