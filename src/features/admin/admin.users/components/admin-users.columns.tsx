import type { TableColumn } from "@/ui.components/ui/table/table.types";
import { AdminGetUsersResponse } from "@/interface/user.interface";
export const userColumns: TableColumn<AdminGetUsersResponse>[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  {
    key: "isBlocked",
    label: "Status",
    render: (user) => (
      <span style={{ color: user.isBlocked ? "red" : "green" }}>
        {user.isBlocked ? "Blocked" : "Active"}
      </span>
    ),
  },
  {
    key: "createdAt",
    label: "Joined",
    render: (user) =>
      new Date(user.createdAt).toLocaleDateString(),
  },
];