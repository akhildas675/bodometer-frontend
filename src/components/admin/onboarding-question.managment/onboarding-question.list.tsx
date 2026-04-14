import React from "react";
import { Pencil } from "lucide-react";
import { OnboardingQuestion } from "@/interface/onboarding.interface";

interface OnboardingQuestionListProps {
  questions: OnboardingQuestion[];
  onEdit: (question: OnboardingQuestion) => void;
  onDelete: (id: string) => void;
}

const OnboardingQuestionList: React.FC<OnboardingQuestionListProps> = ({
  questions,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-white/5 text-left">
          <tr>
            <th className="px-4 py-3 text-slate-400 font-medium w-16">#</th>
            <th className="px-4 py-3 text-slate-400 font-medium">Question Text</th>
            <th className="px-4 py-3 text-slate-400 font-medium">Type</th>
            <th className="px-4 py-3 text-slate-400 font-medium">Status</th>
            <th className="px-4 py-3 text-slate-400 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {questions.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-10 text-center text-purple-300">
                No onboarding questions found.
              </td>
            </tr>
          ) : (
            questions.map((question, index) => (
              <tr key={question.id} className="hover:bg-white/5 transition">
                <td className="px-4 py-3 text-slate-400">{index + 1}</td>
                <td className="px-4 py-3 text-white font-medium max-w-md">
                  <p className="truncate">{question.question}</p>
                </td>
                <td className="px-4 py-3 text-slate-400 capitalize">
                  {question.type.replace("_", " ")}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-medium ${
                      question.isActive ? "text-green-400" : "text-red-400"
                    }`}
                  >
                     {question.isActive ? "● Active" : "● Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(question)}
                      className="p-2 bg-indigo-700/50 hover:bg-indigo-600 text-purple-300 hover:text-white rounded-lg transition"
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(question.id)}
                      className="px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OnboardingQuestionList;
