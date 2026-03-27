import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, X, Video, Image } from "lucide-react";
import { toast } from "sonner";

import adminService from "@/services/admin/admin.services";
import {
  TARGET_MUSCLES,
  EQUIPMENT_LIST,
  BENEFITS_LIST,
} from "@/constants/workout.constants";
import { WorkoutFormData } from "@/interface/workout.interface";

const EMPTY_FORM: WorkoutFormData = {
  workoutName: "",
  workoutDescription: "",
  workoutImage: null,
  coverPhoto: null,
  introVideo: null,
  targetMuscles: [],
  equipment: [],
  benefits: [],
};

const AdminWorkoutForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<WorkoutFormData>(EMPTY_FORM);
  const [previews, setPreviews] = useState({
    workoutImage: "",
    coverPhoto: "",
    introVideo: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [benefitInput, setBenefitInput] = useState("");

  useEffect(() => {
    if (!isEdit || !id) return;
    const fetchWorkout = async () => {
      try {
        setFetchLoading(true);
        const res = await adminService.getWorkoutById(id);
        const w = res.data;
        setForm({
          workoutName: w.workoutName,
          workoutDescription: w.workoutDescription,
          workoutImage: null,
          coverPhoto: null,
          introVideo: null,
          targetMuscles: w.targetMuscles || [],
          equipment: w.equipment || [],
          benefits: w.benefits || [],
        });
        setPreviews({
          workoutImage: w.workoutImage || "",
          coverPhoto: w.coverPhoto || "",
          introVideo: w.introVideo || "",
        });
      } catch {
        toast.error("Failed to fetch workout details");
        navigate("/admin/workouts");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchWorkout();
  }, [id, isEdit, navigate]);
  const handleFileChange = (
    field: "workoutImage" | "coverPhoto" | "introVideo",
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, [field]: file }));

    if (!file) {
      setPreviews((prev) => ({ ...prev, [field]: "" }));
      return;
    }

    if (field === "introVideo") {
      setPreviews((prev) => ({ ...prev, introVideo: file.name }));
    } else {
      const reader = new FileReader();
      reader.onloadend = () =>
        setPreviews((prev) => ({ ...prev, [field]: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const toggleMuscle = (muscle: string) => {
    setForm((prev) => ({
      ...prev,
      targetMuscles: prev.targetMuscles.includes(muscle)
        ? prev.targetMuscles.filter((m) => m !== muscle)
        : [...prev.targetMuscles, muscle],
    }));
  };

  const toggleEquipment = (item: string) => {
    setForm((prev) => ({
      ...prev,
      equipment: prev.equipment.includes(item)
        ? prev.equipment.filter((e) => e !== item)
        : [...prev.equipment, item],
    }));
  };

  const toggleBenefit = (benefit: string) => {
    setForm((prev) => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter((b) => b !== benefit)
        : [...prev.benefits, benefit],
    }));
  };

  const addCustomBenefit = () => {
    const trimmed = benefitInput.trim();
    if (!trimmed) return;
    if (form.benefits.includes(trimmed)) {
      toast.error("Already added");
      return;
    }
    setForm((prev) => ({ ...prev, benefits: [...prev.benefits, trimmed] }));
    setBenefitInput("");
  };

  const validate = (): boolean => {
    if (!form.workoutName.trim()) {
      toast.error("Workout name is required");
      return false;
    }
    if (!form.workoutDescription.trim()) {
      toast.error("Description is required");
      return false;
    }
    if (!isEdit && !form.workoutImage) {
      toast.error("Please select a thumbnail image");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const formData = new FormData();
    formData.append("workoutName", form.workoutName.trim());
    formData.append("workoutDescription", form.workoutDescription.trim());
    if (form.workoutImage) formData.append("workoutImage", form.workoutImage);
    if (form.coverPhoto) formData.append("coverPhoto", form.coverPhoto);
    if (form.introVideo) formData.append("introVideo", form.introVideo);

    form.targetMuscles.forEach((m) => formData.append("targetMuscles[]", m));
    form.equipment.forEach((e) => formData.append("equipment[]", e));
    form.benefits.forEach((b) => formData.append("benefits[]", b));

    try {
      setLoading(true);
      if (isEdit && id) {
        await adminService.updateWorkout(id, formData);
        toast.success("Workout updated successfully!");
      } else {
        await adminService.addWorkouts(formData);
        toast.success("Workout created successfully!");
      }
      navigate("/admin/workouts");
    } catch {
      toast.error(isEdit ? "Failed to update" : "Failed to create");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
    
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Loading...</div>
        </div>
     
    );
  }

  return (
   
      <div className="text-white max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/admin/workouts")}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft size={20} />
          Back to Workouts
        </button>

        <div className="bg-indigo-900/50 rounded-2xl p-8 backdrop-blur">
          <h1 className="text-2xl font-bold mb-8">
            {isEdit ? "Edit Workout Category" : "Create Workout Category"}
          </h1>

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="text-purple-200 text-sm block mb-2">
                Workout Name *
              </label>
              <input
                type="text"
                value={form.workoutName}
                onChange={(e) =>
                  setForm({ ...form, workoutName: e.target.value })
                }
                placeholder="e.g. Cardio"
                className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-purple-200 text-sm block mb-2">
                Description *
              </label>
              <textarea
                value={form.workoutDescription}
                onChange={(e) =>
                  setForm({ ...form, workoutDescription: e.target.value })
                }
                placeholder="Describe this workout category..."
                rows={3}
                className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 resize-none"
              />
            </div>

            {/* Media — 2 image uploads + 1 video URL */}
            <div className="grid grid-cols-2 gap-6">
              {/* Thumbnail Image */}
              <div>
                <label className="text-purple-200 text-sm block mb-2">
                  Thumbnail Image *
                  {isEdit && (
                    <span className="text-purple-400 text-xs ml-1">
                      (keep if empty)
                    </span>
                  )}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange("workoutImage", e)}
                  className="hidden"
                  id="thumbnail-upload"
                />
                <label
                  htmlFor="thumbnail-upload"
                  className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2 text-purple-300 cursor-pointer hover:bg-indigo-700/50 transition flex items-center justify-center gap-2"
                >
                  <Image size={16} />
                  Choose Thumbnail
                </label>
                {previews.workoutImage && (
                  <div className="relative mt-2">
                    <img
                      src={previews.workoutImage}
                      alt="Thumbnail"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setForm((prev) => ({ ...prev, workoutImage: null }));
                        setPreviews((prev) => ({ ...prev, workoutImage: "" }));
                      }}
                      className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 text-white hover:bg-red-600 transition"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
              {/* Cover Photo */}
              <div>
                <label className="text-purple-200 text-sm block mb-2">
                  Cover Photo
                  {isEdit && (
                    <span className="text-purple-400 text-xs ml-1">
                      (keep if empty)
                    </span>
                  )}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange("coverPhoto", e)}
                  className="hidden"
                  id="cover-upload"
                />
                <label
                  htmlFor="cover-upload"
                  className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2 text-purple-300 cursor-pointer hover:bg-indigo-700/50 transition flex items-center justify-center gap-2"
                >
                  <Image size={16} />
                  Choose Cover Photo
                </label>
                {previews.coverPhoto && (
                  <div className="relative mt-2">
                    <img
                      src={previews.coverPhoto}
                      alt="Cover"
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        console.error(
                          "Cover photo failed to load:",
                          previews.coverPhoto,
                        );
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <button
                      onClick={() => {
                        setForm((prev) => ({ ...prev, coverPhoto: null }));
                        setPreviews((prev) => ({ ...prev, coverPhoto: "" }));
                      }}
                      className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 text-white hover:bg-red-600 transition"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
              {/* Intro Video Upload */}
              <div className="col-span-2">
                <label className="text-purple-200 text-sm block mb-2">
                  Intro Video
                  {isEdit && (
                    <span className="text-purple-400 text-xs ml-1">
                      (keep if empty)
                    </span>
                  )}
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileChange("introVideo", e)}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2 text-purple-300 cursor-pointer hover:bg-indigo-700/50 transition flex items-center justify-center gap-2"
                >
                  <Video size={16} />
                  Choose Video
                </label>

                {/* Video preview*/}
                {previews.introVideo && (
                  <div className="relative mt-2 bg-indigo-800/30 rounded-lg p-3">
                    {form.introVideo ? (
                      <div className="flex items-center gap-3">
                        <Video size={18} className="text-purple-400 shrink-0" />
                        <span className="text-white text-sm truncate flex-1">
                          {form.introVideo.name}
                        </span>
                        <button
                          onClick={() => {
                            setForm((prev) => ({ ...prev, introVideo: null }));
                            setPreviews((prev) => ({
                              ...prev,
                              introVideo: "",
                            }));
                          }}
                          className="text-slate-400 hover:text-red-400 transition shrink-0"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <video
                          src={previews.introVideo}
                          controls
                          className="w-full rounded-lg max-h-48 object-cover"
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-purple-300 text-xs">
                            Current video
                          </span>
                          <button
                            onClick={() =>
                              setPreviews((prev) => ({
                                ...prev,
                                introVideo: "",
                              }))
                            }
                            className="text-slate-400 hover:text-red-400 transition text-xs flex items-center gap-1"
                          >
                            <X size={12} /> Remove
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>{" "}
              
            </div>

            {/* Target Muscles */}
            <div>
              <label className="text-purple-200 text-sm block mb-3">
                Target Muscles
                <span className="text-purple-400 text-xs ml-2">
                  ({form.targetMuscles.length} selected)
                </span>
              </label>
              <div className="flex flex-wrap gap-2">
                {TARGET_MUSCLES.map((muscle) => (
                  <button
                    key={muscle}
                    type="button"
                    onClick={() => toggleMuscle(muscle)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                      form.targetMuscles.includes(muscle)
                        ? "bg-purple-600 text-white border border-purple-500"
                        : "bg-indigo-800/50 border border-purple-600/40 text-purple-300 hover:border-purple-500"
                    }`}
                  >
                    {muscle}
                  </button>
                ))}
              </div>
            </div>

            {/* Equipment */}
            <div>
              <label className="text-purple-200 text-sm block mb-3">
                Equipment
                <span className="text-purple-400 text-xs ml-2">
                  ({form.equipment.length} selected)
                </span>
              </label>
              <div className="flex flex-wrap gap-2">
                {EQUIPMENT_LIST.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleEquipment(item)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                      form.equipment.includes(item)
                        ? "bg-purple-600 text-white border border-purple-500"
                        : "bg-indigo-800/50 border border-purple-600/40 text-purple-300 hover:border-purple-500"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <label className="text-purple-200 text-sm block mb-3">
                Benefits
                <span className="text-purple-400 text-xs ml-2">
                  (select or add custom)
                </span>
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {BENEFITS_LIST.map((benefit) => (
                  <button
                    key={benefit}
                    type="button"
                    onClick={() => toggleBenefit(benefit)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                      form.benefits.includes(benefit)
                        ? "bg-purple-600 text-white border border-purple-500"
                        : "bg-indigo-800/50 border border-purple-600/40 text-purple-300 hover:border-purple-500"
                    }`}
                  >
                    {benefit}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={benefitInput}
                  onChange={(e) => setBenefitInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomBenefit()}
                  placeholder="Add custom benefit..."
                  className="flex-1 bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2 text-white text-sm placeholder-purple-300 focus:outline-none focus:border-purple-400"
                />
                <button
                  onClick={addCustomBenefit}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
              {form.benefits.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.benefits.map((benefit, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1 px-3 py-1 bg-indigo-700/60 border border-purple-500/40 text-purple-200 rounded-full text-xs"
                    >
                      {benefit}
                      <button
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            benefits: prev.benefits.filter(
                              (_, idx) => idx !== i,
                            ),
                          }))
                        }
                        className="text-purple-400 hover:text-white transition"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                  ? "Update Workout"
                  : "Create Workout"}
            </button>
          </div>
        </div>
      </div>
   
  );
};

export default AdminWorkoutForm;
