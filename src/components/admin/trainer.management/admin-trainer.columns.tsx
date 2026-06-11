import { AdminGetTrainersResponse } from "@/interface/trainer.interface";
import type { TableColumn } from "@/components/ui/table/table.types";
export const trainerColumns: TableColumn<AdminGetTrainersResponse>[] = [
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "role", label: "Role", sortable: false },
  {
    key: "isBlocked",
    label: "Status",
    sortable: true,
    render: (trainer) => (
      <span style={{ color: trainer.isBlocked ? "red" : "green" }}>
        {trainer.isBlocked ? "Blocked" : "Active"}
      </span>
    ),
  },
  {
    key: "createdAt",
    label: "Joined",
    sortable: true,
    render: (trainer) => new Date(trainer.createdAt).toLocaleDateString(),
  },
];