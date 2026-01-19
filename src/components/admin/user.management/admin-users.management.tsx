import { useEffect, useState, useCallback } from "react";
import SidebarLayout from "../../ui/app.sidebar/sidebar.layout";
import { useAuthStore } from "../../../stores/auth.store";

import { userColumns } from "./admin-users.columns";
import { useUserActions } from "./admin-users.actions";
import adminServices from "../../../services/admin/admin.services";
import type { AdminGetUsersResponse } from "../../../interface/admin.interface";
import DataTable from "../../ui/table/data.table";

const AdminUsersManagement = () => {
  const user = useAuthStore((state) => state.user);
  const [users, setUsers] = useState<AdminGetUsersResponse[]>([]);
  const [loading, setLoading] = useState(true);


  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminServices.getUsers();
      console.log("Users from backend", res.data);
      setUsers(res.data);
    } finally {
      setLoading(false);
    }
  }, []);


  const actions = useUserActions(fetchUsers);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (!user) {
    return <div className="text-white p-6">Loading...</div>;
  }

  return (
    <SidebarLayout role={user.role}>
      <div className="text-white">
        <h1 className="text-2xl font-semibold mb-6">User Management</h1>

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <DataTable<AdminGetUsersResponse>
            columns={userColumns}
            data={users}
            actions={actions}
          />
        )}
      </div>
    </SidebarLayout>
  );
};

export default AdminUsersManagement;
