import { useState, useCallback, useEffect } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import adminServices from "@/services/admin/admin.services";
import { OnboardingQuestion } from "@/interface/onboarding.interface";
import { ADMIN_UI_ROUTES } from "@/constants/constant-routes/ui-routes/admin.ui-constant-routes";
import OnboardingQuestionList from "@/components/admin/onboarding-question.managment/onboarding-question.list";

import type { PaginationMeta } from "@/interface/admin.interface";
import { useTableFetch } from "@/hooks/useTableFetch";
import Pagination from "@/components/controls/pagination/pagination";
import SortDropdown, { type SortConfig } from "@/components/controls/sort/sort";

const QUESTION_SORT_OPTIONS = [
  { label: "Created (Newest)", value: "createdAt" },
  { label: "Display Order",    value: "order" },
  { label: "Question Text",    value: "question" },
];

const AdminOnboardingQuestionsPage = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage]   = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig]     = useState<SortConfig<string>>({
    field: "createdAt",
    order: "desc",
  });

  const { data: response, loading, refetch } =
    useTableFetch<{ data: OnboardingQuestion[]; pagination: PaginationMeta }>(
      () =>
        adminServices
          .getOnboardingQuestions(
            currentPage,
            itemsPerPage,
            sortConfig.field as "createdAt" | "order" | "question" | undefined,
            sortConfig.order,
          )
          .then((res) => ({ data: res.data, pagination: res.pagination })),
      false,
    );

  useEffect(() => {
    refetch();
  }, [currentPage, itemsPerPage, sortConfig, refetch]);

  const handleSortChange = useCallback((sort: SortConfig<string>) => {
    setSortConfig(sort);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleItemsPerPageChange = useCallback((items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  }, []);

  const handleToggleStatus = async (question: OnboardingQuestion) => {
    try {
      const res = await adminServices.updateOnboardingQuestion(question.id, {
        isActive: !question.isActive,
      });
      if (res.success) {
        toast.success(`Question ${question.isActive ? "blocked" : "unblocked"} successfully`);
        refetch();
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      const res = await adminServices.deleteOnboardingQuestion(id);
      if (res.success) {
        toast.success("Question deleted successfully");
        refetch();
      }
    } catch {
      toast.error("Failed to delete question");
    }
  };

  const questions  = response?.data       ?? [];
  const pagination = response?.pagination;

  return (
    <div className="text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Onboarding Questions</h1>
        <button
          onClick={() => navigate(ADMIN_UI_ROUTES.ONBOARDING_QUESTIONS_CREATE)}
          className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
        >
          <Plus size={18} />
          Add Question
        </button>
      </div>

      {/* Sort */}
      <div className="flex gap-3 mb-6">
        <SortDropdown<string>
          options={QUESTION_SORT_OPTIONS}
          value={sortConfig}
          onSortChange={handleSortChange}
          disabled={loading}
          className="w-60"
          placeholder="Sort by..."
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center text-purple-300 py-20">Loading...</div>
      ) : (
        <OnboardingQuestionList
          questions={questions}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onEdit={(q) => navigate(ADMIN_UI_ROUTES.ONBOARDING_QUESTIONS_EDIT(q.id))}
          onDelete={handleDeleteQuestion}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* Pagination */}
      {pagination && (
        <div className="mt-6">
          <Pagination
            currentPage={Number(pagination.currentPage)}
            totalPages={Number(pagination.totalPages)}
            totalItems={Number(pagination.totalItems)}
            itemsPerPage={Number(pagination.itemsPerPage)}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            disabled={loading}
          />
        </div>
      )}
    </div>
  );
};

export default AdminOnboardingQuestionsPage;
