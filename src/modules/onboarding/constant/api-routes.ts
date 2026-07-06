export const ONBOARDING_API_PATHS = {
  GROUPS: "/onboarding/groups",
  GROUP_BY_ID: (id: string) => "/onboarding/groups/${id}",
  GROUP_TOGGLE: (id: string) => "/onboarding/groups/${id}/toggle",

  QUESTIONS: "/onboarding/questions",
  QUESTION_BY_ID: (id: string) => "/onboarding/questions/${id}",
  QUESTION_TOGGLE: (id: string) => "/onboarding/questions/${id}/toggle",
  QUESTION_DATA_SOURCES: "/onboarding/questions/data-sources",

  SUBMIT: "/onboarding/submit",
  STATUS: "/onboarding/status",
  ANSWERS: "/onboarding/answers",
};
