import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock, CheckCircle } from "lucide-react";
import { useState } from "react";
import type {
  AuthRegisterPageProps,
  RegisterPayload,
} from "../../interface/auth.interface";
import { toast } from "sonner";
import PrimaryButton from "../ui/primary.button";
import InputWithIcon from "../ui/input.box";
import authService from "../../services/auth/auth.service";
import { useOtpStore } from "../../stores/otp.store";

const AuthRegisterPage: React.FC<AuthRegisterPageProps> = ({ role }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<RegisterPayload>({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange =
    (field: keyof RegisterPayload) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const payload = {
    name: form.name,
    email: form.email,
    phoneNumber: form.phoneNumber,
    password: form.password,
    confirmPassword: form.confirmPassword,
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    if (!form.name) return toast.error("Name is required");
    if (!form.email) return toast.error("Email is required");
    if (!form.phoneNumber) return toast.error("Phone Number is required");
    if (!form.password) return toast.error("Password is required");
    if (!form.confirmPassword)
      return toast.error("Confirm Password is required");
    if (form.password !== form.confirmPassword)
      return toast.error("Passwords do not match");

    setLoading(true);

    try {
      const result = await authService.register(role, payload);

      if (result.success) {
        useOtpStore.getState().setOtpContext({
          email: form.email,
          role,
          purpose: role === "trainer" ? "TRAINER_REGISTER" : "USER_REGISTER",
          registerData: payload,
        });

        navigate(`/${role}-otp`);
      }
    } catch {
      toast.error("Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-[#03000D] to-[#190473] flex items-center justify-center">
      <div className="w-full max-w-6xl h-[600px] rounded-3xl overflow-hidden shadow-2xl flex bg-linear-to-b from-[#03000D] to-[#190473]">
        {/* Left image section */}
        <div className="w-1/2 hidden md:block relative">
          <img
            src="https://bodometer-assets.s3.eu-north-1.amazonaws.com/bodometer_register_page_img.jpg"
            alt="Bodometer registration"
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

        {/* Right form section */}
        <div className="flex-1 relative flex items-center justify-center px-6 sm:px-10 py-10 bg-gradient-to-b from-[#03000D] to-[#190473]">
          {/* Glow effects */}
          <div className="pointer-events-none absolute -top-32 -right-20 h-72 w-72 rounded-full bg-[#3a1b7a] opacity-40 blur-2xl" />
          <div className="pointer-events-none absolute bottom-[-120px] -left-10 h-80 w-80 rounded-full bg-[#24116b] opacity-40 blur-2xl" />

          <div className="relative w-full max-w-md">
            <h1 className="text-center text-3xl font-semibold text-indigo-300 tracking-wide mb-8">
              SIGN UP
            </h1>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <InputWithIcon
                icon={<User size={20} className="text-indigo-200" />}
                type="text"
                value={form.name}
                placeholder="Name"
                onChange={handleChange("name")}
              />
              <InputWithIcon
                icon={<Mail size={20} className="text-indigo-200" />}
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange("email")}
              />
              <InputWithIcon
                icon={<Phone size={20} className="text-indigo-200" />}
                type="tel"
                placeholder="Phone Number"
                value={form.phoneNumber}
                onChange={handleChange("phoneNumber")}
              />
              <InputWithIcon
                icon={<Lock size={20} className="text-indigo-200" />}
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange("password")}
              />
              <InputWithIcon
                icon={<CheckCircle size={20} className="text-indigo-200" />}
                type="password"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange("confirmPassword")}
              />
              ...
              <PrimaryButton
                text={loading ? "Registering..." : "Register"}
                type="submit"
                loading={loading}
              />
            </form>

            <div className="flex items-center gap-4 my-6">
              <div className="h-px flex-1 bg-slate-600" />
              <span className="text-xs uppercase tracking-[0.2em] text-slate-300">
                or
              </span>
              <div className="h-px flex-1 bg-slate-600" />
            </div>

            <p className="text-center text-xs sm:text-sm text-slate-200">
              If already you have an account, please{" "}
              <Link
                to="/login"
                className="font-semibold text-indigo-400 hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthRegisterPage;
