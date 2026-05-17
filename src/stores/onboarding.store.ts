import { create } from "zustand";
import userServices from "@/services/user/user.services";
import { AnswerValue, QuestionType } from "@/constants/onboarding.constant";



export interface OnboardingOption {
    label: string;
    value: string | number | boolean;
}

export interface OnboardingQuestion {
    questionId: string;
    key: string;
    question: string;
    description?: string;
    groupId: string;
    order: number;
    type: QuestionType;
    options?: OnboardingOption[];
    dataSource?: string;
    next?: {
        condition: {
            operator: string;
            value?: AnswerValue;
        };
        nextQuestionId: string;
    }[];
    numberConfig?: {
        min?: number;
        max?: number;
        step?: number;
        unit?: string;
    };
    validation?: {
        required?: boolean;
    };
    isActive?: boolean;
}

export interface OnboardingGroup {
    groupId: string;
    key: string;
    title: string;
    order: number;
    isActive?: boolean;
}


export interface OnboardingAnswer {
    questionId: string;
    key: string;
    value: AnswerValue;
}

interface OnboardingStore {

    groups: OnboardingGroup[];
    questions: OnboardingQuestion[];
    answers: Record<string, OnboardingAnswer>;

    // for navigation to group page 
    currentGroupIndex: number;

    // states for ui
    loading: boolean;
    submitting: boolean;
    error: string | null;
    isComplete: boolean;

    // actions
    loadOnboarding: () => Promise<void>;
    loadUserAnswers: () => Promise<void>;
    setAnswer: (questionId: string, key: string, value: AnswerValue) => void;
    nextGroup: () => void;
    prevGroup: () => void;
    submitOnboarding: () => Promise<void>;
    reset: () => void;

    // helping functions
    getCurrentGroup: () => OnboardingGroup | null;
    getGroupQuestions: (groupId: string) => OnboardingQuestion[];
    getTotalGroups: () => number;
    getProgress: () => number;
    isQuestionVisible: (question: OnboardingQuestion) => boolean;
    getVisibleQuestionsInFlowOrder: (groupId: string) => OnboardingQuestion[];
}

const initialState = {
    groups: [],
    questions: [],
    answers: {},
    currentGroupIndex: 0,
    loading: false,
    submitting: false,
    error: null,
    isComplete: false,
};

