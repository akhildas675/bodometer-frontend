import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import adminServices from "@/services/admin/admin.services";
import { OnboardingQuestion } from "@/interface/onboarding.interface";
import OnboardingQuestionList from "@/components/admin/onboarding-question.managment/onboarding-question.list";
import { ADMIN_UI_ROUTES } from "@/constants/constant-routes/ui-routes/admin.ui-constant-routes";

const AdminOnboardingQuestionsPage = () => {
  const [questions, setQuestions] = useState<OnboardingQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await adminServices.getOnboardingQuestions();
      if (response.success) setQuestions(response.data);
    } catch (error) {
      toast.error("Failed to fetch onboarding questions");
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    navigate(ADMIN_UI_ROUTES.ONBOARDING_QUESTIONS_CREATE);
  };

  const handleEditQuestion = (question: OnboardingQuestion) => {
    navigate(ADMIN_UI_ROUTES.ONBOARDING_QUESTIONS_EDIT(question.id));
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      const response = await adminServices.deleteOnboardingQuestion(id);
      if (response.success) {
        toast.success("Question deleted successfully");
        fetchQuestions();
      }
    } catch (error) {
      toast.error("Failed to delete question");
    }
  };

  return (
    <div className="text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Onboarding Questions</h1>
        <button
          onClick={handleAddQuestion}
          className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
        >
          <Plus size={18} />
          Add Question
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center text-purple-300 py-20">Loading...</div>
      ) : (
        <OnboardingQuestionList
          questions={questions}
          onEdit={handleEditQuestion}
          onDelete={handleDeleteQuestion}
        />
      )}
    </div>
  );
};

export default AdminOnboardingQuestionsPage;
