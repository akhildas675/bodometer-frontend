
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Image, X} from "lucide-react";
import { toast } from "sonner";
import { parseApiError } from "@/api/error.helper";

import adminService from "@/services/admin/admin.services";
import { useFetch } from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import { Category } from "@/interface/category.interface";
const EMPTY_FORM: Category = {
  name: "",
  description: "",
  image: null,
};

const AdminCategoryForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<Category>(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: response, loading: fetchLoading } = useFetch(
    () => adminService.getCategoryById(id as string),
    isEdit
  );

  useEffect(() => {
  if (response?.data && isEdit) {
    setForm({
      name: response.data.name || "",
      description: response.data.description || "",
      image: null,
    });

    setImagePreview(response.data.image || "");
  }
}, [response, isEdit]);



  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, image: file }));
    if (!file) { setImagePreview(""); return; }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setForm((prev) => ({ ...prev, image: null }));
    setImagePreview("");
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    if (form.name) {
      formData.append("name", form.name.trim());
    }
    if (form.description) {
      formData.append("description", form.description.trim());
    }
    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      setIsSubmitting(true);
      if (isEdit && id) {
        const res = await adminService.updateCategory(id, formData);
        toast.success(res.message);
      } else {
        const res = await adminService.createCategory(formData);
        toast.success(res.message);
      }
      navigate("/admin/category");
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
        onClick={() => navigate("/admin/category")}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
      >
        <ArrowLeft size={20} />
        Back to Categories
      </button>

      <div className="bg-indigo-900/50 rounded-2xl p-8 backdrop-blur">
        <h1 className="text-2xl font-bold mb-8">
          {isEdit ? "Edit Category" : "Create Category"}
        </h1>

        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="text-purple-200 text-sm block mb-2">
              Category Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Cardio"
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
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe this category..."
              rows={4}
              className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2.5 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 resize-none transition"
            />
          </div>

          {/* Image upload */}
          <div>
            <label className="text-purple-200 text-sm block mb-2">
              Image{" "}
              {!isEdit && <span className="text-red-400">*</span>}
              {isEdit && (
                <span className="text-purple-400 text-xs ml-1">(keep if empty)</span>
              )}
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="category-image-upload"
            />
            <label
              htmlFor="category-image-upload"
              className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2.5 text-purple-300 cursor-pointer hover:bg-indigo-700/50 transition flex items-center justify-center gap-2"
            >
              <Image size={16} />
              Choose Image
            </label>

            {imagePreview && (
              <div className="relative mt-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 bg-black/60 rounded-full p-1 text-white hover:bg-red-600 transition"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Active toggle */}
       

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || fetchLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? isEdit ? "Updating..." : "Creating..."
              : isEdit ? "Update Category" : "Create Category"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCategoryForm;