export const FEATURE_TYPES = [
  "limit",
  "boolean"
] as const;

export type FeatureType = typeof FEATURE_TYPES[number];


export const LIMIT_TYPES = [
  {
    label: "Daily",
    value: "daily"
  },
  {
    label: "Weekly",
    value: "weekly"
  },
  {
    label: "Monthly",
    value: "monthly"
  }
];

export type LimitType = (typeof LIMIT_TYPES)[number]["value"];