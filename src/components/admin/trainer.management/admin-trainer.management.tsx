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
import SearchBar from "../../controls/search/search";

const AdminTrainerManagement = () => {
  const user = useAuthStore((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: users,
    loading,
    refetch,
  } = useTableFetch<AdminGetTrainersResponse[]>(() =>
    adminServices.getTrainers(searchQuery).then((res) => res.data)
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

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  if (!user) {
    return <div className="text-white p-6">Loading...</div>;
  }

  return (
    <SidebarLayout role={user.role}>
      <div className="text-white">
        <h1 className="text-2xl font-semibold mb-6">Trainer Management</h1>
        
        {/* Search Bar */}
        <div className="mb-4">
          <SearchBar
            value={searchQuery}
            onSearch={handleSearch}
            placeholder="Search trainers by name or email..."
            disabled={loading}
            className="max-w-md"
          />
        </div>

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