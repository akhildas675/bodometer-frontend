import { useAuthStore } from "../../../stores/auth.store";
import type { AdminGetTrainersResponse } from "../../../interface/admin.interface";
import adminServices from "../../../services/admin/admin.services";
import SidebarLayout from "../../ui/app.sidebar/sidebar.layout";
import DataTable from "../../ui/table/data.table";
import { useTrainerActions } from "./admin-trainer.actions";
import { trainerColumns } from "./admin-trainer.columns";
import { useTableFetch } from "../../../hooks/useTableFetch";

const AdminTrainerManagement = () => {
  const user = useAuthStore((state) => state.user);

  const {
    data: users,
    loading,
    refetch,
  } = useTableFetch<AdminGetTrainersResponse[]>(() =>
    adminServices.getTrainers().then((res) => res.data)
  );
  const actions = useTrainerActions(refetch);

  if (!user) {
    return <div className="text-white p-6">Loading...</div>;
  }
  return (
    <SidebarLayout role={user.role}>
      <div className="text-white">
        <h1 className="text-2x1 font-semibold mb-6">Trainer Management</h1>

        {loading ? (
          <p>Loading trainers....</p>
        ) : (
          <DataTable<AdminGetTrainersResponse>
            columns={trainerColumns}
            data={users}
            actions={actions}
          />
        )}
      </div>
    </SidebarLayout>
  );
};

export default AdminTrainerManagement;
