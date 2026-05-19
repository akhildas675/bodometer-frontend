import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { toast } from "sonner";

import InputWithIcon from "@/components/ui/input.box";
import PrimaryButton from "@/components/ui/primary.button";
import { useOtpStore } from "@/stores/otp.store";
import authService from "@/services/auth/auth.service";
import { parseApiError } from "@/api/error.helper";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading,setLoading]=useState(false)
  const navigate=useNavigate()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { email, purpose } = useOtpStore.getState();

      if (!email || purpose !== "FORGET_PASSWORD") {
        toast.error("Session expired. Try again.");
        return;
      }

      const result = await authService.resetPassword({
        email,
        password,
        purpose,
      });

      toast.success(result.message);
      useOtpStore.getState().clearOtpContext();
      navigate("/login", { replace: true });
    } catch (error) {
      const apiError = parseApiError(error);
      if (apiError.statusCode === 403) {
        toast.error(apiError.message, {
          duration: 5000,
          style: {
            background: "#ef4444",
            color: "#fff",
          },
        });
      } else {
        toast.error(apiError.message);
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen w-full bg-linear-to-b from-[#03000D] to-[#190473] flex items-center justify-center">
      <div className="w-full max-w-6xl h-[600px] rounded-3xl overflow-hidden shadow-2xl flex bg-linear-to-b from-[#03000D] to-[#190473]">

        {/* LEFT IMAGE */}
        <div className="w-1/2 hidden md:block relative">
          <img
            src="https://bodometer-assets.s3.eu-north-1.amazonaws.com/bodometer_register_page_img.jpg"
            alt="Reset password"
            className="h-full w-full object-cover"
          />

          <div className="absolute top-6 left-6">
            <img
              src="/public/Bodometer Logo corrected 1.png"
              alt="Bodometer Logo"
              className="h-8 w-auto object-contain drop-shadow-lg"
            />
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="flex-1 relative flex items-center justify-center px-6 sm:px-10 py-10 bg-gradient-to-b from-[#03000D] to-[#190473]">

          {/* GLOW EFFECTS */}
          <div className="pointer-events-none absolute -top-32 -right-20 h-72 w-72 rounded-full bg-[#3a1b7a] opacity-40 blur-2xl" />
          <div className="pointer-events-none absolute bottom-[-120px] -left-10 h-80 w-80 rounded-full bg-[#24116b] opacity-40 blur-2xl" />

          <div className="relative w-full max-w-md">
            <h1 className="text-center text-3xl font-semibold text-indigo-300 tracking-wide mb-6">
              RESET PASSWORD
            </h1>

            <p className="text-center text-sm text-slate-300 mb-8">
              Enter a new password for your account.
            </p>

            <form className="space-y-5" onSubmit={handleResetPassword}>
              <InputWithIcon
                icon={<Lock size={20} className="text-indigo-200" />}
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <InputWithIcon
                icon={<Lock size={20} className="text-indigo-200" />}
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <PrimaryButton
                text="Reset Password"
                type="submit"
                loading={loading}
              />
            </form>

            <p className="text-center text-xs sm:text-sm text-slate-200 mt-6">
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

export default ResetPassword;
