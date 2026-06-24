export const ONBOARDING_API_PATHS = {
  // User endpoints
  GROUPS: "/onboarding/groups",
  QUESTIONS: "/onboarding/questions",
  SUBMIT: "/onboarding/submit",
  STATUS: "/onboarding/status",
  ANSWERS: "/onboarding/answers",

  // Admin endpoints
  ADMIN_GROUPS: "/onboarding/admin/groups",
  ADMIN_GROUP_BY_ID: (id: string) => `/onboarding/admin/groups/${id}`,
  ADMIN_GROUP_TOGGLE: (id: string) => `/onboarding/admin/groups/${id}/toggle`,

  ADMIN_QUESTIONS: "/onboarding/admin/questions",
  ADMIN_QUESTION_BY_ID: (id: string) => `/onboarding/admin/questions/${id}`,
  ADMIN_QUESTION_TOGGLE: (id: string) => `/onboarding/admin/questions/${id}/toggle`,
  ADMIN_QUESTION_DATA_SOURCES: "/onboarding/admin/questions/data-sources",
};
