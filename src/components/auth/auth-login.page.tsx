import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Mail, Lock } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import InputWithIcon from "@/components/ui/input.box";
import PrimaryButton from "@/components/ui/primary.button";
import type { LoginPayload } from "@/interface/auth.interface";
import authService from "@/services/auth/auth.service";
import { useAuthStore, type AuthUser } from "@/stores/auth.store";
import { VERIFICATION_STATUS, type VerificationStatus } from "@/constants/verification.status";
import { parseApiError } from "@/api/error.helper";

const AuthLoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginPayload>({
    email: "",
    password: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("expired") === "true") {
      toast.error("Your session has expired. Please log in again to continue.", {
        id: "session-expired",
        duration: 5000,
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleChange =
    (field: keyof LoginPayload) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSuccess = (
    user: AuthUser,
    accessToken: string,
    message: string,
    trainerStatus?: { verificationStatus?: VerificationStatus | null; profileExists?: boolean | null },
    onboardingComplete?: boolean,
    hasActiveSubscription?: boolean
  ) => {
    const userWithFlags = {
      ...user,
      onboardingComplete,
      hasActiveSubscription,
    };
    useAuthStore.getState().setAuth({ user: userWithFlags, accessToken, trainerStatus });

    toast.success(message);

    if (user.role === "trainer") {
      const noProfile =
        !trainerStatus ||
        trainerStatus.profileExists === false ||
        trainerStatus.profileExists === undefined ||
        trainerStatus.profileExists === null;

      if (noProfile) {
        navigate("/trainer/onboarding/intro", { replace: true });
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
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await authService.login(form);
      const { user, accessToken, trainerStatus, onboardingComplete, hasActiveSubscription } = result.data;
      handleSuccess(user, accessToken, result.message, trainerStatus, onboardingComplete, hasActiveSubscription);
    } catch (error) {
      const apiError = parseApiError(error);
      toast.error(apiError.message, {
        duration: apiError.statusCode === 403 ? 5000 : 3000,
        style: apiError.statusCode === 403
          ? { background: "#ef4444", color: "#fff" }
          : undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credential: string) => {
    setLoading(true);
    try {
      const result = await authService.googleLogin({ idToken: credential });
      const { user, accessToken, trainerStatus, onboardingComplete, hasActiveSubscription } = result.data;
      handleSuccess(user, accessToken, result.message, trainerStatus, onboardingComplete, hasActiveSubscription);
    } catch (error) {
      const apiError = parseApiError(error);
      toast.error(apiError.message, {
        duration: apiError.statusCode === 403 ? 5000 : 3000,
        style: apiError.statusCode === 403
          ? { background: "#ef4444", color: "#fff" }
          : undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-[#03000D] to-[#190473] flex items-center justify-center">
      <div className="w-full max-w-6xl h-[600px] rounded-3xl overflow-hidden shadow-2xl flex bg-linear-to-b from-[#03000D] to-[#190473]">
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
        <div className="flex-1 relative flex items-center justify-center px-6 sm:px-10 py-10 bg-linear-to-b from-[#03000D] to-[#190473]">
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