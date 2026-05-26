import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import adminServices from "@/services/admin/admin.services";
import { useFetch } from "@/hooks/useFetch";
import type { SubscriptionFeature } from "@/interface/admin.interface";
import { FEATURE_TYPES } from "@/constants/subscription.constants";


import { parseApiError } from "@/api/error.helper";

const EMPTY_FORM: SubscriptionFeature = {
  title: "",
  description: "",
  type: FEATURE_TYPES[0],
};



const AdminSubscriptionFeatureForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<SubscriptionFeature>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: response, loading: fetchLoading } = useFetch(
    () => adminServices.getSubscriptionFeatureById(id as string),
    isEdit
  );

  useEffect(() => {
    const resData = (response)?.data;
    if (resData && isEdit) {
      setForm({
        title: resData.title ?? "",
        description: resData.description ?? "",
        type: resData.type,
      });
    }
  }, [response, isEdit]);


const handleSubmit = async () => {
  const payload: SubscriptionFeature = {
    title: form.title?.trim() ?? "",
    description: form.description?.trim() ?? "",
    type: form.type ?? "",
  };

  try {
    setIsSubmitting(true);
    if (isEdit && id) {
      const res = await adminServices.updateSubscriptionFeature(id, payload);
      toast.success(res.message);
    } else {
      const res = await adminServices.createSubscriptionFeature(payload);
      toast.success(res.message);
    }
    navigate("/admin/subscription/features");
  } catch (error: unknown) {
    const apiError = parseApiError(error);
    toast.error(apiError.message);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="text-white max-w-2xl mx-auto">
      <button
        onClick={() => navigate("/admin/subscription/features")}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
      >
        <ArrowLeft size={20} />
        Back to Features
      </button>

      <div className="bg-indigo-900/50 rounded-2xl p-8 backdrop-blur">
        <h1 className="text-2xl font-bold mb-8">
          {isEdit ? "Edit Feature" : "Create Feature"}
        </h1>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="text-purple-200 text-sm block mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.title ?? ""}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Advanced Analytics"
              disabled={isSubmitting || fetchLoading}
              className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2.5 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 transition disabled:opacity-50"
            />
          </div>


          {/* Description */}
          <div>
            <label className="text-purple-200 text-sm block mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.description ?? ""}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this feature provides to subscribers..."
              rows={4}
              disabled={isSubmitting || fetchLoading}
              className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2.5 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 resize-none transition disabled:opacity-50"
            />
          </div>

          {/* Type */}
          <div>
            <label className="text-purple-200 text-sm block mb-2">
              Feature Type <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-3">
              {FEATURE_TYPES.map((ft) => (
                <button
                  key={ft}
                  type="button"
                  disabled={isSubmitting || fetchLoading}
                  onClick={() => setForm((prev) => ({ ...prev, type: ft }))}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition capitalize ${
                    form.type === ft
                      ? ft === "boolean"
                        ? "bg-sky-600/80 border-sky-500 text-white"
                        : "bg-violet-600/80 border-violet-500 text-white"
                      : "border-purple-600 bg-indigo-800/50 text-purple-300 hover:border-purple-400 hover:text-white"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {ft === "boolean" ? "🔘 Boolean" : "🔢 Limit"}
                </button>
              ))}
            </div>
          </div>


          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || fetchLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
              ? "Update Feature"
              : "Create Feature"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSubscriptionFeatureForm;