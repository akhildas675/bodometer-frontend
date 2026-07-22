import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { parseApiError } from "@/api/error.helper";
import { useFetch } from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import { CoachingForm } from "@/modules/coaching/types/coaching.interface";
import { coachingService } from "@/modules/coaching/service/coaching.service";
import { ADMIN_UI_ROUTES } from "@/constants/constant-routes/ui-routes/admin.ui-constant-routes";
import {
  COACHING_DURATION,
  SLOT_DURATION_OPTIONS,
  BOOKING_MODE,
  BOOKING_MODE_OPTIONS,
} from "@/constants/booking.constant";

const EMPTY_FORM: CoachingForm = {
  serviceType: "",
  description: "",
  durationMinutes: COACHING_DURATION.THIRTY,
  price: 0,
  bookingMode: BOOKING_MODE.ONLINE,
};

const AdminCoachingForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<CoachingForm>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: response, loading: fetchLoading } = useFetch(
    () => coachingService.getCoachingServiceById(id as string),
    isEdit
  );

  useEffect(() => {
    if (response?.data && isEdit) {
      setForm({
        serviceType: response.data.serviceType || "",
        description: response.data.description || "",
        durationMinutes: response.data.durationMinutes || 30,
        price: response.data.price || 0,
        bookingMode: response.data.bookingMode || "Online",
      });
    }
  }, [response, isEdit]);

  const handleSubmit = async () => {
    if (!form.serviceType.trim()) {
      toast.error("Service Type is required");
      return;
    }
    if (!form.durationMinutes) {
      toast.error("Duration is required");
      return;
    }
    if (form.price < 0) {
      toast.error("Price must be a positive number");
      return;
    }

    try {
      setIsSubmitting(true);
      if (isEdit && id) {
        const res = await coachingService.updateCoachingService(id, form);
        toast.success(res.message || "Coaching service updated successfully");
      } else {
        const res = await coachingService.createCoaching(form);
        toast.success(res.message || "Coaching service created successfully");
      }
      navigate(ADMIN_UI_ROUTES.COACHING);
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
        onClick={() => navigate(ADMIN_UI_ROUTES.COACHING)}
        className="flex items-center gap-2 text-purple-300 hover:text-white mb-6 transition cursor-pointer"
      >
        <ArrowLeft size={20} />
        Back to Coaching Services
      </button>

      <div className="bg-indigo-900/50 rounded-2xl p-8 backdrop-blur border border-purple-800/40">
        <h1 className="text-2xl font-bold mb-8">
          {isEdit ? "Edit Coaching Service" : "Create Coaching Service"}
        </h1>

        <div className="space-y-6">
          {/* Service Type */}
          <div>
            <label className="text-purple-200 text-sm block mb-2 font-medium">
              Service Type <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.serviceType}
              onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
              placeholder="e.g. 1-on-1 Personal Training"
              className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2.5 text-white placeholder-purple-300/60 focus:outline-none focus:border-purple-400 transition"
            />
          </div>

          {/* Grid: Duration & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Duration */}
            <div>
              <label className="text-purple-200 text-sm block mb-2 font-medium">
                Duration (Minutes) <span className="text-red-400">*</span>
              </label>
              <select
                value={form.durationMinutes}
                onChange={(e) =>
                  setForm({ ...form, durationMinutes: Number(e.target.value) })
                }
                className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-400 transition cursor-pointer"
              >
                {SLOT_DURATION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-indigo-900 text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="text-purple-200 text-sm block mb-2 font-medium">
                Price ($) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price === 0 ? "" : form.price}
                onChange={(e) =>
                  setForm({
                    ...form,
                    price: e.target.value === "" ? 0 : Number(e.target.value),
                  })
                }
                placeholder="0.00"
                className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2.5 text-white placeholder-purple-300/60 focus:outline-none focus:border-purple-400 transition"
              />
            </div>
          </div>

          {/* Booking Mode */}
          <div>
            <label className="text-purple-200 text-sm block mb-2 font-medium">
              Booking Mode <span className="text-red-400">*</span>
            </label>
            <select
              value={form.bookingMode}
              onChange={(e) => setForm({ ...form, bookingMode: e.target.value })}
              className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-400 transition cursor-pointer"
            >
              {BOOKING_MODE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-indigo-900 text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="text-purple-200 text-sm block mb-2 font-medium">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe what this coaching service covers..."
              rows={4}
              className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2.5 text-white placeholder-purple-300/60 focus:outline-none focus:border-purple-400 resize-none transition"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || fetchLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
              ? "Update Coaching Service"
              : "Create Coaching Service"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCoachingForm;
