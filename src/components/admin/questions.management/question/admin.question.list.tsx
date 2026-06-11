import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Loader2 } from "lucide-react";


import DataTable from "@/components/ui/table/data.table";
import SearchBar from "@/components/controls/search/search";
import Pagination from "@/components/controls/pagination/pagination";
import ConfirmationModal from "@/components/ui/confirm.dialog";
import SortDropdown, { type SortConfig } from "@/components/controls/sort/sort";
import { extractSortOptions } from "@/components/controls/sort/sort.label";

import { useTableFetch } from "@/hooks/useTableFetch";
import adminServices from "@/services/admin/admin.services";

import { getQuestionActions, type QuestionModalConfig } from "./admin.question.actions";
import { PaginatedResponse } from "@/interface/common.interface";
import { OnboardingQuestion, QuestionGroup } from "@/interface/onboarding.interface";
import { ADMIN_UI_ROUTES } from "@/constants/constant-routes/ui-routes/admin.ui-constant-routes";
import { questionColumns } from "./admin.question.columns";

const AdminQuestionList = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [groups, setGroups] = useState<QuestionGroup[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<SortConfig<keyof OnboardingQuestion>>({
    field: "createdAt" as keyof OnboardingQuestion,
    order: "desc",
  });

  useEffect(() => {
     adminServices.getQuestionGroups({ page: 1, limit: 100 }).then(res => {
         setGroups(res.data || []);
     }).catch(e => console.error(e));
  }, []);

  const fetchFn = useCallback(
    () =>
      adminServices.getQuestions({
        search: searchQuery || undefined,
        groupId: selectedGroup || undefined,
        page: currentPage,
        limit: itemsPerPage,
        sortBy: sortConfig.field ? String(sortConfig.field) : undefined,
        sortOrder: sortConfig.order,
      }),
    [searchQuery, selectedGroup, currentPage, itemsPerPage, sortConfig]
  );

  const {
    data: response,
    loading,
    refetch,
  } = useTableFetch<PaginatedResponse<OnboardingQuestion>>(fetchFn, false);

  useEffect(() => {
    refetch();
  }, [fetchFn, refetch]);

  const [modalConfig, setModalConfig] = useState<QuestionModalConfig>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const handleSortChange = useCallback(
    (sort: SortConfig<keyof OnboardingQuestion>) => {
      setSortConfig(sort);
      setCurrentPage(1);
    },
    []
  );

  const sortOptions = extractSortOptions(questionColumns);

  const tableActions = getQuestionActions(navigate, refetch, setModalConfig);

  return (
    <div className="text-white space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
            Questionnaire Builder
          </h1>
          <p className="text-sm text-gray-400">Add behavior specific logic queries.</p>
        </div>
        <button
          onClick={() => navigate(ADMIN_UI_ROUTES.QUESTION_CREATE)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          <Plus size={18} />
          Add Question
        </button>
      </div>

      <div className="flex gap-4 items-center flex-wrap">
         <SearchBar
           value={searchQuery}
           onSearch={v => { setSearchQuery(v); setCurrentPage(1); }}
           placeholder="Search text..."
           className="max-w-xs flex-1"
         />
         <select 
            value={selectedGroup} 
            onChange={e => { setSelectedGroup(e.target.value); setCurrentPage(1); }}
            className="bg-[#0c0624] border border-purple-900/50 rounded-lg px-4 py-2 text-sm text-purple-200 outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer hover:border-purple-500/50 transition"
         >
            <option value="">All Groups</option>
            {groups.map(g => <option key={g.groupId} value={g.groupId}>{g.title}</option>)}
         </select>
         <SortDropdown<keyof OnboardingQuestion>
            options={sortOptions}
            value={sortConfig}
            onSortChange={handleSortChange}
            disabled={loading}
            className="w-60"
            placeholder="Sort by..."
         />
      </div>

      {loading ? (
         <div className="h-48 flex items-center justify-center"><Loader2 className="animate-spin text-purple-500 h-8 w-8" /></div>
      ) : (
        <>
          <DataTable<OnboardingQuestion>
             columns={questionColumns}
             data={response?.data || []}
             actions={tableActions}
          />
          {response?.pagination && (
             <Pagination 
               currentPage={Number(response.pagination.currentPage)}
               totalPages={Number(response.pagination.totalPages)}
               totalItems={Number(response.pagination.totalItems)}
               itemsPerPage={Number(response.pagination.itemsPerPage)}
               onPageChange={setCurrentPage}
               onItemsPerPageChange={n => { setItemsPerPage(n); setCurrentPage(1); }}
             />
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

export default AdminQuestionList;
