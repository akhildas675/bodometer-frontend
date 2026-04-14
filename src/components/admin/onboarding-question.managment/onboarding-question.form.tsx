import React, { useState, useEffect } from "react";
import { Plus, X, ArrowLeft, Settings2 } from "lucide-react";
import {
  OnboardingQuestion,
  OnboardingQuestionFormData,
  OnboardingQuestionOption,
} from "@/interface/onboarding.interface";
import { useFetch } from "@/hooks/useFetch";
import adminServices from "@/services/admin/admin.services";
import { SCHEMA_KEY_OPTIONS } from "@/constants/schema-key.constant";

interface OnboardingQuestionFormProps {
  isCreating: boolean;
  initialData?: OnboardingQuestion;
  sections: { key: string; title: string }[];
  onSubmit: (data: OnboardingQuestionFormData) => Promise<void>;
  onBack: () => void;
}

const defaultFormData: OnboardingQuestionFormData = {
  key: "",
  schemaKey: null,
  isCoreLocked: false,
  question: "",
  type: "single_select",

  section: "",
  order: 0,
  options: [],
  isActive: true,
  validation: { required: true },
};

const OnboardingQuestionForm: React.FC<OnboardingQuestionFormProps> = ({
  isCreating,
  initialData,
  sections,
  onSubmit,
  onBack,
}) => {
  const [formData, setFormData] = useState<OnboardingQuestionFormData>(defaultFormData);
  const [loading, setLoading] = useState(false);

  // For Add Option UI
  const [newOptionLabel, setNewOptionLabel] = useState("");
  const [newOptionValue, setNewOptionValue] = useState("");
  const [newOptionHasExtra, setNewOptionHasExtra] = useState(false);
  const [newOptionPlaceholder, setNewOptionPlaceholder] = useState("");

  const [showConfig, setShowConfig] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);

  useEffect(() => {
    if (!isCreating && initialData) {
      setFormData({
        key: initialData.key,
        schemaKey: initialData.schemaKey || null,
        isCoreLocked: initialData.isCoreLocked || false,
        question: initialData.question,
        type: initialData.type,
        section: initialData.section,
        order: initialData.order,
        options: initialData.options || [],
        config: initialData.config,
        followUp: initialData.followUp,
        validation: initialData.validation || { required: true },
        isActive: initialData.isActive,
      });
      if (initialData.config) setShowConfig(true);
      if (initialData.followUp) setShowFollowUp(true);
    }
  }, [isCreating, initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : (type === "number" ? (value === "" ? "" : Number(value)) : value),
    }));
  };

  const handleValidationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      validation: { ...prev.validation, required: e.target.checked },
    }));
  };

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        [name]: name === "unit" ? value : Number(value),
      },
    }));
  };

  const handleFollowUpChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      followUp: {
        ...prev.followUp,
        [name]: value,
      } as unknown as NonNullable<OnboardingQuestionFormData["followUp"]>,
    }));
  };

  const handleAddOption = () => {
    if (newOptionLabel.trim() && newOptionValue.trim()) {
      const newOption: OnboardingQuestionOption = {
        label: newOptionLabel.trim(),
        value: newOptionValue.trim(),
      };
      if (newOptionHasExtra) newOption.hasExtraInput = true;
      if (newOptionPlaceholder.trim()) newOption.placeholder = newOptionPlaceholder.trim();

      setFormData((prev) => ({
        ...prev,
        options: [...(prev.options || []), newOption],
      }));
      setNewOptionLabel("");
      setNewOptionValue("");
      setNewOptionHasExtra(false);
      setNewOptionPlaceholder("");
    }
  };

  const handleRemoveOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      options: (prev.options || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Failed to submit onboarding question:", error);
    } finally {
      setLoading(false);
    }
  };

  const { data: sectionsResponse, loading: sectionsLoading } = useFetch(
    () => adminServices.getOnboardingSections(),
    true
  );
  
  const fetchedSections = sectionsResponse?.success ? sectionsResponse.data : sections;

  const isOptionsType = ["single_select", "multi_select"].includes(formData.type);
  const isNumberType = ["number", "number_stepper"].includes(formData.type);

  return (
    <div className="text-white max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
      >
        <ArrowLeft size={20} />
        Back to Questions
      </button>

      <div className="bg-indigo-900/50 rounded-2xl p-8 backdrop-blur">
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold">
            {isCreating ? "Create Onboarding Question" : "Edit Onboarding Question"}
          </h1>
          <div className="flex gap-4">
             <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showConfig}
                onChange={(e) => setShowConfig(e.target.checked)}
                className="w-4 h-4 rounded bg-indigo-800/50 text-purple-600"
              />
              <span className="text-sm text-purple-200">Set Ext Config</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showFollowUp}
                onChange={(e) => setShowFollowUp(e.target.checked)}
                className="w-4 h-4 rounded bg-indigo-800/50 text-purple-600"
              />
              <span className="text-sm text-purple-200">Set Follow-Up</span>
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-purple-200 text-sm block mb-2">Unique Data Key *</label>
              <input
                type="text"
                name="key"
                value={formData.key}
                onChange={handleChange}
                required
                disabled={!isCreating} // Lock key once created
                placeholder="e.g. has_medical_issues"
                className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-purple-400 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="text-purple-200 text-sm block mb-2">Category Section *</label>
              <select
                name="section"
                value={formData.section}
                onChange={handleChange}
                required
                className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
              >
                <option value="" className="bg-[#1c1c1c]">Select Section</option>
                {sectionsLoading ? (
                  <option disabled className="bg-[#1c1c1c]">Loading sections...</option>
                ) : (
                  fetchedSections?.map((section) => (
                    <option key={section.key} value={section.key} className="bg-[#1c1c1c]">
                      {section.title}
                    </option>
                  ))
                )}
              </select>
            </div>
            
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 bg-yellow-900/10 p-4 rounded-xl border border-yellow-500/20">
              <div>
                <label className="text-yellow-200 text-sm block mb-2">Layer 1 Schema Key Mapping (Advanced)</label>
                <select
                  name="schemaKey"
                  value={formData.schemaKey || ""}
                  onChange={handleChange}
                  disabled={!isCreating} // Lock map once created
                  className="w-full bg-indigo-800/50 border border-yellow-600/50 rounded-lg px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400 disabled:opacity-50"
                >
                  <option value="" className="bg-[#1c1c1c]">-- Leave Empty (Layer 3) --</option>
                  {SCHEMA_KEY_OPTIONS
                    .filter(opt => !formData.section || opt.section === formData.section)
                    .map(opt => (
                    <option key={opt.value} value={opt.value} className="bg-[#1c1c1c]">
                      {opt.label} ({opt.value})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                 <label className="flex items-center gap-2 cursor-pointer select-none border border-yellow-500/30 px-4 py-2 rounded-lg bg-yellow-900/30 w-full">
                  <input
                    type="checkbox"
                    name="isCoreLocked"
                    checked={formData.isCoreLocked}
                    onChange={handleChange}
                    className="w-4 h-4 rounded bg-indigo-800/50"
                  />
                  <div>
                    <span className="text-yellow-200 text-sm font-medium block">Lock Core Options</span>
                    <span className="text-white/40 text-xs text-wrap">If checked, you cannot edit option values later to preserve DB integrity.</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="text-purple-200 text-sm block mb-2">Question Text *</label>
            <textarea
              name="question"
              value={formData.question}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Enter your question..."
              className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2 text-white placeholder-white/30 resize-none focus:outline-none focus:border-purple-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-purple-200 text-sm block mb-2">Input Format *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
              >
                <option value="boolean" className="bg-[#1c1c1c]">Boolean (Yes/No)</option>
                <option value="single_select" className="bg-[#1c1c1c]">Single Select</option>
                <option value="multi_select" className="bg-[#1c1c1c]">Multi Select</option>
                <option value="text" className="bg-[#1c1c1c]">Text</option>
                <option value="number" className="bg-[#1c1c1c]">Number</option>
                <option value="time" className="bg-[#1c1c1c]">Time</option>
                <option value="number_stepper" className="bg-[#1c1c1c]">Number Stepper</option>
              </select>
            </div>

            <div>
              <label className="text-purple-200 text-sm block mb-2">Display Order</label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          {/* Options Section */}
          {isOptionsType && (
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
              <h3 className="text-lg font-medium text-purple-100 flex items-center gap-2">
                <Settings2 size={18} /> Options Configuration
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Option Label (e.g., Daily)"
                  value={newOptionLabel}
                  onChange={(e) => setNewOptionLabel(e.target.value)}
                  className="bg-indigo-800/50 border border-purple-600 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-400"
                />
                <input
                  type="text"
                  placeholder="Option Value (e.g., daily)"
                  value={newOptionValue}
                  onChange={(e) => setNewOptionValue(e.target.value)}
                  className="bg-indigo-800/50 border border-purple-600 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-400"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                 <input
                  type="text"
                  placeholder="Placeholder for 'Other' type (optional)"
                  value={newOptionPlaceholder}
                  onChange={(e) => setNewOptionPlaceholder(e.target.value)}
                  className="bg-indigo-800/50 border border-purple-600 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-400"
                />
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-purple-200">
                    <input
                      type="checkbox"
                      checked={newOptionHasExtra}
                      onChange={(e) => setNewOptionHasExtra(e.target.checked)}
                      className="w-4 h-4 rounded bg-indigo-800/50"
                    />
                    Req Extra Input?
                  </label>
                  <button
                    type="button"
                    onClick={handleAddOption}
                    disabled={formData.isCoreLocked && !isCreating}
                    className="ml-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed text-nowrap"
                  >
                    <Plus size={16} /> Add Option
                  </button>
                </div>
              </div>

              {formData.options && formData.options.length > 0 && (
                <div className="bg-black/20 rounded-lg p-3 space-y-2 mt-4">
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex flex-wrap items-center justify-between bg-indigo-900/50 px-3 py-2 rounded-md font-mono text-sm border border-purple-500/20">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-purple-300 font-bold">{option.label}</span>
                        <span className="text-slate-400 text-xs">val: {option.value}</span>
                        {option.hasExtraInput && (
                           <span className="text-xs bg-yellow-600/30 text-yellow-300 px-2 py-0.5 rounded">
                             Extra Input {option.placeholder && `(${option.placeholder})`}
                           </span>
                        )}
                      </div>
                      {!(formData.isCoreLocked && !isCreating) && (
                        <button type="button" onClick={() => handleRemoveOption(index)} className="text-red-400 hover:text-red-300 p-1">
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Config Section */}
          {showConfig && isNumberType && (
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <h3 className="text-lg font-medium text-purple-100 mb-4 flex items-center gap-2">
                <Settings2 size={18} /> Number Boundaries
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-purple-300 mb-1 block">Min Value</label>
                  <input type="number" name="min" value={formData.config?.min ?? ""} onChange={handleConfigChange} className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
                <div>
                   <label className="text-xs text-purple-300 mb-1 block">Max Value</label>
                  <input type="number" name="max" value={formData.config?.max ?? ""} onChange={handleConfigChange} className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
                <div>
                   <label className="text-xs text-purple-300 mb-1 block">Step Increment</label>
                  <input type="number" name="step" value={formData.config?.step ?? ""} onChange={handleConfigChange} className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
                <div>
                   <label className="text-xs text-purple-300 mb-1 block">Unit</label>
                  <input type="text" name="unit" placeholder="e.g. kg, cm" value={formData.config?.unit || ""} onChange={handleConfigChange} className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30" />
                </div>
              </div>
            </div>
          )}

          {/* FollowUp Section */}
          {showFollowUp && (
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
               <h3 className="text-lg font-medium text-purple-100 mb-4 flex items-center gap-2">
                <Settings2 size={18} /> Follow-Up Sub-Question Logic
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="text-xs text-purple-300 mb-1 block">Trigger When Answer Equals...</label>
                  <input type="text" name="when" placeholder="e.g. Yes" value={formData.followUp?.when as string || ""} onChange={handleFollowUpChange} className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30" />
                </div>
                <div>
                  <label className="text-xs text-purple-300 mb-1 block">Sub-Question Input Type</label>
                  <select name="type" value={formData.followUp?.type || "text"} onChange={handleFollowUpChange} className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-3 py-2 text-sm text-white font-medium">
                    <option value="text" className="bg-[#1c1c1c]">Text Form</option>
                    <option value="number" className="bg-[#1c1c1c]">Number Value</option>
                  </select>
                </div>
                <div>
                   <label className="text-xs text-purple-300 mb-1 block">Sub-Question Unique Key</label>
                  <input type="text" name="key" placeholder="e.g. specify_condition_text" value={formData.followUp?.key || ""} onChange={handleFollowUpChange} className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30" />
                </div>
                 <div>
                   <label className="text-xs text-purple-300 mb-1 block">Sub-Question Placeholder Text</label>
                  <input type="text" name="placeholder" placeholder="Please elaborate..." value={formData.followUp?.placeholder || ""} onChange={handleFollowUpChange} className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30" />
                </div>
              </div>
            </div>
          )}

          {/* Footer Settings */}
          <div className="flex flex-wrap gap-6 pt-4 border-t border-white/10">
            <label className="flex items-center gap-2 cursor-pointer select-none border border-purple-500/30 px-4 py-2 rounded-lg bg-indigo-900/30">
              <input
                type="checkbox"
                checked={formData.validation?.required ?? false}
                onChange={handleValidationChange}
                className="w-4 h-4 rounded bg-indigo-800/50"
              />
              <span className="text-purple-200 text-sm font-medium">Mandatory Question</span>
            </label>

             <label className="flex items-center gap-2 cursor-pointer select-none border border-purple-500/30 px-4 py-2 rounded-lg bg-indigo-900/30">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 rounded bg-indigo-800/50"
              />
              <span className="text-purple-200 text-sm font-medium">Visible to Users</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-lg shadow-purple-600/20 text-lg"
          >
            {loading ? "Saving..." : isCreating ? "Create Question" : "Update Question"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingQuestionForm;