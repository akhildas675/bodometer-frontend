import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { toast } from "sonner";

import InputWithIcon from "@/components/ui/input.box";
import PrimaryButton from "@/components/ui/primary.button";
import userServices from "@/services/user/user.services";
import { parseApiError } from "@/api/error.helper";

const UserChangePassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await userServices.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success(res.message);
      navigate("/profile");
    } catch (error) {
      const apiError = parseApiError(error);
      toast.error(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    
      <div className="text-white max-w-md mx-auto mt-10">
        <div className="bg-linear-to-br from-[#140b3a] to-[#0a0624] rounded-2xl p-8 border border-white/10">
          <h1 className="text-2xl font-semibold text-indigo-300 mb-2">
            Change Password
          </h1>
          <p className="text-slate-400 text-sm mb-8">
            Enter your current password and choose a new one.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <InputWithIcon
              icon={<Lock size={20} className="text-indigo-200" />}
              type="password"
              placeholder="Current password"
              value={form.currentPassword}
              onChange={handleChange("currentPassword")}
            />
            <InputWithIcon
              icon={<Lock size={20} className="text-indigo-200" />}
              type="password"
              placeholder="New password"
              value={form.newPassword}
              onChange={handleChange("newPassword")}
            />
            <InputWithIcon
              icon={<Lock size={20} className="text-indigo-200" />}
              type="password"
              placeholder="Confirm new password"
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
            />

            <PrimaryButton
              text={loading ? "Changing..." : "Change Password"}
              type="submit"
              loading={loading}
            />
          </form>

          <button
            onClick={() => navigate("/profile")}
            className="mt-4 w-full text-center text-sm text-slate-400 hover:text-white transition"
          >
            Back to Profile
          </button>
        </div>
      </div>
   
  );
};

export default UserChangePassword;