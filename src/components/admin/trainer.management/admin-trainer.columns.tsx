import type { AdminGetTrainersResponse } from "../../../interface/admin.interface";
import type { TableColumn } from "../../ui/table/table.types";

export const trainerColumns: TableColumn<AdminGetTrainersResponse>[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  {
    key: "isBlocked",
    label: "Status",
    render: (trainer) => (
      <span style={{ color: trainer.isBlocked ? "red" : "green" }}>
        {trainer.isBlocked ? "Blocked" : "Active"}
      </span>
    ),
  },
  {
    key: "createdAt",
    label: "Joined",
    render: (trainer) => new Date(trainer.createdAt).toLocaleDateString(),
  },
];
