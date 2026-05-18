import { useEffect, useState, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Loader2, Plus, Trash2, Check, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import adminServices from "@/services/admin/admin.services";
import { ADMIN_UI_ROUTES } from "@/constants/constant-routes/ui-routes/admin.ui-constant-routes";
import type { QuestionGroup, CreateQuestionData, OnboardingQuestion, UpdateCategory } from "@/interface/admin.interface";
import { QUESTION_TYPE } from "@/constants/onboarding.constant";

interface NextJumpData {
  condition: { operator: string; value?: string | number | boolean };
  nextQuestionId: string;
}

const QUESTION_TYPES = [
  { label: "Yes / No (Boolean)", value: QUESTION_TYPE.BOOLEAN },
  { label: "Single Select", value: QUESTION_TYPE.SINGLE_SELECT },
  { label: "Multi Select", value: QUESTION_TYPE.MULTI_SELECT },
  { label: "Text Input", value: QUESTION_TYPE.TEXT },
  { label: "Number Input", value: QUESTION_TYPE.NUMBER },
  { label: "Time Picker", value: QUESTION_TYPE.TIME },
  { label: "Date Picker", value: QUESTION_TYPE.DATE },
];

interface OptionData {
  label: string;
  value: string | number | boolean;
}

const AdminQuestionForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [groups, setGroups] = useState<QuestionGroup[]>([]);
  const [questionsList, setQuestionsList] = useState<OnboardingQuestion[]>([]);
  const [categories, setCategories] = useState<UpdateCategory[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [hasInitializedCategories, setHasInitializedCategories] = useState(false);

  // Form state
  const [key, setKey] = useState("");
  const [question, setQuestion] = useState("");
  const [groupId, setGroupId] = useState("");
  const [type, setType] = useState<string>(QUESTION_TYPE.SINGLE_SELECT);
  const [order, setOrder] = useState(1);
  const [isRequired, setIsRequired] = useState(true);
  const [options, setOptions] = useState<OptionData[]>([{ label: "", value: "" }]);
  
  const [minNum, setMinNum] = useState<number | undefined>(undefined);
  const [maxNum, setMaxNum] = useState<number | undefined>(undefined);
  const [unitNum, setUnitNum] = useState("");
  const [dataSource, setDataSource] = useState("");

  const [nextJumps, setNextJumps] = useState<NextJumpData[]>([]);

  useEffect(() => {
    adminServices.getQuestionGroups({ page: 1, limit: 100 })
      .then((res) => setGroups(res.data || []))
      .catch((e) => console.error(e));

    adminServices.getQuestions({ page: 1, limit: 1000 })
      .then((res) => setQuestionsList(res.data || []))
      .catch((e) => console.error(e));

    adminServices.getAllCategories({ sortOrder: "asc", page: 1, limit: 1000 })
      .then((res) => {
        const loadedCats = res.data || [];
        setCategories(loadedCats);
        if (!isEdit) {
          setSelectedCategories(loadedCats.filter(c => c.isActive !== false).map(c => c.categoryId));
        }
      })
      .catch((e) => console.error(e));

    if (isEdit && id) {
      setFetching(true);
      adminServices.getQuestionById(id)
        .then((res) => {
          const q = res.data;
          if (!q) return;
          setKey(q.key);
          setQuestion(q.question);
          setGroupId(q.groupId);
          setType(q.type);
          setOrder(q.order);
          setIsRequired(!!q.validation?.required);
          
          if (q.options) {
            setOptions(q.options);
          }
          if (q.numberConfig) {
            setMinNum(q.numberConfig.min);
            setMaxNum(q.numberConfig.max);
            setUnitNum(q.numberConfig.unit ?? "");
          }
          setDataSource(q.dataSource ?? "");
          if (q.next && Array.isArray(q.next)) {
            setNextJumps(q.next.map(n => ({
              condition: {
                operator: n.condition?.operator || "equals",
                value: n.condition?.value ?? ""
              },
              nextQuestionId: n.nextQuestionId
            })));
          }
        })
        .catch(() => toast.error("Load error"))
        .finally(() => setFetching(false));
    }
  }, [isEdit, id]);

  useEffect(() => {
    if (isEdit && !hasInitializedCategories && categories.length > 0 && dataSource === "category") {
      const matchedIds = categories
        .filter(cat => options.some(opt => opt.label.trim().toLowerCase() === (cat.name || "").trim().toLowerCase()))
        .map(cat => cat.categoryId);
      
      setSelectedCategories(matchedIds);
      setHasInitializedCategories(true);
    }
  }, [categories, options, isEdit, dataSource, hasInitializedCategories]);

  const handleToggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleAddOption = () => {
    setOptions([...options, { label: "", value: "" }]);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, field: keyof OptionData, value: string) => {
    setOptions(
      options.map((opt, i) => 
        i === index ? { ...opt, [field]: value } : opt
      )
    );
  };

  const handleAddJump = () => {
    setNextJumps([...nextJumps, { condition: { operator: "equals", value: "" }, nextQuestionId: "" }]);
  };

  const handleRemoveJump = (index: number) => {
    setNextJumps(nextJumps.filter((_, i) => i !== index));
  };

  const handleJumpChange = (index: number, field: "operator" | "value" | "nextQuestionId", val: string) => {
    setNextJumps(
      nextJumps.map((jump, i) => {
        if (i !== index) return jump;
        if (field === "operator") {
          return { ...jump, condition: { ...jump.condition, operator: val } };
        } else if (field === "value") {
          return { ...jump, condition: { ...jump.condition, value: val } };
        } else {
          return { ...jump, nextQuestionId: val };
        }
      })
    );
  };

  const validate = (): boolean => {
    if (!groupId) { toast.error("Please select a Question Group"); return false; }
    if (!question.trim()) { toast.error("Question prompt is required"); return false; }
    
    if ([QUESTION_TYPE.SINGLE_SELECT, QUESTION_TYPE.MULTI_SELECT].includes(type as any)) {
      if (dataSource === "category") {
        if (selectedCategories.length === 0) {
          toast.error("Please select at least one category option.");
          return false;
        }
      } else if (!dataSource) {
        const invalid = options.some(opt => !opt.label.trim());
        if (invalid) {
          toast.error("Please fill all option labels");
          return false;
        }
      }
    }

    if (nextJumps.length > 0) {
      const invalidJump = nextJumps.some(j => !j.nextQuestionId || (j.condition.operator !== "always" && String(j.condition.value ?? "").trim() === ""));
      if (invalidJump) {
        toast.error("Please ensure all conditional follow-up rules have targets and values specified");
        return false;
      }
    }
    return true;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload: CreateQuestionData = {
        key: "",
        question: question.trim(),
        groupId,
        order: Number(order),
        type,
        dataSource: [QUESTION_TYPE.SINGLE_SELECT, QUESTION_TYPE.MULTI_SELECT].includes(type as any) && dataSource ? dataSource : undefined,
        validation: { required: isRequired },
        next: nextJumps.length > 0 ? nextJumps.map(j => ({
          condition: {
            operator: j.condition.operator,
            value: j.condition.operator === "always" ? undefined : String(j.condition.value || "").trim()
          },
          nextQuestionId: j.nextQuestionId
        })) : undefined,
      };

      if ([QUESTION_TYPE.SINGLE_SELECT, QUESTION_TYPE.MULTI_SELECT].includes(type as any)) {
        if (dataSource === "category") {
          const selectedCats = categories.filter((c) => selectedCategories.includes(c.categoryId));
          payload.options = selectedCats.map((c) => ({
            label: (c.name || "").trim(),
            value: "",
          }));
        } else if (!dataSource) {
          payload.options = options.map((o) => ({ label: o.label.trim(), value: "" }));
        }
      }

      if (type === QUESTION_TYPE.NUMBER) {
        payload.numberConfig = {
          min: minNum !== undefined ? Number(minNum) : undefined,
          max: maxNum !== undefined ? Number(maxNum) : undefined,
          unit: unitNum.trim() || undefined,
        };
      }

      if (isEdit && id) {
        await adminServices.updateQuestion(id, payload);
        toast.success("Question modified");
      } else {
        await adminServices.createQuestion(payload);
        toast.success("Question added");
      }
      navigate(ADMIN_UI_ROUTES.QUESTIONS_LIST);
    } catch {
      toast.error("Save failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-purple-500" />
      </div>
    );
  }

  return (
    <div className="text-white max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-6 transition">
        <ChevronLeft size={20} />
        <span>Back</span>
      </button>

      <div className="bg-[#0c0624]/70 backdrop-blur border border-purple-900/50 rounded-xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
          {isEdit ? "Modify Questionnaire Item" : "Create New Question"}
        </h1>

        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6">
          <div className={isEdit ? "grid grid-cols-2 gap-4" : ""}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-purple-400 mb-1">Group <span className="text-red-400">*</span></label>
              <select 
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                required
                className="w-full bg-[#050017]/70 border border-purple-900/50 rounded-lg px-4 py-2 text-white outline-none cursor-pointer"
              >
                <option value="">Select Group...</option>
                {groups.map((g) => (
                  <option key={g.groupId} value={g.groupId}>{g.title}</option>
                ))}
              </select>
            </div>
            {isEdit && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-purple-400 mb-1">System Reference Key</label>
                <input 
                  value={key}
                  disabled
                  className="w-full bg-[#050017]/70 border border-purple-900/50 rounded-lg px-4 py-2 text-white outline-none opacity-60" 
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-purple-400 mb-1">Question Prompt <span className="text-red-400">*</span></label>
            <input 
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              className="w-full bg-[#050017]/70 border border-purple-900/50 rounded-lg px-4 py-3 text-lg text-white outline-none focus:border-purple-500 transition" 
              placeholder="e.g. What are your specific workout constraints?" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-purple-400 mb-1">Response Pattern Type</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-[#050017]/70 border border-purple-900/50 rounded-lg px-4 py-2 text-white outline-none cursor-pointer"
              >
                {QUESTION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-purple-400 mb-1">Display Sort Order</label>
              <input 
                type="number" 
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                required
                min="1"
                className="w-full bg-[#050017]/70 border border-purple-900/50 rounded-lg px-4 py-2 text-white outline-none" 
              />
            </div>
          </div>

          {([QUESTION_TYPE.SINGLE_SELECT, QUESTION_TYPE.MULTI_SELECT].includes(type as any)) && (
            <div className="border border-dashed border-purple-800/50 p-4 rounded-lg bg-[#0a041a] space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-purple-400 mb-1.5">Option Data Source</label>
                <select 
                  value={dataSource}
                  onChange={(e) => setDataSource(e.target.value)}
                  className="w-full bg-[#050017]/70 border border-purple-900/50 rounded-lg px-3 py-2 text-white text-sm outline-none cursor-pointer focus:border-purple-500"
                >
                  <option value="">Manual / Static List</option>
                  <option value="category">Dynamic - Load from Workout Categories</option>
                </select>
              </div>

              {!dataSource ? (
                <div className="space-y-3 pt-2 border-t border-purple-950">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-semibold text-purple-200 uppercase tracking-wider">Define Selectable Options</h3>
                    <button 
                      type="button" 
                      onClick={handleAddOption} 
                      className="text-xs flex items-center gap-1 text-purple-400 hover:text-purple-200 transition bg-purple-900/10 hover:bg-purple-900/20 px-2 py-1 rounded border border-purple-900/50"
                    >
                      <Plus size={12}/> Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {options.map((opt, index) => (
                      <div key={index} className="flex gap-2">
                        <input 
                          value={opt.label}
                          onChange={(e) => handleOptionChange(index, "label", e.target.value)}
                          placeholder="Option Label (e.g. Muscle Gain, Weight Loss)" 
                          required
                          className="flex-1 bg-black/30 border border-purple-900/30 px-3 py-2 rounded text-sm text-white outline-none focus:border-purple-500 transition" 
                        />
                        <button 
                          type="button" 
                          onClick={() => handleRemoveOption(index)} 
                          className="text-red-500/60 hover:text-red-400 px-2 transition disabled:opacity-30"
                          disabled={options.length <= 1}
                        >
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3 pt-2 border-t border-purple-950">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-xs font-semibold text-purple-200 uppercase tracking-wider">Select Categories for Options</h3>
                    <div className="flex gap-3 text-[11px]">
                      <button 
                        type="button" 
                        onClick={() => setSelectedCategories(categories.filter(c => c.isActive !== false).map(c => c.categoryId))}
                        className="text-purple-400 hover:text-purple-200 underline cursor-pointer transition bg-transparent border-none p-0"
                      >
                        Select All
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setSelectedCategories([])}
                        className="text-gray-400 hover:text-gray-200 underline cursor-pointer transition bg-transparent border-none p-0"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1 mt-2">
                    {categories.filter(c => c.isActive !== false).map((cat) => {
                      const isSelected = selectedCategories.includes(cat.categoryId);
                      return (
                        <div 
                          key={cat.categoryId} 
                          onClick={() => handleToggleCategory(cat.categoryId)}
                          className={`flex items-center justify-between gap-3 cursor-pointer px-4 py-3 rounded-xl border transition-all duration-200 select-none ${
                            isSelected 
                              ? "bg-purple-600/20 border-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.15)]" 
                              : "bg-black/20 border-purple-900/30 hover:bg-purple-950/20 hover:border-purple-800/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all duration-200 ${
                              isSelected ? "bg-purple-500 border-purple-500" : "border-purple-900/50"
                            }`}>
                              {isSelected && <Check size={12} className="text-white stroke-[3]" />}
                            </div>
                            <span className={`font-medium tracking-wide text-sm ${isSelected ? "text-white" : "text-purple-300/80"}`}>
                              {cat.name}
                            </span>
                          </div>
                          <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isSelected ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-emerald-800/20"}`} />
                        </div>
                      );
                    })}
                    {categories.filter(c => c.isActive !== false).length === 0 && (
                      <div className="col-span-2 text-xs text-gray-500 italic py-4 flex flex-col items-center gap-2 bg-black/10 border border-dashed border-purple-900/20 rounded-xl">
                        <AlertTriangle className="w-8 h-8 text-amber-500 animate-pulse" />
                        <span>No active workout categories found. Please create active categories first.</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-purple-950/10 border border-purple-900/30 rounded text-[11px] text-purple-400/80 italic flex items-center gap-2 pt-2 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                    The selected categories will be populated as static selectable options upon saving.
                  </div>
                </div>
              )}
            </div>
          )}

          {type === QUESTION_TYPE.NUMBER && (
            <div className="grid grid-cols-3 gap-4 border border-dashed border-purple-800/50 p-4 rounded-lg bg-[#0a041a]">
              <div>
                <label className="text-xs text-purple-400 block mb-1">Min Bounds</label>
                <input 
                  type="number" 
                  value={minNum ?? ""}
                  onChange={(e) => setMinNum(e.target.value !== "" ? Number(e.target.value) : undefined)}
                  className="w-full bg-black/30 border border-purple-900/30 px-2 py-1.5 text-white text-sm rounded outline-none focus:border-purple-500" 
                />
              </div>
              <div>
                <label className="text-xs text-purple-400 block mb-1">Max Bounds</label>
                <input 
                  type="number" 
                  value={maxNum ?? ""}
                  onChange={(e) => setMaxNum(e.target.value !== "" ? Number(e.target.value) : undefined)}
                  className="w-full bg-black/30 border border-purple-900/30 px-2 py-1.5 text-white text-sm rounded outline-none focus:border-purple-500" 
                />
              </div>
              <div>
                <label className="text-xs text-purple-400 block mb-1">Suffix (Unit)</label>
                <input 
                  value={unitNum}
                  onChange={(e) => setUnitNum(e.target.value)}
                  placeholder="kg, lbs, mins" 
                  className="w-full bg-black/30 border border-purple-900/30 px-2 py-1.5 text-white text-sm rounded outline-none focus:border-purple-500" 
                />
              </div>
            </div>
          )}

          {/* Conditional Follow-up Rules Section */}
          <div className="border border-dashed border-purple-800/50 p-4 rounded-lg bg-[#0a041a]">
            <div className="flex justify-between mb-3">
              <h3 className="text-sm font-semibold text-purple-200">Conditional Follow-up Rules (Flow Jumps)</h3>
              <button 
                type="button" 
                onClick={handleAddJump} 
                className="text-xs flex items-center gap-1 text-purple-400 hover:text-purple-200 transition"
              >
                <Plus size={14}/> Add Rule
              </button>
            </div>
            {nextJumps.length === 0 ? (
              <p className="text-xs text-gray-500 italic text-center py-2">No conditional follow-ups configured. Standard linear progression applies.</p>
            ) : (
              <div className="space-y-3">
                {nextJumps.map((jump, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-3 p-3 bg-black/20 border border-purple-950 rounded-lg items-end relative group">
                    <div className="flex-1 min-w-[120px]">
                      <label className="block text-[10px] font-semibold uppercase tracking-wide text-purple-400 mb-1">If Answer...</label>
                      <select 
                        value={jump.condition.operator}
                        onChange={(e) => handleJumpChange(index, "operator", e.target.value)}
                        className="w-full bg-[#050017]/70 border border-purple-900/50 rounded px-2 py-1.5 text-xs text-white outline-none cursor-pointer focus:border-purple-500"
                      >
                        <option value="equals">Equals</option>
                        <option value="includes">Includes</option>
                        <option value="always">Always jumps</option>
                      </select>
                    </div>

                    {jump.condition.operator !== "always" && (
                      <div className="flex-1 min-w-[120px]">
                        <label className="block text-[10px] font-semibold uppercase tracking-wide text-purple-400 mb-1">To Value...</label>
                        <input 
                          value={String(jump.condition.value ?? "")}
                          onChange={(e) => handleJumpChange(index, "value", e.target.value)}
                          placeholder="e.g. yes, true, 10" 
                          required
                          className="w-full bg-[#050017]/70 border border-purple-900/50 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-purple-500" 
                        />
                      </div>
                    )}

                    <div className="flex-[2] min-w-[200px]">
                      <label className="block text-[10px] font-semibold uppercase tracking-wide text-purple-400 mb-1">Go to Question...</label>
                      <select 
                        value={jump.nextQuestionId}
                        onChange={(e) => handleJumpChange(index, "nextQuestionId", e.target.value)}
                        required
                        className="w-full bg-[#050017]/70 border border-purple-900/50 rounded px-2 py-1.5 text-xs text-white outline-none cursor-pointer focus:border-purple-500"
                      >
                        <option value="">Select Next Question...</option>
                        {questionsList
                          .filter((q) => q.questionId !== id) // Prevent linking to self
                          .map((q) => (
                            <option key={q.questionId} value={q.questionId!}>
                              {q.question} ({q.type})
                            </option>
                          ))
                        }
                      </select>
                    </div>

                    <button 
                      type="button" 
                      onClick={() => handleRemoveJump(index)} 
                      className="text-red-500/60 hover:text-red-400 p-2 transition self-center mt-4 md:mt-0"
                    >
                      <Trash2 size={16}/>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 py-2">
            <input 
              type="checkbox" 
              id="req" 
              checked={isRequired}
              onChange={(e) => setIsRequired(e.target.checked)}
              className="accent-purple-600 w-4 h-4 cursor-pointer" 
            />
            <label htmlFor="req" className="text-sm font-medium text-purple-300 cursor-pointer select-none">
              Response is compulsory to continue flow
            </label>
          </div>

          <div className="flex gap-3 mt-4">
            <button 
              type="submit" 
              disabled={loading} 
              className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 py-3 rounded-lg font-semibold text-white shadow-lg shadow-purple-900/20 disabled:opacity-50 transition flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : isEdit ? "Push Changes" : "Publish Question"}
            </button>
            <button 
              type="button" 
              onClick={() => navigate(-1)} 
              className="flex-1 border border-purple-900 text-purple-300 hover:bg-purple-900/10 py-3 rounded-lg font-semibold transition"
            >
              Discard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminQuestionForm;
