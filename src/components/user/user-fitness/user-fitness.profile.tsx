import React, { useEffect, useState, useMemo } from 'react';
import { useOnboardingStore } from '@/stores/onboarding.store';
import { Loader2, Save } from 'lucide-react';
import { DynamicFieldRenderer } from './dynamic.field.renderer';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import userServices from '@/services/user/user.services';

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
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await userServices.getOnboardingStatus();
        if (!res.data?.completed) {
          navigate("/onboarding/intro");
        }
      } catch (err) {
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
      setIsInitializing(false);
    };
    init();
  }, [groups.length, loadOnboarding, loadUserAnswers]);

  const currentActiveGroupId = activeGroupId ?? (groups.length > 0 ? groups[0].groupId : null);

  const activeGroup = groups.find(g => g.groupId === currentActiveGroupId);
  
  const visibleQuestions = useMemo(
    () => (currentActiveGroupId ? getVisibleQuestionsInFlowOrder(currentActiveGroupId) : []),
    [currentActiveGroupId, groups, questions, answers, getVisibleQuestionsInFlowOrder]
  );

  const handleSave = async () => {
    const unmetRequired = visibleQuestions.some((q) => {
      if (!q.validation?.required) return false;
      const val = answers[q.questionId]?.value;
      if (val === undefined || val === null) return true;
      if (typeof val === "string" && !val.trim()) return true;
      if (Array.isArray(val) && val.length === 0) return true;
      return false;
    });

    if (unmetRequired) {
      toast.error("Please answer all required questions in this section.", {
        style: { background: "#7e22ce", color: "#fff" },
      });
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmSave = async () => {
    setShowConfirmModal(false);
    try {
      await submitOnboarding();
      toast.success("Assessment answers updated successfully!");
    } catch {
      toast.error("Failed to update answers.");
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
                  disabled={submitting}
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
                    disabled={submitting}
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

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-linear-to-br from-[#140b3a] to-[#0a0624] border border-white/10 p-8 rounded-3xl max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-purple-400">⚠️</span> Are you sure?
            </h3>
            <p className="text-slate-300 mb-8 text-sm leading-relaxed font-medium">
              Modifying these details will impact how your health and fitness plan is generated. Please ensure all updated answers are accurate before saving.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 rounded-full font-bold text-sm bg-white/5 text-white hover:bg-white/10 border border-white/10 transition"
              >
                Wait, let me check
              </button>
              <button
                onClick={confirmSave}
                className="flex-1 py-3 rounded-full font-bold text-sm bg-purple-600 text-white hover:bg-purple-500 transition shadow-lg shadow-purple-600/20"
              >
                Yes, save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFitnessProfile;
