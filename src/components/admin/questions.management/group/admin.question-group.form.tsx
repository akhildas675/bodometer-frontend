import { useEffect, useState, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

import adminServices from "@/services/admin/admin.services";
import { ADMIN_UI_ROUTES } from "@/constants/constant-routes/ui-routes/admin.ui-constant-routes";

import { parseApiError } from "@/api/error.helper";

interface FormData {
  key: string;
  title: string;
  order: number;
}

const EMPTY_FORM: FormData = {
  key: "",
  title: "",
  order: 1,
};

const AdminQuestionGroupForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit && id) {
      setFetching(true);
      adminServices
        .getQuestionGroupById(id)
        .then((res) => {
          if (res.data) {
            setForm({
              key: res.data.key ?? "",
              title: res.data.title ?? "",
              order: res.data.order ?? 1,
            });
          }
        })
        .catch((error) => {
          const apiError = parseApiError(error);
          toast.error(apiError.message);
        })
        .finally(() => setFetching(false));
    }
  }, [isEdit, id]);


  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      if (isEdit && id) {
        const res = await adminServices.updateQuestionGroup(id, {
          title: form.title.trim(),
          order: Number(form.order),
        });
        toast.success(res.message);
      } else {
        const res = await adminServices.createQuestionGroup({
          key: "",
          title: form.title.trim(),
          order: Number(form.order),
        });
        toast.success(res.message);
      }
      navigate(ADMIN_UI_ROUTES.QUESTION_GROUPS);
    } catch (error) {
      const apiError = parseApiError(error);
      toast.error(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="text-white max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition mb-6"
      >
        <ChevronLeft size={20} />
        <span>Back to Groups</span>
      </button>

      <div className="bg-[#0c0624]/60 backdrop-blur-md border border-purple-900/50 rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-6">
          {isEdit ? "Edit Question Group" : "Create Question Group"}
        </h1>

        <form onSubmit={onSubmit} className="space-y-6">
          {isEdit && (
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                System Reference Key
              </label>
              <input
                value={form.key}
                disabled
                className="w-full bg-[#050017]/50 border border-purple-900/50 rounded-lg px-4 py-2.5 text-white outline-none opacity-60"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              Display Title <span className="text-red-400">*</span>
            </label>
            <input
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              required
              className="w-full bg-[#050017]/50 border border-purple-900/50 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="e.g. Basic Information"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              Sort Order <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) }))}
              required
              min="1"
              className="w-full bg-[#050017]/50 border border-purple-900/50 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="1"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isEdit ? (
                "Update Group"
              ) : (
                "Create Group"
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate(ADMIN_UI_ROUTES.QUESTION_GROUPS)}
              className="flex-1 border border-purple-800 hover:bg-purple-900/20 text-purple-300 font-medium py-2.5 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminQuestionGroupForm;
