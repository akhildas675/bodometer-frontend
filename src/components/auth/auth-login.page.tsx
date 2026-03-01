import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Mail, Lock } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

import InputWithIcon from "@/components/ui/input.box";
import PrimaryButton from "@/components/ui/primary.button";

import type { LoginPayload } from "@/interface/auth.interface";
import authService from "@/services/auth/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { VERIFICATION_STATUS } from "@/constants/verification.status";

const AuthLoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginPayload>({
    email: "",
    password: "",
  });

  const handleChange =
    (field: keyof LoginPayload) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    if (!form.email) return toast.error("Email is required");
    if (!form.password) return toast.error("Password is required");

    setLoading(true);

    try {
      const result = await authService.login({
        email: form.email,
        password: form.password,
      });

      const { user, accessToken, trainerStatus } = result.data;

    
      useAuthStore.getState().setAuth({ user, accessToken, trainerStatus });

      toast.success(`Welcome back, ${user.name || "User"}!`);

      console.log("Trainer status..........",trainerStatus)

     
      if (user.role === "trainer") {
        
        // No profile yet → go to onboarding
        const noProfile =
          !trainerStatus ||
          trainerStatus.profileExists === false ||
          trainerStatus.profileExists === undefined ||
          trainerStatus.profileExists === null;

        if (noProfile) {
          navigate("/trainer/onboarding-experience", { replace: true }); 
          return;
        }

        // Profile exists route by verification status
        switch (trainerStatus.verificationStatus) {
          case VERIFICATION_STATUS.APPROVED:
            navigate("/trainer", { replace: true });
            return;

          case VERIFICATION_STATUS.PENDING:
            toast.info("Please wait for admin approval");
            navigate("/trainer/status", { replace: true });
            return;

          case VERIFICATION_STATUS.REJECTED:
            navigate("/trainer/status", { replace: true });
            return;

          default:
            toast.error("Unexpected trainer status. Please contact support.");
            return;
        }
      }

      
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
        return;
      }

      // ── USER ──────────────────────────────────────────────────
      if (user.role === "user") {
        navigate("/", { replace: true });
        return;
      }

      toast.error("Unknown role. Please contact support.");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || "Login failed");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credential: string) => {
    try {
      const result = await authService.googleLogin({ idToken: credential });
      const { user, accessToken, trainerStatus } = result.data;

      useAuthStore.getState().setAuth({ user, accessToken, trainerStatus }); 

      toast.success(`Welcome back, ${user.name || "User"}!`);

      if (user.role === "trainer") {
        // Google login trainers
        const noProfile =
          !trainerStatus ||
          trainerStatus.profileExists === false ||
          trainerStatus.profileExists === undefined ||
          trainerStatus.profileExists === null;

        if (noProfile) {
          navigate("/trainer/onboarding-experience", { replace: true });
          return;
        }

        if (trainerStatus.verificationStatus === VERIFICATION_STATUS.APPROVED) {
          navigate("/trainer", { replace: true });
        } else {
          navigate("/trainer/status", { replace: true });
        }
      } else if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data?.message || "Login failed";
        toast.error(errorMessage, {
          duration: error.response.status === 403 ? 5000 : 3000,
          style: error.response.status === 403
            ? { background: "#ef4444", color: "#fff" }
            : undefined,
        });
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#03000D] to-[#190473] flex items-center justify-center">
      <div className="w-full max-w-6xl h-[600px] rounded-3xl overflow-hidden shadow-2xl flex bg-gradient-to-b from-[#03000D] to-[#190473]">
        {/* Left image */}
        <div className="w-1/2 hidden md:block relative">
          <img
            src="https://bodometer-assets.s3.eu-north-1.amazonaws.com/bodometer_register_page_img.jpg"
            alt="Bodometer login"
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

        {/* Right form */}
        <div className="flex-1 relative flex items-center justify-center px-6 sm:px-10 py-10 bg-gradient-to-b from-[#03000D] to-[#190473]">
          <div className="pointer-events-none absolute -top-32 -right-20 h-72 w-72 rounded-full bg-[#3a1b7a] opacity-40 blur-2xl" />
          <div className="pointer-events-none absolute bottom-[-120px] -left-10 h-80 w-80 rounded-full bg-[#24116b] opacity-40 blur-2xl" />

          <div className="relative w-full max-w-md">
            <h1 className="text-center text-3xl font-semibold text-indigo-300 tracking-wide mb-8">
              LOGIN
            </h1>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <InputWithIcon
                icon={<Mail size={20} className="text-indigo-200" />}
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange("email")}
              />
              <InputWithIcon
                icon={<Lock size={20} className="text-indigo-200" />}
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange("password")}
              />
              <PrimaryButton
                text={loading ? "Logging in..." : "Login"}
                type="submit"
                loading={loading}
              />
            </form>

            <div className="text-right mt-4">
              <Link to="/forgot-password" className="text-xs text-indigo-400 hover:underline">
                Forgot password?
              </Link>
            </div>

            <div className="mt-4 flex justify-center">
              <GoogleLogin
                onSuccess={(res) => {
                  if (!res.credential) return toast.error("Google login failed");
                  handleGoogleSuccess(res.credential);
                }}
                onError={() => toast.error("Google login failed")}
              />
            </div>

            <div className="flex items-center gap-4 my-6">
              <div className="h-px flex-1 bg-slate-600" />
              <span className="text-xs uppercase tracking-[0.2em] text-slate-300">or</span>
              <div className="h-px flex-1 bg-slate-600" />
            </div>

            <p className="text-center text-xs sm:text-sm text-slate-200">
              If you don't have an account, please{" "}
              <Link to="/register" className="font-semibold text-indigo-400 hover:underline">
                Register as User
              </Link>{" "}
              or{" "}
              <Link to="/register/trainer" className="font-semibold text-indigo-400 hover:underline">
                Register as Trainer
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLoginPage;