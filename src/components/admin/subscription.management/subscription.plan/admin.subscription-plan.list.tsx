import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import adminServices from "@/services/admin/admin.services";
import { type FeatureListItem, type SubscriptionPlanFormData, type SubscriptionPlanDetailsResponse } from "@/interface/admin.interface";
import { LIMIT_TYPES } from "@/constants/subscription.constants";
import { useFetch } from "@/hooks/useFetch";


import { parseApiError } from "@/api/error.helper";

const EMPTY_FORM: SubscriptionPlanFormData = {
  name: "",
  description: "",
  price: "",
  durationInDays: "",
  isPopular: false,
  features: [],
};

const AdminSubscriptionPlanForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<SubscriptionPlanFormData>(EMPTY_FORM);
  const [availableFeatures, setAvailableFeatures] = useState<FeatureListItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [loadedPlan, setLoadedPlan] = useState<SubscriptionPlanDetailsResponse | null>(null);

  // Load available features
  const { data: response } = useFetch(() => adminServices.getAllSubscriptionFeatures());

  useEffect(() => {
    if (response?.data) {
      const mapped = response.data.map((f) => ({
        featureId: f.subscriptionFeatureId || "",
        key: f.key || "",
        title: f.title || "",
        description: f.description || "",
        type: (f.type === "limit" ? "limit" : "boolean") as "boolean" | "limit",
        isActive: f.isActive ?? true,
      }));
      setAvailableFeatures(mapped);
    }
  }, [response]);

  // Load plan for edit
  useEffect(() => {
    if (!isEdit || !id) return;
    const load = async () => {
      try {
        setFetchLoading(true);
        const res = await adminServices.getSubscriptionPlanById(id);
        if (res?.success) {
          setLoadedPlan(res.data);
        }
      } catch (error) {
        const apiError = parseApiError(error);
        toast.error(apiError.message);
      } finally {
        setFetchLoading(false);
      }
    };
    load();
  }, [id, isEdit]);

  useEffect(() => {
    if (loadedPlan && availableFeatures.length > 0) {
      setForm({
        name: loadedPlan.name,
        description: loadedPlan.description || "",
        price: String(loadedPlan.price),
        durationInDays: String(loadedPlan.durationInDays),
        isPopular: loadedPlan.isPopular,
        features: loadedPlan.features.map((f: { featureId: string; limit?: number; limitType?: string }) => {
          const selected = availableFeatures.find((af) => af.featureId === f.featureId);
          return {
            featureId: f.featureId,
            type: selected?.type || "boolean",
            limit: f.limit ? String(f.limit) : "",
            limitType: f.limitType || "",
          };
        }),
      });
    }
  }, [loadedPlan, availableFeatures]);

  // Add a feature row
  const addFeature = () => {
    setForm((prev) => ({
      ...prev,
      features: [...prev.features, { featureId: "", type: "boolean", limit: "", limitType: "" }],
    }));
  };

  // Remove a feature row
  const removeFeature = (index: number) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  // Update a feature row field
  const updateFeature = (index: number, field: string, value: string) => {
    setForm((prev) => {
      const updated = [...prev.features];

      if (field === "featureId") {
        // Auto-detect type from selected feature
        const selected = availableFeatures.find((f) => f.featureId === value);
        updated[index] = {
          ...updated[index],
          featureId: value,
          type: selected?.type || "boolean",
          limit: "",
          limitType: "",
        };
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }

      return { ...prev, features: updated };
    });
  };

  const handleSubmit = async () => {
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      durationInDays: Number(form.durationInDays),
      isPopular: form.isPopular,
      features: form.features.map((f) => ({
        featureId: f.featureId,
        ...(f.type === "limit" && {
          limit: Number(f.limit),
          limitType: f.limitType,
        }),
      })),
    };

    try {
      setIsSubmitting(true);
      if (isEdit && id) {
        const res = await adminServices.updateSubscriptionPlan(id, payload);
        toast.success(res.message);
      } else {
        const res = await adminServices.createSubscriptionPlan(payload);
        toast.success(res.message);
      }
      navigate("/admin/subscription/plans");
    } catch (error) {
      const apiError = parseApiError(error);
      toast.error(apiError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Features already selected (to avoid duplicates in dropdowns)
  const selectedFeatureIds = form.features.map((f) => f.featureId);

  return (
    <div className="text-white max-w-2xl mx-auto">
      <button
        onClick={() => navigate("/admin/subscription/plans")}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
      >
        <ArrowLeft size={20} />
        Back to Plans
      </button>

      <div className="bg-indigo-900/50 rounded-2xl p-8 backdrop-blur">
        <h1 className="text-2xl font-bold mb-8">
          {isEdit ? "Edit Plan" : "Create Plan"}
        </h1>

        {fetchLoading ? (
          <div className="text-purple-300 text-center py-10">Loading...</div>
        ) : (
          <div className="space-y-6">

            {/* Name */}
            <div>
              <label className="text-purple-200 text-sm block mb-2">
                Plan Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Pro Monthly"
                className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2.5 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-purple-200 text-sm block mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe this plan..."
                rows={3}
                className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2.5 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 resize-none transition"
              />
            </div>

            {/* Price & Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-purple-200 text-sm block mb-2">
                  Price (₹) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="e.g. 499"
                  className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2.5 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 transition"
                />
              </div>
              <div>
                <label className="text-purple-200 text-sm block mb-2">
                  Duration (days) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.durationInDays}
                  onChange={(e) => setForm({ ...form, durationInDays: e.target.value })}
                  placeholder="e.g. 30"
                  className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2.5 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 transition"
                />
              </div>
            </div>

            {/* Popular toggle */}
            <div className="flex items-center justify-between bg-indigo-800/40 border border-purple-700/40 rounded-lg px-4 py-3">
              <div>
                <p className="text-white text-sm font-medium">Mark as Popular</p>
                <p className="text-purple-300 text-xs mt-0.5">Highlights this plan with a "Popular" badge</p>
              </div>
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, isPopular: !prev.isPopular }))}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                  form.isPopular ? "bg-purple-600" : "bg-indigo-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                    form.isPopular ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Features */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-purple-200 text-sm font-medium">Features</label>
                <button
                  type="button"
                  onClick={addFeature}
                  className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-white border border-purple-600/50 hover:border-purple-400 rounded-lg px-3 py-1.5 transition"
                >
                  <Plus size={13} />
                  Add Feature
                </button>
              </div>

              {form.features.length === 0 && (
                <div className="text-purple-400/60 text-xs text-center py-6 border border-dashed border-purple-700/40 rounded-lg">
                  No features added yet. Click "Add Feature" to begin.
                </div>
              )}

              <div className="space-y-3">
                {form.features.map((feat, index) => {
                  const selectedFeature = availableFeatures.find((f) => f.featureId === feat.featureId);
                  const isLimit = selectedFeature?.type === "limit";

                  return (
                    <div
                      key={index}
                      className="bg-indigo-800/30 border border-purple-700/30 rounded-xl p-4 space-y-3"
                    >
                      {/* Feature select + remove */}
                      <div className="flex items-center gap-2">
                        <select
                          value={feat.featureId}
                          onChange={(e) => updateFeature(index, "featureId", e.target.value)}
                          className="flex-1 bg-indigo-800/50 border border-purple-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-400 transition"
                        >
                          <option value="">Select feature...</option>
                          {availableFeatures.map((f) => (
                            <option
                              key={f.featureId}
                              value={f.featureId}
                              disabled={selectedFeatureIds.includes(f.featureId) && feat.featureId !== f.featureId}
                            >
                              {f.title} ({f.type})
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {/* Limit fields — only shown when feature type is "limit" */}
                      {isLimit && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-purple-300 text-xs block mb-1">
                              Limit <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={feat.limit}
                              onChange={(e) => updateFeature(index, "limit", e.target.value)}
                              placeholder="e.g. 10"
                              className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-3 py-2 text-white text-sm placeholder-purple-400 focus:outline-none focus:border-purple-400 transition"
                            />
                          </div>
                          <div>
                            <label className="text-purple-300 text-xs block mb-1">
                              Limit Type <span className="text-red-400">*</span>
                            </label>
                            <select
                              value={feat.limitType}
                              onChange={(e) => updateFeature(index, "limitType", e.target.value)}
                              className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-400 transition"
                            >
                              <option value="">Select type...</option>
                              {LIMIT_TYPES.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}

                      {/* Boolean badge */}
                      {feat.featureId && !isLimit && (
                        <p className="text-xs text-green-400/80">
                          ✓ This feature is included as a boolean (on/off)
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || fetchLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? isEdit ? "Updating..." : "Creating..."
                : isEdit ? "Update Plan" : "Create Plan"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSubscriptionPlanForm;