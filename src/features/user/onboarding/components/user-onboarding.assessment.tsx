import { CheckCircle, ChevronLeft, ChevronRight, Loader2, AlertTriangle } from 'lucide-react';
import React, { useEffect, useMemo } from 'react';
import { DynamicFieldRenderer } from './dynamic.field.renderer';
import { toast } from 'sonner';
import { useOnboardingStore } from '@/stores/onboarding.store';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '@/components/ui/confirm.dialog';
import { parseApiError } from '@/api/error.helper';
import { USER_UI_ROUTES } from '@/constants/constant-routes/ui-routes/user.ui-constant.routes';

const UserOnboardingAssessment = () => {
   const navigate = useNavigate();
   const [showConfirmModal, setShowConfirmModal] = React.useState(false);
 
  const {
    groups,
    questions,
    answers,
    currentGroupIndex,
    loading,
    submitting,
    error,
    isComplete,
    loadOnboarding,
    setAnswer,
    nextGroup,
    prevGroup,
    submitOnboarding,
    getCurrentGroup,
    getVisibleQuestionsInFlowOrder,
  } = useOnboardingStore();
 
  
  useEffect(() => {
    if (groups.length === 0) loadOnboarding();
  }, [groups.length, loadOnboarding]);
 
  // completion
  useEffect(() => {
    if (isComplete) {
      navigate(USER_UI_ROUTES.USER_WORKOUT_PLANS);
    }
  }, [isComplete, navigate]);
 
  const activeGroup = getCurrentGroup();
  const visibleQuestions = useMemo(
    () => (activeGroup ? getVisibleQuestionsInFlowOrder(activeGroup.groupId) : []),
    [activeGroup, groups, questions, answers, getVisibleQuestionsInFlowOrder]
  );
  
  // handler
  const handleBack = () => {
    if (currentGroupIndex === 0) navigate("/onboarding/intro");
    else prevGroup();
  };
 
  const handleNext = async () => {
    if (!activeGroup) return;

    for (const q of visibleQuestions) {
      const ans = answers[q.questionId]?.value;

      if (
        q.validation?.required &&
        (ans === undefined ||
          ans === null ||
          ans === "" ||
          (Array.isArray(ans) && ans.length === 0))
      ) {
        toast.error(`"${q.question}" is required.`);
        return;
      }

      if (q.type === "date" && ans) {
        const dob = new Date(ans as string);
        const today = new Date();
        const limitDate = new Date(
          today.getFullYear() - 18,
          today.getMonth(),
          today.getDate()
        );
        if (dob > limitDate) {
          toast.error("You must be at least 18 years old to proceed.");
          return;
        }
      }
    }

    setShowConfirmModal(true);
  };

  const confirmNext = async () => {
    setShowConfirmModal(false);
    const isLast = currentGroupIndex === groups.length - 1;
    if (isLast) {
      try {
        const res = await submitOnboarding();
        toast.success(res?.message || "Onboarding complete! Setting up your portal.");
      } catch (err: unknown) {
        const apiError = parseApiError(err);
        toast.error(apiError.message);
      }
    } else {
      nextGroup();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
 
  // state loading
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#03000D] to-[#190473] flex flex-col gap-4 items-center justify-center">
        <Loader2 className="h-12 w-12 text-purple-500 animate-spin" />
        <p className="text-white/50 text-sm tracking-wider uppercase animate-pulse">
          Building your assessment...
        </p>
      </div>
    );
  }
 
  // error
  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#03000D] to-[#190473] flex flex-col gap-4 items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full border-2 border-red-500/50 flex items-center justify-center mb-2">
          <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />
        </div>
        <h2 className="text-white font-bold text-xl">Connection Interrupted</h2>
        <p className="text-red-300 text-sm max-w-md">{error}</p>
        <button
          onClick={() => loadOnboarding()}
          className="mt-4 bg-purple-600 text-white px-8 py-2.5 rounded-full font-bold shadow-lg shadow-purple-600/20 hover:bg-purple-500 transition"
        >
          Try Again
        </button>
      </div>
    );
  }
 
  if (!activeGroup) return null;
 
  const isLastGroup = currentGroupIndex === groups.length - 1;
  const progress = groups.length
    ? Math.round((currentGroupIndex / groups.length) * 100)
    : 0;
 
  return (
    <div className="min-h-screen bg-linear-to-b from-[#03000D] to-[#190473] flex flex-col items-center p-6 sm:p-10">
      {/*  Header */}
      <div className="w-full max-w-4xl mb-8 flex items-center justify-between">
        <img
          src="https://bodometer-assets.s3.eu-north-1.amazonaws.com/Bodometer+Logo+corrected+1.png"
          alt="Bodometer"
          className="h-10 object-contain opacity-90"
        />
        <div className="flex items-center gap-4">
          <span className="text-purple-300 text-xs tracking-[0.2em] font-bold uppercase hidden sm:inline">
            Step {currentGroupIndex + 1} of {groups.length}
          </span>
          <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden hidden sm:block">
            <div
              className="h-full bg-purple-500 transition-all duration-500 rounded-full"
              style={{ width: `${progress || 5}%` }}
            />
          </div>
        </div>
      </div>
 
      {/*  Card */}
      <div className="w-full max-w-4xl bg-linear-to-b from-[#03000D]/80 to-[#190473]/40 border border-white/10 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl backdrop-blur-xl">
        {/* Ambient blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />
 
        <div className="relative z-10">
          {/*  Group title */}
          <div className="mb-10 border-b border-white/10 pb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-[10px] tracking-[0.2em] uppercase font-bold rounded-full border border-purple-500/30">
                Category
              </span>
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-wide uppercase">
              {activeGroup.title}
            </h1>
          </div>
 
          {/*  Questions */}
          <div className="space-y-10 mb-12">
            {visibleQuestions.map((item, index) => {
              const currentVal = answers[item.questionId]?.value;
              return (
                <div
                  key={item.questionId}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <div className="flex flex-col gap-1 mb-3">
                    <div className="flex items-start gap-2">
                      <h3 className="text-lg sm:text-xl font-bold text-white leading-snug flex-1">
                        {item.question}
                        {item.validation?.required && (
                          <span
                            className="text-purple-400 ml-1.5 text-sm"
                            title="Required field"
                          >
                            *
                          </span>
                        )}
                      </h3>
                    </div>
                    {item.description && (
                      <p className="text-white/40 text-sm font-medium tracking-wide">
                        {item.description}
                      </p>
                    )}
                  </div>
 
                  <DynamicFieldRenderer
                    question={item}
                    answer={currentVal}
                    onChange={(v) => setAnswer(item.questionId, item.key, v)}
                  />
                </div>
              );
            })}
          </div>
 
          {/*  Navigation footer */}
          <div className="flex items-center justify-between pt-8 border-t border-white/10 gap-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-white/50 hover:text-white font-bold uppercase tracking-widest text-xs transition-colors cursor-pointer bg-transparent py-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
 
            {/* Dot progress */}
            <div className="hidden sm:flex items-center gap-2">
              {groups.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentGroupIndex
                      ? "w-6 bg-purple-500"
                      : idx < currentGroupIndex
                      ? "w-2 bg-purple-500/50"
                      : "w-2 bg-white/20"
                  }`}
                />
              ))}
            </div>
 
            <button
              onClick={handleNext}
              disabled={submitting}
              className={`flex items-center gap-2 px-10 py-3.5 rounded-full font-bold uppercase tracking-widest text-sm shadow-lg cursor-pointer scale-100 active:scale-95 transition-all border-2 ${
                submitting
                  ? "border-white/20 text-white/30 cursor-not-allowed bg-transparent"
                  : "border-white text-white hover:bg-white hover:text-[#03000D]"
              }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : isLastGroup ? (
                <>
                  Finish Assessment
                  <CheckCircle className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmNext}
        title="Are you sure?"
        message="These details are critical for designing a safe and effective health and fitness plan tailored specifically to your body. Please ensure all answers are accurate before proceeding."
        confirmText="Yes, I'm sure"
        cancelText="Wait, let me check"
        variant="purple"
        icon={<AlertTriangle className="w-6 h-6 text-purple-400" />}
      />
    </div>
  );
}

export default UserOnboardingAssessment;
