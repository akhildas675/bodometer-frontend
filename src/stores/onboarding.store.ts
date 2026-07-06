import { create } from "zustand";
import { userService } from "@/modules/user/service/user.service";
import { onboardingService } from "@/modules/onboarding/service/onboarding.service";
import { AnswerValue, QuestionType, CONDITION_OPERATOR, ConditionOperator } from "@/constants/onboarding.constant";
import { parseApiError } from "@/api/error.helper";
import { CategoryListItem } from "@/modules/category/types/category.interface";
import { categoryService } from "@/modules/category/service/category.service";
import { OnboardingAnswerItem } from "@/modules/onboarding/types/onboarding.interface";
import { equipmentService } from "@/modules/equipment/service/equipment.service";
import type { UpdateEquipment } from "@/interface/equipment.interface";
import { useAuthStore } from "@/stores/auth.store";
import type { ApiResponse } from "@/interface/api-response.interface";

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
            operator: ConditionOperator | string;
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
    submitOnboarding: () => Promise<ApiResponse<unknown>>;
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

const generateOptionValue = (text: string): string => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s]/g, "")
        .replace(/[\s-]+/g, "_");
};

export const useOnboardingStore = create<OnboardingStore>((set, get) => ({
    ...initialState,

    loadOnboarding: async () => {
        set({ loading: true, error: null });
        try {
            const [groupsRes, questionsRes] = await Promise.all([
                onboardingService.getOnboardingGroups(),
                onboardingService.getOnboardingQuestions(),
            ]);

            const groups: OnboardingGroup[] = (groupsRes.data ?? [])
                .filter((g: OnboardingGroup) => g.isActive !== false)
                .sort((a: OnboardingGroup, b: OnboardingGroup) => a.order - b.order);

            let questions: OnboardingQuestion[] = (questionsRes.data ?? [])
                .filter((q: OnboardingQuestion) => q.isActive !== false)
                .sort((a: OnboardingQuestion, b: OnboardingQuestion) => a.order - b.order);

            // Strongly typed fetcher map
            type FetchFunction = () => Promise<OnboardingOption[]>;
            const dataSourceFetchers: Record<string, FetchFunction> = {
                category: async () => {
                    const res = await categoryService.getCategories({ page: 1, limit: 1000 });
                    return (res.data ?? [])
                        .filter((cat: CategoryListItem) => cat.isActive !== false)
                        .map((cat: CategoryListItem) => ({
                            label: cat.name,
                            value: generateOptionValue(cat.name)
                        }));
                },
                equipment: async () => {
                    const res = await equipmentService.getEquipment({ page: 1, limit: 1000 });
                    return (res.data ?? [])
                        .filter((eq: UpdateEquipment) => eq.isActive !== false)
                        .map((eq: UpdateEquipment) => ({
                            label: eq.title,
                            value: generateOptionValue(eq.title)
                        }));
                }
            };

            const dataSourcesToFetch = Array.from(
                new Set(questions.map(q => q.dataSource).filter(Boolean))
            ) as string[];

            const dynamicOptionsMap: Record<string, OnboardingOption[]> = {};

            await Promise.all(
                dataSourcesToFetch.map(async (source) => {
                    if (dataSourceFetchers[source]) {
                        try {
                            dynamicOptionsMap[source] = await dataSourceFetchers[source]();
                        } catch (err: unknown) {
                            console.error(`Failed to load data source: ${source}`, err);
                        }
                    } else {
                        console.warn(`No fetcher defined for data source: ${source}`);
                    }
                })
            );

            questions = questions.map(q => {
                if (q.dataSource && dynamicOptionsMap[q.dataSource]) {
                    return {
                        ...q,
                        options: dynamicOptionsMap[q.dataSource]
                    };
                }
                return q;
            });

            set({ groups, questions, loading: false });
        } catch (err: unknown) {
            const apiError = parseApiError(err);
            set({ error: apiError.message, loading: false });
        }
    },

    loadUserAnswers: async () => {
        try {
            const res = await onboardingService.getOnboardingAnswers();
            if (res?.data?.answers) {
                const answerMap: Record<string, OnboardingAnswer> = {};
                (res.data.answers as OnboardingAnswerItem[]).forEach((ans: OnboardingAnswerItem) => {
                    answerMap[ans.questionId] = {
                        questionId: ans.questionId,
                        key: ans.questionKey || ans.key || "",
                        value: (ans.answer !== undefined ? ans.answer : (ans.value !== undefined ? ans.value : "")) as AnswerValue
                    };
                });
                set((state) => ({ answers: { ...state.answers, ...answerMap } }));
            }
        } catch (err: unknown) {
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

            const res = await onboardingService.submitOnboarding({ answers: payload });
            useAuthStore.getState().updateUser({ onboardingComplete: true });
            set({ submitting: false, isComplete: true });
            return res;
        } catch (err: unknown) {
            const apiError = parseApiError(err);
            set({ error: apiError.message, submitting: false });
            throw err;
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

            //Scan for all rule sets across all questions that point to this target question
            const parentsWithRules = questions.filter((p) =>
                p.next?.some((rule) => rule.nextQuestionId === target.questionId)
            ).flatMap((parent) =>
                parent.next!
                    .filter((r) => r.nextQuestionId === target.questionId)
                    .map((r) => ({ parent, rule: r }))
            );

            //  If no other question defines a rule pointing to this target, it is a default root question -> Visible!
            if (parentsWithRules.length === 0) {
                visited.delete(target.questionId);
                return true;
            }

            //  If rules exist, evaluate if at least one rule condition is currently met
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
                if (operator === CONDITION_OPERATOR.ALWAYS) {
                    return true;
                }

                const valStr = String(value);
                if (operator === CONDITION_OPERATOR.EQUALS) {
                    return String(parentAns) === valStr;
                }
                if (operator === CONDITION_OPERATOR.INCLUDES) {
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
                    if (operator === CONDITION_OPERATOR.ALWAYS) return true;

                    const valStr = String(value);
                    if (operator === CONDITION_OPERATOR.EQUALS) return String(parentAns) === valStr;
                    if (operator === CONDITION_OPERATOR.INCLUDES) {
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
