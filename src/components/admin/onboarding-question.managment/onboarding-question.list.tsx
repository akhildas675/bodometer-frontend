import React from "react";
import { OnboardingQuestion } from "@/interface/onboarding.interface";
import DataTable from "@/components/ui/table/data.table";
import type { TableColumn, TableAction } from "@/components/ui/table/table.types";

interface OnboardingQuestionListProps {
  questions:    OnboardingQuestion[];
  currentPage:  number;
  itemsPerPage: number;
  onEdit:       (question: OnboardingQuestion) => void;
  onDelete:     (id: string) => void;
  onToggleStatus?: (question: OnboardingQuestion) => void;
}

const OnboardingQuestionList: React.FC<OnboardingQuestionListProps> = ({
  questions,
  currentPage,
  itemsPerPage,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const columns: TableColumn<OnboardingQuestion>[] = [
    {
      key: "id",
      label: "#",
      render: (_, index) => (
        <span>{(currentPage - 1) * itemsPerPage + index + 1}</span>
      ),
    },
    {
      key: "question",
      label: "Question Text",
      render: (q) => (
        <span className="font-medium max-w-md truncate block">{q.question}</span>
      ),
    },
    {
      key: "section",
      label: "Section",
      render: (q) => (
        <span className="capitalize">{q.section.replace(/_/g, " ")}</span>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (q) => (
        <span className="capitalize">{q.type.replace(/_/g, " ")}</span>
      ),
    },
    {
      key: "schemaKey",
      label: "Schema Key",
      render: (q) => (
        <span className="text-gray-400 font-mono text-xs">{q.schemaKey ?? "N/A"}</span>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (q) => (
        <span
          className={`text-xs font-medium px-2 py-1 rounded ${
            q.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          }`}
        >
          {q.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (q) => (
        <span className="text-xs text-slate-400">
          {q.createdAt ? new Date(q.createdAt).toLocaleDateString() : "—"}
        </span>
      ),
    },
  ];

  const actions: TableAction<OnboardingQuestion>[] = [
    {
      label: "Edit",
      variant: "primary",
      onClick: onEdit,
    },
    {
      label: "Unblock",
      variant: "primary",
      onClick: (q) => onToggleStatus && onToggleStatus(q),
      visible: (q) => !!onToggleStatus && !q.isActive,
    },
    {
      label: "Block",
      variant: "danger",
      onClick: (q) => onToggleStatus && onToggleStatus(q),
      visible: (q) => !!onToggleStatus && q.isActive,
    },
    {
      label: "Delete",
      variant: "danger",
      onClick: (q) => onDelete(q.id),
      disabled: (q) => q.isCoreLocked,
    },
  ];

  if (questions.length === 0) {
    return (
      <div className="bg-white/5 rounded-xl border border-white/10 p-10 text-center text-purple-300">
        No onboarding questions found.
      </div>
    );
  }

  return <DataTable columns={columns} data={questions} actions={actions} />;
};

export default OnboardingQuestionList;
