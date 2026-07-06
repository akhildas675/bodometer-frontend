import React, { useEffect, useState, useMemo } from 'react';
import { useOnboardingStore } from '@/stores/onboarding.store';
import { AnswerValue } from '@/constants/onboarding.constant';
import { Loader2, Save, ClipboardList, AlertTriangle, ShieldAlert, Info } from 'lucide-react';
import { DynamicFieldRenderer } from './dynamic.field.renderer';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { onboardingService } from '@/modules/onboarding/service/onboarding.service';
import ConfirmationModal from '@/ui.components/ui/confirm.dialog';
import { parseApiError } from '@/api/error.helper';

const UserFitnessProfile = () => {
  const navigate = useNavigate();
  const {
    groups,
    questions,
    answers,
    loading,
    submitting,
    loadOnboarding,
    loadUserAnswers,
    setAnswer,
    submitOnboarding,
    getVisibleQuestionsInFlowOrder,
  } = useOnboardingStore();

  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; mode: "welcome" | "save" }>({
    isOpen: false,
    mode: "welcome"
  });
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [originalAnswers, setOriginalAnswers] = useState<Record<string, AnswerValue> | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await onboardingService.getOnboardingStatus();
        if (!res.data?.completed) {
          navigate("/onboarding/intro");
        } else {
          setHasActivePlan(true);
        }
      } catch (err: unknown) {
        console.error("Failed to check onboarding status", err);
      }
    };
    checkStatus();
  }, [navigate]);

  useEffect(() => {
    const init = async () => {
      setIsInitializing(true);
      if (groups.length === 0) {
        await loadOnboarding();
      }
      await loadUserAnswers();

      const currentAnswers = useOnboardingStore.getState().answers;
      const initialMap = Object.keys(currentAnswers).reduce((acc, qId) => {
        acc[qId] = currentAnswers[qId]?.value;
        return acc;
      }, {} as Record<string, AnswerValue>);
      setOriginalAnswers(initialMap);

      setIsInitializing(false);
    };
    init();
  }, [groups.length, loadOnboarding, loadUserAnswers]);

  const updateOriginalAnswersSnapshot = () => {
    const currentMap = Object.keys(answers).reduce((acc, qId) => {
      acc[qId] = answers[qId]?.value;
      return acc;
    }, {} as Record<string, AnswerValue>);
    setOriginalAnswers(currentMap);
  };

  const isDirty = useMemo(() => {
    if (!originalAnswers) return false;

    return Object.keys(answers).some((qId) => {
      const currentVal = answers[qId]?.value;
      const originalVal = originalAnswers[qId];

      if (Array.isArray(currentVal) && Array.isArray(originalVal)) {
        if (currentVal.length !== originalVal.length) return true;
        const sortedCurrent = [...currentVal].sort();
        const sortedOriginal = [...originalVal].sort();
        return sortedCurrent.some((item, idx) => item !== sortedOriginal[idx]);
      }

      const normalizedCurrent = currentVal === undefined || currentVal === null ? "" : currentVal;
      const normalizedOriginal = originalVal === undefined || originalVal === null ? "" : originalVal;

      return normalizedCurrent !== normalizedOriginal;
    });
  }, [answers, originalAnswers]);

  const currentActiveGroupId = activeGroupId ?? (groups.length > 0 ? groups[0].groupId : null);

  const activeGroup = groups.find(g => g.groupId === currentActiveGroupId);
  
  const visibleQuestions = useMemo(
    () => (currentActiveGroupId ? getVisibleQuestionsInFlowOrder(currentActiveGroupId) : []),
    [currentActiveGroupId, groups, questions, answers, getVisibleQuestionsInFlowOrder]
  );

  // Group editing policy helper
  const getGroupEditingPolicy = (key: string, title: string) => {
    const normalizedKey = (key || "").toLowerCase();
    const normalizedTitle = (title || "").toLowerCase();

    if (normalizedKey.includes("bmi") || normalizedKey.includes("body") || normalizedTitle.includes("bmi") || normalizedTitle.includes("body metrics")) {
      return {
        groupName: "Body Metrics",
        editable: "Anytime",
        effect: "live recalculation",
        type: "live_recalc",
        warningMessage: "Recalculates your body metrics and BMI instantly inside your profile dashboard.",
        confirmText: "Save & Recalculate"
      };
    }
    if (normalizedKey.includes("lifestyle") || normalizedKey.includes("habit") || normalizedTitle.includes("lifestyle") || normalizedTitle.includes("habit")) {
      return {
        groupName: "Lifestyle",
        editable: "Anytime",
        effect: "adaptive analysis",
        type: "adaptive_analysis",
        warningMessage: "Updates your lifestyle profile and instantly updates daily adaptive analysis trackers.",
        confirmText: "Save & Analyze"
      };
    }
    if (normalizedKey.includes("goal") || normalizedKey.includes("fitness") || normalizedTitle.includes("goal") || normalizedTitle.includes("fitness goals")) {
      return {
        groupName: "Fitness Goals",
        editable: "Anytime with warning",
        effect: "optional regeneration",
        type: "program_regeneration",
        warningMessage: "Changing fitness goals is a major update. This will flag your active AI training plan for optional program regeneration.",
        confirmText: "Save & Flag Regeneration"
      };
    }
    if (normalizedKey.includes("preference") || normalizedKey.includes("workout") || normalizedKey.includes("exercise") || normalizedTitle.includes("preference") || normalizedTitle.includes("workout") || normalizedTitle.includes("exercise")) {
      return {
        groupName: "Workout Preferences",
        editable: "Anytime with warning",
        effect: "optional regeneration",
        type: "program_regeneration",
        warningMessage: "Changing training preferences updates program layout. This will flag your active AI plan for optional workout program regeneration.",
        confirmText: "Save & Flag Regeneration"
      };
    }
    if (normalizedKey.includes("medical") || normalizedKey.includes("safety") || normalizedKey.includes("health") || normalizedKey.includes("history") || normalizedTitle.includes("medical") || normalizedTitle.includes("safety") || normalizedTitle.includes("health") || normalizedTitle.includes("history")) {
      return {
        groupName: "Medical History",
        editable: "Anytime",
        effect: "immediate safety review",
        type: "safety_review",
        warningMessage: "Critical: Modifying medical or health history triggers an immediate system safety review of your active training profile.",
        confirmText: "Save & Run Safety Review"
      };
    }

    return {
      groupName: title || "General Details",
      editable: "Anytime",
      effect: "instant update",
      type: "live_recalc",
      warningMessage: "Modifying these details will update your profile.",
      confirmText: "Yes, Save Changes"
    };
  };

  const activePolicy = useMemo(() => {
    if (!activeGroup) return null;
    return getGroupEditingPolicy(activeGroup.key || "", activeGroup.title || "");
  }, [activeGroup]);

  const handleSave = async () => {
    if (hasActivePlan) {
      setModalConfig({ isOpen: true, mode: "save" });
    } else {
      await performSaveDirectly();
    }
  };

  const performSaveDirectly = async () => {
    try {
      const res = await submitOnboarding();
      toast.success(res?.message || "Assessment answers updated successfully!");
      updateOriginalAnswersSnapshot();
    } catch (err: unknown) {
      const apiError = parseApiError(err);
      toast.error(apiError.message);
    }
  };

  const confirmSave = async () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
    try {
      const res = await submitOnboarding();
      updateOriginalAnswersSnapshot();
      toast.success(res?.message || "Assessment answers updated successfully!");
    } catch (err: unknown) {
      const apiError = parseApiError(err);
      toast.error(apiError.message);
    }
  };

  if (loading || isInitializing) {
    return (
      <div className="min-h-screen bg-[#050017] text-white pt-24 pb-10 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
          <p className="text-slate-400 text-sm animate-pulse tracking-widest uppercase">Loading your history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto text-white">
      <div className="flex flex-1 gap-8">
        
        {/* Sidebar */}
        <aside className="w-72 shrink-0">
          <div className="bg-linear-to-br from-[#140b3a] to-[#0a0624] rounded-3xl p-6 shadow-xl sticky top-28 border border-white/5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-6 px-2">Assessment Categories</h2>
            <nav className="space-y-2">
              {groups.map((group) => (
                <button
                  key={group.groupId}
                  onClick={() => setActiveGroupId(group.groupId)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                    currentActiveGroupId === group.groupId
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {group.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {activeGroup ? (
            <div className="bg-linear-to-br from-[#140b3a] to-[#0a0624] rounded-3xl p-8 sm:p-12 shadow-xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
              
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/10 relative z-10">
                <div>
                  <h1 className="text-3xl font-extrabold text-white tracking-wide uppercase">
                    {activeGroup.title}
                  </h1>
                  <p className="text-slate-400 text-sm mt-2">Review and update your past answers.</p>
                </div>
                <button
                  onClick={handleSave}
                  disabled={submitting || !isDirty}
                  className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg hover:bg-purple-500 transition disabled:opacity-50 disabled:cursor-not-allowed border border-purple-400/50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
              </div>

              <div className="space-y-12 relative z-10">
                {visibleQuestions.length > 0 ? (
                  visibleQuestions.map((item, index) => {
                    const currentVal = answers[item.questionId]?.value;
                    return (
                      <div
                        key={item.questionId}
                        className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex flex-col gap-1 mb-4">
                          <div className="flex items-start gap-2">
                            <h3 className="text-lg font-bold text-white leading-snug flex-1">
                              {item.question}
                              {item.validation?.required && (
                                <span className="text-purple-400 ml-1.5 text-sm" title="Required field">*</span>
                              )}
                            </h3>
                          </div>
                          {item.description && (
                            <p className="text-slate-400 text-sm font-medium tracking-wide">
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
                  })
                ) : (
                  <p className="text-slate-500 italic">No questions visible in this category.</p>
                )}
              </div>
              
              {/* Bottom Save Button (for long sections) */}
              {visibleQuestions.length > 3 && (
                <div className="mt-12 pt-8 border-t border-white/10 flex justify-end relative z-10">
                  <button
                    onClick={handleSave}
                    disabled={submitting || !isDirty}
                    className="flex items-center gap-2 bg-purple-600 text-white px-8 py-3 rounded-full font-bold text-sm shadow-lg hover:bg-purple-500 transition disabled:opacity-50 disabled:cursor-not-allowed border border-purple-400/50"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {submitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-linear-to-br from-[#140b3a] to-[#0a0624] rounded-3xl border border-white/5">
              <p className="text-slate-400 tracking-wide">Select a category from the sidebar to view your answers.</p>
            </div>
          )}
        </main>
      </div>

      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={modalConfig.mode === "welcome" ? () => {} : confirmSave}
        title={modalConfig.mode === "welcome" ? "Profile Editing Rules" : "Edit Confirmation"}
        variant={modalConfig.mode === "welcome" ? "purple" : activePolicy?.type === "safety_review" ? "danger" : "purple"}
        size={modalConfig.mode === "welcome" ? "2xl" : "lg"}
        hideCancel={modalConfig.mode === "welcome"}
        confirmText={modalConfig.mode === "welcome" ? "I Understand & Agree" : activePolicy?.confirmText}
        cancelText="Cancel"
        icon={
          modalConfig.mode === "welcome" ? (
            <ClipboardList className="w-6 h-6 text-purple-400" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-amber-500" />
          )
        }
        message={
          <div>
            {modalConfig.mode === "welcome" ? (
              <p className="text-slate-300 mb-6 text-sm leading-relaxed font-medium">
                Your profile is synced with your **active AI health and fitness plans**. Modifying specific groups will affect your program immediately or flag it for regeneration:
              </p>
            ) : (
              <p className="text-slate-300 mb-6 text-sm leading-relaxed font-medium">
                An active AI plan exists. Your changes will trigger segment-specific updates to your personalized program.
              </p>
            )}

            {/* Premium Reusable Interactive Policy Grid Table */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-6 shadow-inner text-xs">
              <div className="grid grid-cols-3 bg-white/5 border-b border-white/10 px-5 py-3.5 font-black uppercase tracking-wider text-purple-300">
                <span>{modalConfig.mode === "welcome" ? "Category Group" : "Section Group"}</span>
                <span>{modalConfig.mode === "welcome" ? "Editable Rule" : "Edit Policy"}</span>
                <span>System Impact</span>
              </div>
              
              {modalConfig.mode === "welcome" ? (
                <div className="divide-y divide-white/5 font-semibold text-slate-300">
                  {/* Body Metrics */}
                  <div className="grid grid-cols-3 items-center px-5 py-3">
                    <span className="text-white font-bold">Body Metrics</span>
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                        <span className="w-1 h-1 rounded-full bg-emerald-400" />
                        Anytime
                      </span>
                    </div>
                    <span className="text-teal-400 capitalize">live recalculation</span>
                  </div>

                  {/* Lifestyle */}
                  <div className="grid grid-cols-3 items-center px-5 py-3">
                    <span className="text-white font-bold">Lifestyle</span>
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                        <span className="w-1 h-1 rounded-full bg-emerald-400" />
                        Anytime
                      </span>
                    </div>
                    <span className="text-teal-400 capitalize">adaptive analysis</span>
                  </div>

                  {/* Fitness Goals */}
                  <div className="grid grid-cols-3 items-center px-5 py-3">
                    <span className="text-white font-bold">Fitness Goals</span>
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border bg-amber-500/15 text-amber-400 border-amber-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        Anytime with warning
                      </span>
                    </div>
                    <span className="text-rose-400 capitalize">optional regeneration</span>
                  </div>

                  {/* Workout Preferences */}
                  <div className="grid grid-cols-3 items-center px-5 py-3">
                    <span className="text-white font-bold">Workout Preferences</span>
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border bg-amber-500/15 text-amber-400 border-amber-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        Anytime with warning
                      </span>
                    </div>
                    <span className="text-rose-400 capitalize">optional regeneration</span>
                  </div>

                  {/* Medical History */}
                  <div className="grid grid-cols-3 items-center px-5 py-3">
                    <span className="text-white font-bold">Medical History</span>
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                        <span className="w-1 h-1 rounded-full bg-emerald-400" />
                        Anytime
                      </span>
                    </div>
                    <span className="text-red-400 capitalize">immediate safety review</span>
                  </div>
                </div>
              ) : (
                activePolicy && (
                  <div className="grid grid-cols-3 items-center px-5 py-4 font-bold gap-2">
                    <span className="text-white tracking-wide text-[13px]">{activePolicy.groupName}</span>
                    <div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                        activePolicy.editable.includes("warning")
                          ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                          : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          activePolicy.editable.includes("warning") ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
                        }`} />
                        {activePolicy.editable}
                      </span>
                    </div>
                    <div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                        activePolicy.type === "program_regeneration"
                          ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                          : activePolicy.type === "safety_review"
                          ? "bg-red-600/15 text-red-400 border-red-500/30"
                          : "bg-teal-500/15 text-teal-400 border-teal-500/30"
                      }`}>
                        {activePolicy.effect}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>

            {modalConfig.mode === "save" && activePolicy && (
              <div className={`border rounded-2xl p-4 ${
                activePolicy.type === "program_regeneration"
                  ? "bg-amber-500/5 border-amber-500/20 text-amber-200"
                  : activePolicy.type === "safety_review"
                  ? "bg-rose-500/5 border-rose-500/20 text-rose-200 animate-pulse"
                  : "bg-purple-950/40 border-purple-500/20 text-purple-200"
              }`}>
                <p className="text-xs font-semibold leading-relaxed flex gap-2 items-start text-left">
                  {activePolicy.type === "program_regeneration" ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : activePolicy.type === "safety_review" ? (
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
                  ) : (
                    <Info className="w-4 h-4 text-purple-400 shrink-0" />
                  )}
                  <span className="flex-1">
                    {activePolicy.warningMessage}
                  </span>
                </p>
              </div>
            )}
          </div>
        }
      />
    </div>
  );
};

export default UserFitnessProfile;
