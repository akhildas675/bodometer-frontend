
import type { TableColumn } from "../../ui/table/table.types";
import type { AdminGetUsersResponse } from "../../../interface/admin.interface";

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