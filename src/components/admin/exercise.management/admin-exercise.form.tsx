import { parseApiError } from "@/api/error.helper";
import { ADMIN_UI_ROUTES } from "@/constants/constant-routes/ui-routes/admin.ui-constant-routes";
import { DIFFICULTY_LEVEL, WORKOUT_ENVIRONMENT } from "@/constants/fitness.constant";
import type { ExerciseFormData } from "@/interface/exercise.interface";

import adminServices from "@/services/admin/admin.services";
import { Image, X, Plus, Trash2, ChevronLeft, Video } from "lucide-react";

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useFetch } from "@/hooks/useFetch";

const EMPTY_FORM: ExerciseFormData = {
  title: "",
  description: "",
  instructions: [""],
  categoryIds: [],
  targetMuscleIds: [],
  equipmentIds: [],
  workoutEnvironments: [],
  difficulty: DIFFICULTY_LEVEL.BEGINNER,

  isCompound: false,
  video: null,
  videoUrl: "",
  image: null,
};


// Reusable multi-select badge component
const MultiSelectBadges = ({
  options,
  selected,
  onChange,
  label,
}: {
  options: { id: string; label: string }[];
  selected: string[];
  onChange: (ids: string[]) => void;
  label: string;
}) => {
  const toggle = (id: string) => {
    onChange(
      selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]
    );
  };

  return (
    <div>
      <label className="text-purple-200 text-sm block mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggle(opt.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${active
                  ? "bg-purple-600/80 border-purple-400 text-white shadow-[0_0_8px_rgba(139,92,246,0.4)]"
                  : "bg-indigo-900/40 border-purple-700/50 text-purple-300 hover:border-purple-500"
                }`}
            >
              {active && <span className="mr-1">✓</span>}
              {opt.label}
            </button>
          );
        })}
        {options.length === 0 && (
          <p className="text-purple-400/60 text-xs italic">No options available</p>
        )}
      </div>
    </div>
  );
};

type SelectOption = { id: string; label: string };

const AdminExerciseForm = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("edit");
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<ExerciseFormData>(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState("");
  const [videoPreview, setVideoPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);



  const [targetMuscleOptions, setTargetMuscleOptions] = useState<SelectOption[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([]);
  const [equipmentOptions, setEquipmentOptions] = useState<SelectOption[]>([]);


  const workoutEnvironmentOptions: SelectOption[] = Object.entries(WORKOUT_ENVIRONMENT).map(
    ([key, value]) => ({
      id: value,
      label: key.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" "),
    })
  );

  const { data: optionsData, error: optionsError } = useFetch(async () => {
    const [musclesRes, categoriesRes, equipmentRes] = await Promise.all([
      adminServices.getAllTargetMuscles({ limit: 100 }),
      adminServices.getAllCategories({ limit: 100 }),
      adminServices.getAllEquipment({ limit: 100 }),
    ]);
    return { musclesRes, categoriesRes, equipmentRes };
  });

  useEffect(() => {
    if (optionsError) {
      toast.error("Failed to load options");
    } else if (optionsData) {
      setTargetMuscleOptions(
        optionsData.musclesRes.data.map((m) => ({ id: m.targetMuscleId, label: m.title }))
      );
      setCategoryOptions(
        optionsData.categoriesRes.data.map((c) => ({ id: c.categoryId, label: c.name || "Unnamed Category" }))
      );
      setEquipmentOptions(
        optionsData.equipmentRes.data.map((e) => ({ id: e.equipmentId, label: e.title }))
      );
    }
  }, [optionsData, optionsError]);

  // Load exercise for edit
  const { data: exerciseRes, error: exerciseError } = useFetch(
    async () => (isEdit && id ? await adminServices.getExerciseById(id) : null),
    isEdit && !!id
  );

  useEffect(() => {
    if (exerciseError) {
      toast.error("Failed to fetch exercise");
    } else if (exerciseRes?.data) {
      const data = exerciseRes.data;

      setForm({
        title: data.title,
        description: data.description,
        instructions: data.instructions?.length ? data.instructions : [""],
        categoryIds: data.categoryIds ?? [],
        targetMuscleIds: data.targetMuscleIds ?? [],
        equipmentIds: data.equipmentIds ?? [],
        workoutEnvironments: data.workoutEnvironments ?? [],
        difficulty: data.difficulty,
        isCompound: data.isCompound,
        video: null,
        videoUrl: data.media?.videoUrl ?? "",
        image: null,
      });

      if (data.media?.image) {
        setImagePreview(data.media.image);
      }
      if (data.media?.videoUrl) {
        setVideoPreview(data.media.videoUrl);
      }
    }
  }, [exerciseRes, exerciseError]);


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) { setImagePreview(""); return; }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    setForm((prev) => ({ ...prev, image: file }));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      if (!file.type.startsWith("video/")) {
        toast.error("Please select a valid video file");
        return;
      }
      setForm({ ...form, video: file });
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setForm((prev) => ({ ...prev, image: null }));
    setImagePreview("");
  };

  const clearVideo = () => {
    setForm((prev) => ({ ...prev, video: null, videoUrl: "" }));
    setVideoPreview("");
  };

  // Instructions management
  const addInstruction = () => setForm((prev) => ({ ...prev, instructions: [...prev.instructions, ""] }));
  const removeInstruction = (i: number) =>
    setForm((prev) => ({
      ...prev,
      instructions: prev.instructions.filter((_, idx) => idx !== i),
    }));
  const updateInstruction = (i: number, value: string) =>
    setForm((prev) => ({
      ...prev,
      instructions: prev.instructions.map((ins, idx) => (idx === i ? value : ins)),
    }));

  const handleSubmit = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    if (!form.description.trim()) { toast.error("Description is required"); return; }
    if (!isEdit && !form.image) { toast.error("Image is required"); return; }

    const formData = new FormData();
    formData.append("title", form.title.trim());
    formData.append("description", form.description.trim());
    formData.append("difficulty", form.difficulty);
    formData.append("isCompound", String(form.isCompound));

    const validInstructions = form.instructions.filter((i) => i.trim());
    formData.append("instructions", JSON.stringify(validInstructions));
    formData.append("categoryIds", JSON.stringify(form.categoryIds));
    formData.append("targetMuscleIds", JSON.stringify(form.targetMuscleIds));
    formData.append("equipmentIds", JSON.stringify(form.equipmentIds));
    formData.append("workoutEnvironments", JSON.stringify(form.workoutEnvironments));

    if (form.video) formData.append("video", form.video);

    if (form.image) formData.append("image", form.image);


    try {
      setIsSubmitting(true);
      if (isEdit && id) {
        const res = await adminServices.updateExercise(id, formData);
        toast.success(res.message || "Exercise updated successfully");
      } else {
        const res = await adminServices.createExercise(formData);
        toast.success(res.message || "Exercise created successfully");
      }
      navigate(ADMIN_UI_ROUTES.EXERCISES);
    } catch (error: unknown) {
      const apiError = parseApiError(error);
      toast.error(apiError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full bg-indigo-800/50 border border-purple-700/50 rounded-lg px-4 py-2.5 text-white placeholder-purple-400/60 focus:outline-none focus:border-purple-400 transition disabled:opacity-50";
  const labelClass = "text-purple-200 text-sm block mb-2";

  return (
    <div className="text-white max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition cursor-pointer group"
      >
        <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      <div className="bg-linear-to-b from-indigo-900/60 to-indigo-900/30 rounded-2xl p-8 backdrop-blur border border-purple-800/30 shadow-[0_0_30px_rgba(139,92,246,0.1)]">
        <h1 className="text-2xl font-bold mb-8 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-indigo-400">
          {isEdit ? "Edit Exercise" : "Create Exercise"}
        </h1>

        <div className="space-y-6">

          {/* Title */}
          <div>
            <label className={labelClass}>
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Barbell Squat"
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe this exercise..."
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Difficulty & Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Difficulty <span className="text-red-400">*</span></label>
              <select
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value as ExerciseFormData["difficulty"] })}
                className={inputClass}
              >
                {Object.entries(DIFFICULTY_LEVEL).map(([key, val]) => (
                  <option key={key} value={val}>
                    {key.charAt(0) + key.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Exercise Type</label>
              <div className="flex gap-3 mt-1">
                {[false, true].map((val) => (
                  <button
                    key={String(val)}
                    type="button"
                    onClick={() => setForm({ ...form, isCompound: val })}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all duration-200 ${form.isCompound === val
                        ? "bg-purple-600/80 border-purple-400 text-white shadow-[0_0_10px_rgba(139,92,246,0.3)]"
                        : "bg-indigo-900/40 border-purple-700/50 text-purple-300 hover:border-purple-500"
                      }`}
                  >
                    {val ? "Compound" : "Isolation"}
                  </button>
                ))}
              </div>
            </div>
          </div>

               {/* Image Upload */}
          <div>
            <label className={labelClass}>
              Image {!isEdit && <span className="text-red-400">*</span>}
            </label>
            <input
              id="exercise-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="exercise-image-upload"
              className="w-full bg-indigo-800/50 border border-purple-700/50 rounded-lg px-4 py-2.5 text-purple-300 cursor-pointer hover:bg-indigo-700/50 hover:border-purple-500 transition flex items-center justify-center gap-2"
            >
              <Image size={16} />
              {form.image ? form.image.name : "Choose Image"}
            </label>

            {imagePreview && (
              <div className="relative mt-4 rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-52 object-cover rounded-lg"
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

          {/* Video Upload */}
          <div>
            <label className={labelClass}>
              Video
            </label>
            <input
              id="exercise-video-upload"
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="hidden"
            />
            <label
              htmlFor="exercise-video-upload"
              className="w-full bg-indigo-800/50 border border-purple-700/50 rounded-lg px-4 py-2.5 text-purple-300 cursor-pointer hover:bg-indigo-700/50 hover:border-purple-500 transition flex items-center justify-center gap-2"
            >
              <Video size={16} />
              {form.video ? form.video.name : "Choose Video"}
            </label>

            {videoPreview && (
              <div className="relative mt-4 rounded-lg overflow-hidden bg-black/40">
                <video
                  src={videoPreview}
                  controls
                  className="w-full max-h-64 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={clearVideo}
                  className="absolute top-2 right-2 bg-black/60 rounded-full p-1 text-white hover:bg-red-600 transition"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={`${labelClass} mb-0`}>Instructions</label>
              <button
                type="button"
                onClick={addInstruction}
                className="flex items-center gap-1 text-purple-400 hover:text-purple-200 text-xs transition"
              >
                <Plus size={14} /> Add Step
              </button>
            </div>
            <div className="space-y-2">
              {form.instructions.map((ins, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="text-purple-400/60 text-xs mt-3 w-5 text-right shrink-0">{i + 1}.</span>
                  <input
                    type="text"
                    value={ins}
                    onChange={(e) => updateInstruction(i, e.target.value)}
                    placeholder={`Step ${i + 1}...`}
                    className={`${inputClass} flex-1`}
                  />
                  {form.instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInstruction(i)}
                      className="mt-2 text-red-400/60 hover:text-red-400 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Target Muscles */}
          <MultiSelectBadges
            options={targetMuscleOptions}
            selected={form.targetMuscleIds}
            onChange={(ids) => setForm({ ...form, targetMuscleIds: ids })}
            label="Target Muscles"
          />

          {/* Categories */}
          <MultiSelectBadges
            options={categoryOptions}
            selected={form.categoryIds}
            onChange={(ids) => setForm({ ...form, categoryIds: ids })}
            label="Categories"
          />

          {/* Workout Environments */}
          <MultiSelectBadges
            options={workoutEnvironmentOptions}
            selected={form.workoutEnvironments}
            onChange={(ids) => setForm({ ...form, workoutEnvironments: ids })}
            label="Workout Environments"
          />

          {/* Equipment */}

          <MultiSelectBadges
            options={equipmentOptions}
            selected={form.equipmentIds}
            onChange={(ids) => setForm({ ...form, equipmentIds: ids })}
            label="Equipment"
          />

     

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] cursor-pointer"
          >
            {isSubmitting ? "Submitting..." : isEdit ? "Update Exercise" : "Create Exercise"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default AdminExerciseForm;
