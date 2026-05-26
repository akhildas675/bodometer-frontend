import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { parseApiError } from "@/api/error.helper";

import PrimaryButton from "@/components/ui/primary.button";
import { useOtpStore } from "@/stores/otp.store";
import authService from "@/services/auth/auth.service";

const OTP_LENGTH = 6;

const AuthOtpPage: React.FC = () => {
  const navigate = useNavigate();

  const email = useOtpStore((s) => s.email);
  const role = useOtpStore((s) => s.role);
  const purpose = useOtpStore((s) => s.purpose);

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!email || !role || !purpose) {
      navigate("/login", { replace: true });
    }
  }, [email, role, purpose, navigate]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

const handleVerifyOtp = async () => {
  const otpValue = otp.join("");

  try {
    setLoading(true);

    const verifyRes = await authService.verifyOtp({
      email: email!,
      otp: otpValue,
      purpose: purpose!,
    });

    if (!verifyRes.success) {
      toast.error(verifyRes.message || "OTP verification failed");
      return;
    }

    if (purpose === "FORGET_PASSWORD") {
      toast.success(verifyRes.message);
      navigate("/reset-password", { replace: true });
      return;
    }

    
    const { registerData, role } = useOtpStore.getState();

    if (!registerData || !role) {
      toast.error("Registration session expired. Please register again.");
      navigate(role === "trainer" ? "/register/trainer" : "/register", {
        replace: true,
      });
      return;
    }

    const completeRes = await authService.completeRegister({
      ...registerData,
      role,
    });

    toast.success(completeRes.message);
    useOtpStore.getState().clearOtpContext();
    navigate("/login", { replace: true });

  } catch (error: unknown) {
    const apiError = parseApiError(error);
    toast.error(apiError.message);
  } finally {
    setLoading(false);
  }
};




  const RESEND_TIME = 30;

  const [secondsLeft, setSecondsLeft] = useState(RESEND_TIME);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleResendOtp = async () => {
    if (!canResend || !email || !purpose) return;

    try {
      setCanResend(false);
      setSecondsLeft(RESEND_TIME);

      const resendRes = await authService.resendOtp({
        email,
        purpose,
      });

      toast.success(resendRes.message);
    } catch (error: unknown) {
      const apiError = parseApiError(error);
      toast.error(apiError.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-[#03000D] to-[#190473] flex items-center justify-center">
      <div className="w-full max-w-6xl h-[600px] rounded-3xl overflow-hidden shadow-2xl flex bg-linear-to-b from-[#03000D] to-[#190473]">
        {/* LEFT IMAGE */}
        <div className="w-1/2 hidden md:block relative">
          <img
            src="https://bodometer-assets.s3.eu-north-1.amazonaws.com/bodometer_register_page_img.jpg"
            alt="OTP"
            className="h-full w-full object-cover"
          />
        </div>

        {/* RIGHT OTP BOX */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-sm bg-[#050017]/90 rounded-3xl px-8 py-10 shadow-xl">
            <h2 className="text-center text-xl font-semibold text-white mb-6">
              VERIFY YOUR ACCOUNT
            </h2>

            <div className="flex justify-between gap-2 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength={1}
                  inputMode="numeric"
                  className="h-12 w-10 rounded-md bg-[#19245a] text-center text-lg font-semibold text-white outline-none focus:border-purple-400 border border-transparent"
                />
              ))}
            </div>

            <PrimaryButton
              text={loading ? "Verifying..." : "Verify"}
              type="button"
              loading={loading}
              onClick={handleVerifyOtp}
            />

            <p className="mt-4 text-xs text-slate-400 text-center">
              {canResend ? (
                <button
                  onClick={handleResendOtp}
                  className="text-indigo-400 hover:underline"
                >
                  Resend OTP
                </button>
              ) : (
                <>Resend OTP in {secondsLeft}s</>
              )}
            </p>

            <p className="mt-3 text-xs text-center">
              <Link
                to="/login"
                className="text-indigo-400 hover:underline"
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

export default AuthOtpPage;
