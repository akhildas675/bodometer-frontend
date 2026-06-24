import { parseApiError } from "@/api/error.helper";
import { ADMIN_UI_ROUTES } from "@/constants/constant-routes/ui-routes/admin.ui-constant-routes";
import { equipmentService } from "@/modules/equipment/service/equipment.service";
import adminServices from "@/services/admin/admin.services";
import { Image, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const EMPTY_FORM = {
  title: "",
  description: "",
  image: null as File | null,
};

const AdminEquipmentForm = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("edit");
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      const fetchEquipment = async () => {
        try {
          const res = await equipmentService.getEquipmentById(id);
          const data = res.data;

          setForm({
            title: data.title,
            description: data.description,
            image: null,
          });
          if (data.image) {
            setImagePreview(data.image);
          }
        } catch  {
          toast.error("Failed to fetch equipment");
        }
      };
      fetchEquipment();
    }
  }, [id, isEdit]);


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) { setImagePreview(""); return }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    setForm((prev) => ({ ...prev, image: file }));
  }

  const clearImage = () => {
    setForm((prev) => ({ ...prev, image: null }));
    setImagePreview("");
  };


  const handleSubmit = async () => {
    const formData = new FormData();
    if (form.title) formData.append("title", form.title.trim());
    if (form.description) formData.append("description", form.description.trim());
    if (form.image) formData.append("image", form.image);

    try {
      setIsSubmitting(true);

      if (isEdit && id) {
        const res = await equipmentService.updateEquipment(id, formData);
        toast.success(res.message);
      } else {
        const res = await equipmentService.createEquipment(formData);
        toast.success(res.message);
      }
      
      navigate(ADMIN_UI_ROUTES.EQUIPMENT);

    } catch (error: unknown) {
      const apiError = parseApiError(error);
      toast.error(apiError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="text-white max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition cursor-pointer">
        Back
      </button>

      <div className="bg-indigo-900/50 rounded-2xl p-8 backdrop-blur">
        <h1 className="text-2xl font-bold mb-8 text-purple-500">
          Equipment Form
        </h1>

        <div className="space-y-6">

          <div>
            <label className="text-purple-200 text-sm block mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Dumbbell"
              className="w-full bg-indigo-800/50 border-purple-600 rounded-lg px-4 py-2.5 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 transition disabled:opacity-50"
            />
          </div>

          <div>
            <label className="text-purple-200 text-sm block mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.description}
              placeholder="Describe this equipment"
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-indigo-800/50 border-purple-600 rounded-lg px-4 py-2.5 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 transition disabled:opacity-50"
            />
          </div>

          <div>
            <label className="text-purple-200 text-sm block mb-2">
              Image {isEdit ? "" : <span className="text-red-400">*</span>}
            </label>
            <input
              id="equipment-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label htmlFor="equipment-image-upload"
              className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2.5 text-purple-300 cursor-pointer hover:bg-indigo-700/50 transition flex items-center justify-center gap-2"
            >
              <Image size={16} />
              Choose Image
            </label>

            {imagePreview && (
              <div className="relative mt-4">
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

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 px-4 rounded-lg transition cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : isEdit ? "Update" : "Create"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default AdminEquipmentForm;
