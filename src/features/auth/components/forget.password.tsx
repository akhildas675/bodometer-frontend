import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { parseApiError } from "@/api/error.helper";

import InputWithIcon from "@/ui.components/ui/input.box";
import PrimaryButton from "@/ui.components/ui/primary.button";

import type { ForgotPasswordPayload } from "@/interface/auth.interface";
import { authService } from "@/modules/auth/service/auth.service";
import { useOtpStore } from "@/stores/otp.store";

const ForgetPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState<ForgotPasswordPayload>({
    email: "",
  });

  const handleChange =
    (field: keyof ForgotPasswordPayload) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const payload = {
    email: form.email,
  };


 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (loading) return;

  setLoading(true);

  try {
    const result = await authService.forgotPassword(payload);

    if (result.success) {
      toast.success(result.message);
      const role = result.data.role;
      if (!role) {
        toast.error(result.message || "No account found");
        return;
      }

      useOtpStore.getState().setOtpContext({
        email: form.email,
        role: role,
        purpose: "FORGET_PASSWORD",
      });

      navigate(`/${role}-otp`, { replace: true });
    }
  } catch (error: unknown) {
    const apiError = parseApiError(error);
    toast.error(apiError.message);
  } finally {
    setLoading(false); 
  }
};

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-[#03000D] to-[#190473] flex items-center justify-center">
      <div className="w-full max-w-6xl h-[600px] rounded-3xl overflow-hidden shadow-2xl flex bg-linear-to-b from-[#03000D] to-[#190473]">
        {/* LEFT IMAGE SECTION */}
        <div className="w-1/2 hidden md:block relative">
          <img
            src="https://bodometer-assets.s3.eu-north-1.amazonaws.com/bodometer_register_page_img.jpg"
            alt="Forgot password"
            className="h-full w-full object-cover"
          />

          {/* LOGO */}
          <div className="absolute top-6 left-6">
            <img
              src="/public/Bodometer Logo corrected 1.png"
              alt="Bodometer Logo"
              className="h-8 w-auto object-contain drop-shadow-lg"
            />
          </div>
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="flex-1 relative flex items-center justify-center px-6 sm:px-10 py-10 bg-linear-to-b from-[#03000D] to-[#190473]">
          {/* GLOW EFFECTS */}
          <div className="pointer-events-none absolute -top-32 -right-20 h-72 w-72 rounded-full bg-[#3a1b7a] opacity-40 blur-2xl" />
          <div className="pointer-events-none absolute bottom-[-120px] -left-10 h-80 w-80 rounded-full bg-[#24116b] opacity-40 blur-2xl" />

          <div className="relative w-full max-w-md">
            <h1 className="text-center text-3xl font-semibold text-indigo-300 tracking-wide mb-6">
              FORGOT PASSWORD
            </h1>

            <p className="text-center text-sm text-slate-300 mb-8">
              Enter your registered email address. We’ll send you a verification
              code.
            </p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <InputWithIcon
                icon={<Mail size={20} className="text-indigo-200" />}
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange("email")}
              />

              <PrimaryButton  text={loading ? "Sending Reset Code" : "Send Reset Code"} type="submit"
              loading={loading} />
            </form>

            <p className="text-center text-xs sm:text-sm text-slate-200 mt-6">
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-semibold text-indigo-400 hover:underline"
              >
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
