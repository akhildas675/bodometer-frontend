import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import adminServices from "@/services/admin/admin.services";
import { OnboardingQuestion, OnboardingQuestionFormData } from "@/interface/onboarding.interface";
import OnboardingQuestionForm from "@/components/admin/onboarding-question.managment/onboarding-question.form";
import { ADMIN_UI_ROUTES } from "@/constants/constant-routes/ui-routes/admin.ui-constant-routes";

const AdminOnboardingQuestionFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isCreating = !id;

  const [question, setQuestion] = useState<OnboardingQuestion | undefined>(undefined);
  const [sections, setSections] = useState<{ key: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const sResponse = await adminServices.getOnboardingSections();
      if (sResponse.success) setSections(sResponse.data);

      if (id) {
        const qResponse = await adminServices.getOnboardingQuestions();
        if (qResponse.success) {
          const found = qResponse.data.find(q => q.id === id);
          if (found) setQuestion(found);
          else {
             toast.error("Question not found");
             navigate(ADMIN_UI_ROUTES.ONBOARDING_QUESTIONS);
          }
        }
      }
    } catch {
      toast.error("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: OnboardingQuestionFormData) => {
    console.log("Onboarding Question Form Data (Debug):", data);
    try {
      if (isCreating) {
        const response = await adminServices.createOnboardingQuestion(data);
        if (response.success) {
          toast.success("Onboarding question created successfully");
          navigate(ADMIN_UI_ROUTES.ONBOARDING_QUESTIONS);
        }
      } else {
        const response = await adminServices.updateOnboardingQuestion(id!, data);
        if (response.success) {
          toast.success("Onboarding question updated successfully");
          navigate(ADMIN_UI_ROUTES.ONBOARDING_QUESTIONS);
        }
      }
    } catch  {
      toast.error("Failed to save onboarding question");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom duration-500 p-6 md:p-10">
      <OnboardingQuestionForm
        isCreating={isCreating}
        initialData={question}
        sections={sections}
        onSubmit={handleSubmit}
        onBack={() => navigate(ADMIN_UI_ROUTES.ONBOARDING_QUESTIONS)}
      />
    </div>
  );
};

export default AdminOnboardingQuestionFormPage;
