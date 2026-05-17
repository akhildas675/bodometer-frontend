import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import DataTable from "@/components/ui/table/data.table";
import SearchBar from "@/components/controls/search/search";
import Pagination from "@/components/controls/pagination/pagination";
import ConfirmationModal from "@/components/ui/confirm.dialog";

import { useTableFetch } from "@/hooks/useTableFetch";
import { getQuestionGroupActions, type GroupModalConfig } from "./admin.question-group.actions";
import type { QuestionGroup, PaginatedResponse } from "@/interface/admin.interface";
import { ADMIN_UI_ROUTES } from "@/constants/constant-routes/ui-routes/admin.ui-constant-routes";
import { questionGroupColumns } from "./admin.question-group.columns";
import adminServices from "@/services/admin/admin.services";

const AdminQuestionGroupList = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchFn = useCallback(
    () => adminServices.getQuestionGroups(searchQuery, currentPage, itemsPerPage),
    [searchQuery, currentPage, itemsPerPage]
  );

  const {
    data: response,
    loading,
    refetch,
  } = useTableFetch<PaginatedResponse<QuestionGroup>>(fetchFn, false);

  useEffect(() => {
    refetch();
  }, [fetchFn, refetch]);

  const [modalConfig, setModalConfig] = useState<GroupModalConfig>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const tableActions = getQuestionGroupActions(navigate, refetch, setModalConfig);

  return (
    <div className="text-white space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
            Onboarding Groups
          </h1>
          <p className="text-sm text-gray-400">Manage dynamic onboarding process flows.</p>
        </div>
        <button
          onClick={() => navigate(ADMIN_UI_ROUTES.QUESTION_GROUPS_CREATE)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          <Plus size={18} />
          New Group
        </button>
      </div>

      <div className="flex items-center gap-4 max-w-md mb-4">
        <SearchBar
          value={searchQuery}
          onSearch={(v) => {
            setSearchQuery(v);
            setCurrentPage(1);
          }}
          placeholder="Search groups..."
          disabled={loading}
          className="flex-1"
        />
      </div>

      {loading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500"></div>
        </div>
      ) : (
        <>
          <DataTable<QuestionGroup>
            columns={questionGroupColumns}
            data={response?.data || []}
            actions={tableActions}
          />
          {response?.pagination && (
            <div className="mt-4">
              <Pagination
                currentPage={Number(response.pagination.currentPage)}
                totalPages={Number(response.pagination.totalPages)}
                totalItems={Number(response.pagination.totalItems)}
                itemsPerPage={Number(response.pagination.itemsPerPage)}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(n) => {
                  setItemsPerPage(n);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}
        </>
      )}

      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        variant={modalConfig.variant}
        onClose={() => setModalConfig((p) => ({ ...p, isOpen: false }))}
        onConfirm={modalConfig.onConfirm}
      />
    </div>
  );
};

export default AdminQuestionGroupList;
