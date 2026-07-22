export const COACHING_API_PATHS = {
  ROOT: "/coaching",

  BY_ID: (coachingId: string) =>
    `/coaching/${coachingId}`,

  TOGGLE_STATUS: (coachingId: string) =>
    `/coaching/${coachingId}/toggle`,
};
