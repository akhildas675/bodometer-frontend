import { parseApiError } from "@/api/error.helper";
import { ADMIN_UI_ROUTES } from "@/constants/constant-routes/ui-routes/admin.ui-constant-routes";
import { MealCategory } from "@/interface/admin.interface";
import adminServices from "@/services/admin/admin.services";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const EMPTY_FORM: MealCategory = {
  title: "",
  description: "",
};

const AdminMealCategoryForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const isEditMode = !!id;

  const [form, setForm] = useState<MealCategory>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode && id) {
      const fetchCategory = async () => {
        try {
          const res = await adminServices.getMealCategoryById(id);
          setForm({
            title: res.title,
            description: res.description,
          });
        } catch (error: unknown) {
          toast.error(parseApiError(error).message);
          navigate(ADMIN_UI_ROUTES.MEAL_CATEGORY);
        } finally {
          setIsLoading(false);
        }
      };
      fetchCategory();
    }
  }, [id, isEditMode, navigate]);

  const handleSubmit = async () => {
    try {
      if (!form.title.trim() || !form.description.trim()) {
        toast.error("Please fill all required fields");
        return;
      }

      setIsSubmitting(true);
      
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
      };
      
      if (isEditMode && id) {
        const res = await adminServices.updateMealCategory(id, payload);
        toast.success(res.message);
      } else {
        const res = await adminServices.createMealCategory(payload);
        toast.success(res.message);
      }
      
      navigate(ADMIN_UI_ROUTES.MEAL_CATEGORY)
      if (!isEditMode) setForm(EMPTY_FORM);
    } catch (error: unknown) {
      const apiError = parseApiError(error);
      toast.error(apiError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-white text-center py-10">Loading...</div>;
  }

  return (
    <div className="text-white max-w-2xl mx-auto">
      <button
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
        onClick={() => navigate(ADMIN_UI_ROUTES.MEAL_CATEGORY)}
      >
        <ArrowLeft size={20} />
        Back to Meal Categories
      </button>

      <div className="bg-indigo-900/50 rounded-2xl p-8 backdrop-blur">
        <h1 className="text-2xl font-bold mb-8">
          {isEditMode ? "Edit Meal Category" : "Create Meal Category"}
        </h1>

        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="text-purple-200 text-sm block mb-2">
              Meal Category Name <span className="text-red-400">*</span>
            </label>

            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              type="text"
              placeholder="e.g. Breakfast"
              className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2.5 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-purple-200 text-sm block mb-2">
              Description <span className="text-red-400">*</span>
            </label>

            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={4}
              placeholder="Describe this meal category..."
              className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2.5 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 resize-none transition"
            />
          </div>

          {/* Submit */}
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition"
          onClick={handleSubmit}
          disabled={isSubmitting}
          >
            {isSubmitting ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update" : "Create")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminMealCategoryForm;
