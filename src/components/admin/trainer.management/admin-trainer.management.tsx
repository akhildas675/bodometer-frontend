import { useState } from "react";
import { useAuthStore } from "../../../stores/auth.store";
import type { AdminGetTrainersResponse } from "../../../interface/admin.interface";
import adminServices from "../../../services/admin/admin.services";
import SidebarLayout from "../../ui/app.sidebar/sidebar.layout";
import DataTable from "../../ui/table/data.table";
import { trainerColumns } from "./admin-trainer.columns";
import { useTableFetch } from "../../../hooks/useTableFetch";
import { useTrainerActions } from "./admin-trainer.actions";
import ConfirmationModal from "../../ui/confirm.dialog";

const AdminTrainerManagement = () => {
  const user = useAuthStore((state) => state.user);

  const {
    data: users,
    loading,
    refetch,
  } = useTableFetch<AdminGetTrainersResponse[]>(() =>
    adminServices.getTrainers().then((res) => res.data)
  );
  
    const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: "danger" | "primary";
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const actions = useTrainerActions(refetch, setModalConfig);



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
      <ConfirmationModal
  isOpen={modalConfig.isOpen}
  title={modalConfig.title}
  message={modalConfig.message}
  variant={modalConfig.variant}
  onClose={() =>
    setModalConfig((prev) => ({ ...prev, isOpen: false }))
  }
  onConfirm={modalConfig.onConfirm}
/>

    </SidebarLayout>
    
  );
};

export default AdminTrainerManagement;
