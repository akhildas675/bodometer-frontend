import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authServices/auth.service";
import { useOtpStore } from "../../stores/otpStore";
import PrimaryButton from "../ui/PrimaryButton";
import { toast } from "sonner";

const UserOtpVerifyPage = () => {
  const [verified, setVerified] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const navigate = useNavigate();
  const { email, userData, clearOtpSession } = useOtpStore();

  const OTP_EXPIRY_SECONDS = 30;

  const [secondLeft, setSecondsLeft] = useState(OTP_EXPIRY_SECONDS);

  const [canSend, setCanSend] = useState(false);

  const [isResending, setIsResending] = useState(false);


  useEffect(() => {
    if (!verified && (!email || !userData)) {
      navigate("/user-register", { replace: true });
    }
  }, [email, userData, verified, navigate]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value) {
      inputRefs.current[index]?.blur();
      if (index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpValue = otp.join("");
    if (otpValue.length !== 6) return;

    try {
      setLoading(true);

      const result = await authService.verifyRegisterOtp({
        email,
        otp: otpValue,
        userData,
      });

      if (result.success) {
        toast.success(result.message);
        setVerified(true);
        clearOtpSession();
        navigate("/user-login", { replace: true });
      } else {
        toast.error(result.message || "OTP verification failed");
      }
    } catch {
      toast.error("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (secondLeft <= 0) {
      setCanSend(true);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };


const handleResendOtp = async () => {
  if (!email) {
    toast.error("Email missing. Please register again.");
    navigate("/user-register", { replace: true });
    return;
  }

  if (isResending || !canSend) return; 

  try {
    setIsResending(true);
    setCanSend(false);
    setSecondsLeft(OTP_EXPIRY_SECONDS);
    setOtp(Array(6).fill(""));

    const result = await authService.resendOtp(email);
    toast.success(result.message);
  } catch {
    toast.error("Failed to resend OTP");
  } finally {
    setIsResending(false);
  }
};



  return (
    <div className="min-h-screen w-full bg-linear-to-b from-[#03000D] to-[#190473] flex items-center justify-center">
      <div className="w-full max-w-6xl h-[600px] rounded-3xl overflow-hidden shadow-2xl flex bg-linear-to-b from-[#03000D] to-[#190473]">
        {/* LEFT IMAGE SIDE */}
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

        {/* RIGHT SIDE */}
        <div className="flex-1 relative flex items-center justify-center px-6 sm:px-10 py-10 bg-gradient-to-br from-[#05001a] via-[#050024] to-[#050034]">
          <div className="pointer-events-none absolute -top-32 -right-20 h-72 w-72 rounded-full bg-[#3a1b7a] opacity-40 blur-2xl" />
          <div className="pointer-events-none absolute bottom-[-120px] left-[-40px] h-80 w-80 rounded-full bg-[#24116b] opacity-40 blur-2xl" />

          <div className="relative w-full max-w-sm">
            <div className="mx-auto rounded-[32px] bg-[#050017]/90 px-8 py-10 shadow-[0_30px_80px_rgba(0,0,0,0.7)] flex flex-col items-center">
              {/* <div className="h-14 w-14 rounded-full bg-[#1a1648] flex items-center justify-center mb-5">
                <span className="text-2xl">🔒</span>
              </div> */}

              <h2 className="text-center text-xl font-semibold text-white tracking-wide mb-6">
                VERIFY YOUR ACCOUNT
              </h2>

              <form onSubmit={handleVerify}>
                <div className="flex justify-between gap-2 mb-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      value={digit}
                      onChange={(e) => handleChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      maxLength={1}
                      inputMode="numeric"
                      className="h-12 w-10 sm:h-14 sm:w-12 rounded-md bg-[#19245a] text-center text-lg font-semibold text-white outline-none border border-transparent focus:border-purple-400 shadow-md shadow-black/40"
                    />
                  ))}
                </div>

                <PrimaryButton text="Verify" type="submit" loading={loading} />
              </form>

              <p className="text-xs text-slate-300 text-center mb-4">
                {canSend
                  ? "OTP expired"
                  : `OTP expires in ${formatTime(secondLeft)}`}
              </p>

              <button
                disabled={!canSend}
                onClick={handleResendOtp}
                className={`text-sm font-semibold ${
                  canSend
                    ? "text-purple-400 hover:underline"
                    : "text-gray-500 cursor-not-allowed"
                }`}
              >
                RESEND OTP
              </button>

              <p className="mt-3 text-[11px] sm:text-xs text-slate-400 text-center">
                <Link to="/auth/login" className="hover:text-indigo-300">
                  Back to Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOtpVerifyPage;
