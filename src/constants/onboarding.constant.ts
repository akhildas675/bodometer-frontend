export const QUESTION_TYPE = {
  BOOLEAN: "boolean",
  SINGLE_SELECT: "single_select",
  MULTI_SELECT: "multi_select",
  TEXT: "text",
  NUMBER: "number",
  TIME: "time",
  DATE: "date",
  NUMBER_STEPPER: "number_stepper",
} as const;

export type QuestionType =
  (typeof QUESTION_TYPE)[keyof typeof QUESTION_TYPE];

export type AnswerValue =
  | string
  | number
  | boolean
  | string[];