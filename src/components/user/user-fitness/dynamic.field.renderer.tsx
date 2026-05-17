import { OnboardingQuestion } from "@/stores/onboarding.store";
import { StepperInput } from "./stepper.input";
import { AnswerValue } from "@/constants/onboarding.constant";



const PickOne = ({
  question,
  value,
  onChange,
}: {
  question: OnboardingQuestion;
  value: string | null;
  onChange: (v: string) => void;
}) => {
  const options = question.options ?? [];
  return (
    <div className="flex flex-wrap gap-2.5 mt-2">
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          type="button"
          onClick={() => onChange(String(opt.value))}
          className={`px-5 py-2.5 rounded-full border text-sm font-medium tracking-wide transition-all shadow-md cursor-pointer hover:scale-[1.02] ${
            value === String(opt.value)
              ? "border-purple-500 bg-purple-500/30 text-white shadow-purple-500/10"
              : "border-white/10 bg-white/5 text-white/60 hover:border-white/30 hover:text-white"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};

const PickMany = ({
  question,
  value,
  onChange,
}: {
  question: OnboardingQuestion;
  value: string[] | null;
  onChange: (v: string[]) => void;
}) => {
  const options = question.options ?? [];
  const currentAnswers = value || [];

  const handleToggle = (optVal: string) => {
    const next = currentAnswers.includes(optVal)
      ? currentAnswers.filter((x) => x !== optVal)
      : [...currentAnswers, optVal];
    onChange(next);
  };

  return (
    <div className="flex flex-wrap gap-2.5 mt-2">
      {options.map((opt) => {
        const active = currentAnswers.includes(String(opt.value));
        return (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => handleToggle(String(opt.value))}
            className={`px-5 py-2.5 rounded-full border text-sm font-medium tracking-wide transition-all shadow-md cursor-pointer hover:scale-[1.02] ${
              active
                ? "border-purple-500 bg-purple-500/30 text-white shadow-purple-500/10"
                : "border-white/10 bg-white/5 text-white/60 hover:border-white/30 hover:text-white"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

const BoolToggle = ({
  value,
  onChange,
}: {
  value: boolean | null;
  onChange: (v: boolean) => void;
}) => {
  return (
    <div className="inline-flex bg-white/5 rounded-2xl p-1.5 border border-white/10 mt-2 shadow-md">
      {(["Yes", "No"] as const).map((label) => {
        const isYes = label === "Yes";
        const active = value !== null && (isYes ? value : !value);

        return (
          <button
            key={label}
            type="button"
            onClick={() => onChange(isYes)}
            className={`px-8 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all cursor-pointer ${
              active
                ? "bg-purple-600 text-white shadow-md scale-105"
                : "text-white/40 hover:text-white"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};


interface DynamicFieldRendererProps {
  question: OnboardingQuestion;
  answer: AnswerValue | undefined;
  onChange: (v: AnswerValue) => void;
}

export const DynamicFieldRenderer = ({
  question,
  answer,
  onChange,
}: DynamicFieldRendererProps) => {
  switch (question.type) {
    case "boolean":
      return (
        <BoolToggle
          value={typeof answer === "boolean" ? answer : null}
          onChange={onChange}
        />
      );

    case "single_select":
      return (
        <PickOne
          question={question}
          value={typeof answer === "string" ? answer : null}
          onChange={onChange}
        />
      );

    case "multi_select":
      return (
        <PickMany
          question={question}
          value={Array.isArray(answer) ? (answer as string[]) : null}
          onChange={onChange}
        />
      );

    case "number":
      return (
        <StepperInput
          question={question}
          value={typeof answer === "number" ? answer : null}
          onChange={onChange}
        />
      );

    case "text":
      return (
        <input
          type="text"
          value={typeof answer === "string" ? answer : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full max-w-xl bg-white/5 border border-white/20 rounded-xl px-5 py-3.5 text-white placeholder-white/30 tracking-wide focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 shadow-md transition mt-2"
        />
      );

    case "time":
      return (
        <input
          type="time"
          value={typeof answer === "string" ? answer : ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-fit bg-white/5 border border-white/20 rounded-xl px-6 py-3 text-white font-semibold text-lg tracking-wide focus:outline-none focus:border-purple-500 shadow-md transition mt-2 cursor-pointer"
        />
      );

    case "date":
      return (
        <input
          type="date"
          value={typeof answer === "string" ? answer : ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-fit bg-white/5 border border-white/20 rounded-xl px-6 py-3 text-white font-semibold tracking-wide focus:outline-none focus:border-purple-500 shadow-md transition mt-2 cursor-pointer scheme-dark"
        />
      );

    default:
      return (
        <p className="text-white/30 italic text-sm">
          Unsupported field type: {question.type}
        </p>
      );
  }
};