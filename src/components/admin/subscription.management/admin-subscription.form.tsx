import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Plus, X } from "lucide-react";
import { PLAN_DURATION_DAYS, PLAN_FEATURES, PLAN_LIVE_SESSIONS, PLAN_OPTIONS, PlanType } from "@/constants/subscription.constant";
import { SubscriptionFormData } from "@/interface/subscription.interface";
import { ADMIN_UI_ROUTES } from "@/constants/constant-routes/ui-routes/admin.ui-constant-routes";
import adminServices from "@/services/admin/admin.services";


const initialForm: SubscriptionFormData = {
  subscriptionName: "",
  description: "",
  price: "" as unknown as number,
  durationDays: PLAN_DURATION_DAYS.basic,
  features: PLAN_FEATURES.basic,
  liveSessionCount: PLAN_LIVE_SESSIONS.basic,
  planType: "basic",
};
const AdminSubscriptionForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<SubscriptionFormData>(initialForm);
  const [featureInput, setFeatureInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit || !id) return;
    const fetchSubscription = async () => {
      try {
        setFetchLoading(true);
        const response = await adminServices.getSubscriptionById(id);
        const sub = response.data;
        setForm({
          subscriptionName: sub.subscriptionName,
          description: sub.description,
          price: Number(sub.price),
          durationDays: Number(sub.durationDays),
          features: sub.features,
          liveSessionCount: Number(sub.liveSessionCount),
          planType: sub.planType,
        });
      } catch {
        toast.error("Failed to fetch subscription details");
        navigate("/admin/subscriptions");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchSubscription();
  }, [id, isEdit, navigate]);

  const handlePlanTypeChange = (planType: PlanType) => {
    setForm((prev) => ({
      ...prev,
      planType,
      liveSessionCount: PLAN_LIVE_SESSIONS[planType],
      durationDays: PLAN_DURATION_DAYS[planType],
      features: PLAN_FEATURES[planType],
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // For number fields, store raw string value to allow empty field
    if (name === "price" || name === "durationDays") {
      setForm((prev) => ({ ...prev, [name]: value === "" ? "" : value }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddFeature = () => {
    const trimmed = featureInput.trim();
    if (!trimmed) return;
    if (form.features.includes(trimmed)) {
      toast.error("Feature already added");
      return;
    }
    setForm((prev) => ({ ...prev, features: [...prev.features, trimmed] }));
    setFeatureInput("");
  };

  const handleRemoveFeature = (index: number) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleFeatureKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddFeature();
    }
  };

  const validate = (): boolean => {
    if (!form.subscriptionName.trim()) { toast.error("Plan name is required"); return false; }
    if (!form.description.trim()) { toast.error("Description is required"); return false; }
    if (form.price === "" || Number(form.price) < 0) { toast.error("Valid price is required"); return false; }
    if (!form.durationDays || Number(form.durationDays) < 1) { toast.error("Duration must be at least 1 day"); return false; }
    if (form.features.length === 0) { toast.error("Add at least one feature"); return false; }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const payload = {
      subscriptionName: form.subscriptionName.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      durationDays: Number(form.durationDays),
      features: form.features,
      liveSessionCount: form.liveSessionCount,
      planType: form.planType,
    };

    try {
      setLoading(true);
      if (isEdit && id) {
        await adminServices.updateSubscription(id, payload);
        toast.success("Subscription updated successfully!");
      } else {
        await adminServices.createSubscription(payload);
        toast.success("Subscription created successfully!");
      }
      navigate(ADMIN_UI_ROUTES.SUBSCRIPTIONS);
    } catch {
      toast.error(isEdit ? "Failed to update" : "Failed to create");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      
        <div className="flex items-center justify-center h-screen">
          <div className="text-white text-xl">Loading...</div>
        </div>
     
    );
  }

  return (
    
      <div className="max-w-3xl mx-auto py-8 px-4">
        <button
          onClick={() => navigate(ADMIN_UI_ROUTES.SUBSCRIPTIONS)}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft size={20} />
          <span>Back to Subscriptions</span>
        </button>

        <div className="bg-indigo-900/50 rounded-2xl p-8 backdrop-blur">
          <h1 className="text-white text-2xl font-bold mb-8">
            {isEdit ? "Edit Subscription Plan" : "Create Subscription Plan"}
          </h1>

          <div className="space-y-5">

            {/* Plan Type Selector */}
            <div>
              <label className="text-purple-200 text-sm block mb-2">
                Plan Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {PLAN_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handlePlanTypeChange(option.value)}
                    className={`p-3 rounded-lg border text-left transition ${
                      form.planType === option.value
                        ? "bg-purple-600 border-purple-400 text-white"
                        : "bg-indigo-800/50 border-purple-600/40 text-purple-300 hover:bg-indigo-700/50"
                    }`}
                  >
                    <p className="font-semibold text-sm">{option.label}</p>
                    <p className="text-xs mt-1 opacity-80">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Session Count — read only, driven by plan type */}
            <div className="bg-indigo-800/30 border border-purple-600/30 rounded-lg px-4 py-3 flex items-center justify-between">
              <span className="text-purple-200 text-sm">Live Sessions</span>
              <span className="text-white font-semibold">
                {form.liveSessionCount === -1
                  ? "Unlimited"
                  : `${form.liveSessionCount} sessions/month`}
              </span>
            </div>

            {/* Plan Name */}
            <div>
              <label className="text-purple-200 text-sm block mb-2">Plan Name</label>
              <input
                type="text"
                name="subscriptionName"
                value={form.subscriptionName}
                onChange={handleChange}
                placeholder="e.g. Basic Plan"
                className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-purple-200 text-sm block mb-2">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe this plan..."
                rows={3}
                className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 resize-none"
              />
            </div>

            {/* Price & Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-purple-200 text-sm block mb-2">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="e.g. 499"
                  min={0}
                  className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
                />
              </div>
              <div>
                <label className="text-purple-200 text-sm block mb-2">Duration (days)</label>
                <input
                  type="number"
                  name="durationDays"
                  value={form.durationDays}
                  onChange={handleChange}
                  placeholder="e.g. 30"
                  min={1}
                  className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            {/* Features */}
            <div>
              <label className="text-purple-200 text-sm block mb-2">
                Features
                <span className="text-purple-400 text-xs ml-2">(auto-filled, customizable)</span>
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={handleFeatureKeyDown}
                  placeholder="Add custom feature..."
                  className="flex-1 bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition flex items-center gap-1"
                >
                  <Plus size={18} />
                  Add
                </button>
              </div>
              {form.features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.features.map((feature, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-2 px-3 py-1 bg-indigo-700/60 border border-purple-500/40 text-purple-200 rounded-full text-sm"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="text-purple-400 hover:text-white transition"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? isEdit ? "Updating..." : "Creating..."
                : isEdit ? "Update Plan" : "Create Plan"}
            </button>
          </div>
        </div>
      </div>
   
  );
};

export default AdminSubscriptionForm;