export const useOnboardingStore = create<OnboardingStore>((set, get) => ({
    ...initialState,

    loadOnboarding: async () => {
        set({ loading: true, error: null });
        try {
            const [groupsRes, questionsRes] = await Promise.all([
                userServices.getOnboardingGroups(),
                userServices.getOnboardingQuestions(),
            ]);

            const groups: OnboardingGroup[] = (groupsRes.data ?? [])
                .filter((g: OnboardingGroup) => g.isActive !== false)
                .sort((a: OnboardingGroup, b: OnboardingGroup) => a.order - b.order);

            const questions: OnboardingQuestion[] = (questionsRes.data ?? [])
                .filter((q: OnboardingQuestion) => q.isActive !== false)
                .sort((a: OnboardingQuestion, b: OnboardingQuestion) => a.order - b.order);

            set({ groups, questions, loading: false });
        } catch {
            set({ error: "Failed to load onboarding questions", loading: false });
        }
    },

    loadUserAnswers: async () => {
        try {
            const res = await userServices.getOnboardingAnswers();
            if (res?.data?.answers) {
                const answerMap: Record<string, OnboardingAnswer> = {};
                res.data.answers.forEach((ans: { questionId: string; questionKey?: string; key?: string; answer?: AnswerValue; value?: AnswerValue }) => {
                    answerMap[ans.questionId] = {
                        questionId: ans.questionId,
                        key: ans.questionKey || ans.key || "",
                        value: ans.answer !== undefined ? ans.answer : (ans.value !== undefined ? ans.value : "")
                    };
                });
                set((state) => ({ answers: { ...state.answers, ...answerMap } }));
            }
        } catch (err) {
            console.error("Failed to load user answers", err);
        }
    },

    setAnswer: (questionId, key, value) => {
        set((state) => ({
            answers: {
                ...state.answers,
                [questionId]: { questionId, key, value },
            },
        }));
    },

    nextGroup: () => {
        const state = get();
        const isLastGroup = state.currentGroupIndex >= state.groups.length - 1;

        if (isLastGroup) {
            set({ isComplete: true });
        } else {
            set({ currentGroupIndex: state.currentGroupIndex + 1 });
        }
    },

    prevGroup: () => {
        const state = get();
        if (state.currentGroupIndex > 0) {
            set({ currentGroupIndex: state.currentGroupIndex - 1 });
        }
    },

    submitOnboarding: async () => {
        const state = get();
        set({ submitting: true, error: null });
        try {
            // send active questions answers
            const payload = Object.values(state.answers)
                .filter((ans) => {
                    const q = state.questions.find((x) => x.questionId === ans.questionId);
                    return q ? state.isQuestionVisible(q) : true;
                })
                .map((ans) => ({
                    questionId: ans.questionId,
                    key: ans.key,
                    value: ans.value,
                }));

            await userServices.submitOnboarding({ answers: payload });
            set({ submitting: false, isComplete: true });
        } catch {
            set({ error: "Failed to submit onboarding", submitting: false });
        }
    },

    reset: () => set(initialState),

    getCurrentGroup: () => {
        const { groups, currentGroupIndex } = get();
        return groups[currentGroupIndex] ?? null;
    },

    getGroupQuestions: (groupId: string) => {
        const { questions } = get();
        return questions
            .filter((q) => q.groupId === groupId)
            .sort((a, b) => a.order - b.order);
    },

    getTotalGroups: () => get().groups.length,

    getProgress: () => {
        const { groups, currentGroupIndex } = get();
        if (!groups.length) return 0;
        return Math.round((currentGroupIndex / groups.length) * 100);
    },

    isQuestionVisible: (q: OnboardingQuestion) => {
        const { questions, answers } = get();

        const checkVisibility = (target: OnboardingQuestion, visited: Set<string>): boolean => {
            if (visited.has(target.questionId)) {
                return false;
            }
            visited.add(target.questionId);

            // 1. Scan for all rule sets across all questions that point to this target question
            const parentsWithRules = questions.filter((p) =>
                p.next?.some((rule) => rule.nextQuestionId === target.questionId)
            ).flatMap((parent) =>
                parent.next!
                    .filter((r) => r.nextQuestionId === target.questionId)
                    .map((r) => ({ parent, rule: r }))
            );

            // 2. If no other question defines a rule pointing to this target, it is a default root question -> Visible!
            if (parentsWithRules.length === 0) {
                visited.delete(target.questionId);
                return true;
            }

            // 3. If rules exist, evaluate if at least one rule condition is currently met
            const result = parentsWithRules.some(({ parent, rule }) => {
                // The parent question must itself be visible recursively
                if (!checkVisibility(parent, visited)) {
                    return false;
                }

                const parentAns = answers[parent.questionId]?.value;
                if (parentAns === undefined || parentAns === null) {
                    return false;
                }

                const { operator, value } = rule.condition;
                if (operator === "always") {
                    return true;
                }

                const valStr = String(value);
                if (operator === "equals") {
                    return String(parentAns) === valStr;
                }
                if (operator === "includes") {
                    if (Array.isArray(parentAns)) {
                        return parentAns.map(String).includes(valStr);
                    }
                    return String(parentAns).includes(valStr);
                }
                return false;
            });

            visited.delete(target.questionId);
            return result;
        };

        return checkVisibility(q, new Set<string>());
    },

    getVisibleQuestionsInFlowOrder: (groupId: string) => {
        const state = get();
        const groupQuestions = state.questions.filter((q) => q.groupId === groupId);
        const visibleQuestions = groupQuestions.filter((q) => state.isQuestionVisible(q));

        const childrenMap = new Map<string, OnboardingQuestion[]>();
        const rootQuestions: OnboardingQuestion[] = [];

        visibleQuestions.forEach(q => {
            const parentsWithRules = visibleQuestions.filter((p) =>
                p.next?.some((rule) => rule.nextQuestionId === q.questionId)
            );


            const activeParent = parentsWithRules.find(p => {
                return p.next!.some(rule => {
                    if (rule.nextQuestionId !== q.questionId) return false;
                    const parentAns = state.answers[p.questionId]?.value;
                    if (parentAns === undefined || parentAns === null) return false;

                    const { operator, value } = rule.condition;
                    if (operator === "always") return true;

                    const valStr = String(value);
                    if (operator === "equals") return String(parentAns) === valStr;
                    if (operator === "includes") {
                        if (Array.isArray(parentAns)) return parentAns.map(String).includes(valStr);
                        return String(parentAns).includes(valStr);
                    }
                    return false;
                });
            });

            if (activeParent) {
                if (!childrenMap.has(activeParent.questionId)) {
                    childrenMap.set(activeParent.questionId, []);
                }
                childrenMap.get(activeParent.questionId)!.push(q);
            } else {
                rootQuestions.push(q);
            }
        });


        rootQuestions.sort((a, b) => a.order - b.order);

        const ordered: OnboardingQuestion[] = [];


        const traverse = (q: OnboardingQuestion) => {
            ordered.push(q);
            const children = childrenMap.get(q.questionId) || [];
            children.sort((a, b) => a.order - b.order);
            children.forEach(child => traverse(child));
        };

        rootQuestions.forEach(q => traverse(q));

        return ordered;
    },
}));