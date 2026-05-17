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

export type QuestionType = (typeof QUESTION_TYPE)[keyof typeof QUESTION_TYPE];


export const ANSWER_VALUE_TYPE = {
    STRING: "string",
    NUMBER: "number",
    ARRAY: "array",
    BOOLEAN: "boolean",
    DATE: "date",
    TIME: "time",

} as const;

export type AnswerValueType = (typeof ANSWER_VALUE_TYPE)[keyof typeof ANSWER_VALUE_TYPE];