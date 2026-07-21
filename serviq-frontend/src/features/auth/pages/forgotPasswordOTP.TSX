import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { forgotPasswordVerifyOTPCall, forgotPasswordAPICall } from "../services/auth";
import { getErrorMessage } from "../../../utils/toast.utils";

const ForgotPasswordOTP = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email: string = location.state?.email ?? "";

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    const newOtp = [...otp];
    for (let i = 0; i < 4; i++) {
      newOtp[i] = pasted[i] ?? "";
    }
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 3)]?.focus();
  };

  const otpString = otp.join("");

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email not found. Please go back and try again.");
      navigate("/forgot-password");
      return;
    }

    if (otpString.length !== 4) {
      toast.error("Please enter the complete 4-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const response = await forgotPasswordVerifyOTPCall({ email, otp: otpString });

      if (response.success) {
        const resetToken = response.data?.resetPasswordToken;
        toast.success("OTP verified! Now set your new password. 🔓");
        navigate(`/reset-password?token=${resetToken}`);
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Invalid OTP. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Email not found. Please go back and try again.");
      return;
    }
    try {
      setResendLoading(true);
      await forgotPasswordAPICall({ email });
      toast.success("OTP resent! Check your inbox. 📨");
      setOtp(["", "", "", ""]);
      setResendTimer(60);
      setCanResend(false);
      inputRefs.current[0]?.focus();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to resend OTP. Please try again."));
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-white overflow-hidden">
      {/* Subtle dot-grid background */}
      <div className="absolute inset-0 -z-10 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-2">

        {/* LEFT PANEL – Branding */}
        <div className="flex flex-col justify-center bg-gray-50 px-8 py-16 lg:px-16 xl:px-20">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-xl font-bold text-white shadow-lg">
              U
            </div>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-black sm:text-5xl lg:text-6xl">
            Check your<span className="block text-black">inbox.</span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-gray-600">
            We've sent a 4-digit OTP to{" "}
            <span className="font-semibold text-black">{email || "your email"}</span>.
            Enter it below to verify your identity and proceed to reset your password.
          </p>

          <div className="mt-10 space-y-5">
            {[
              { icon: "✓", text: "OTP is valid for 10 minutes" },
              { icon: "✓", text: "Didn't receive it? Resend after 60s" },
              { icon: "✓", text: "Secure identity verification" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                  {item.icon}
                </span>
                <span className="text-base font-medium text-gray-700">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-14 hidden w-24 border-t-2 border-black/10 lg:block" />
        </div>

        {/* RIGHT PANEL – OTP Form */}
        <div className="flex items-center justify-center px-6 py-12 lg:px-10">
          <div className="w-full max-w-md">
            <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] sm:p-10">

              {/* Header */}
              <div className="mb-8 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-3xl">
                  🔐
                </div>
                <h2 className="text-2xl font-bold text-black">Enter OTP</h2>
                <p className="mt-2 text-gray-500">4-digit code sent to your email</p>
              </div>

              <form onSubmit={onSubmitHandler}>
                {/* OTP boxes */}
                <div
                  className="flex justify-center gap-3 mb-8"
                  onPaste={handlePaste}
                >
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      id={`otp-input-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      autoFocus={index === 0}
                      className={`h-16 w-16 rounded-xl border text-center text-2xl font-bold text-black outline-none transition-all duration-200 focus:ring-2 focus:ring-black/10 ${
                        digit
                          ? "border-black bg-gray-50"
                          : "border-gray-300 bg-white focus:border-black"
                      }`}
                    />
                  ))}
                </div>

                {/* Submit */}
                <button
                  id="verify-otp-btn"
                  type="submit"
                  disabled={loading || otpString.length !== 4}
                  className={`w-full rounded-full py-3 text-base font-bold text-white transition-all duration-300 ${
                    loading || otpString.length !== 4
                      ? "cursor-not-allowed bg-gray-300"
                      : "bg-black hover:bg-gray-900 hover:shadow-lg active:scale-[0.98]"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      Verifying OTP...
                    </div>
                  ) : (
                    "Verify OTP →"
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs font-medium text-gray-400">or</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              {/* Resend */}
              <button
                id="resend-otp-btn"
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend || resendLoading}
                className={`w-full rounded-full border py-3 font-semibold transition-all duration-300 ${
                  canResend && !resendLoading
                    ? "border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-sm"
                    : "cursor-not-allowed border-gray-200 text-gray-400"
                }`}
              >
                {resendLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Resending...
                  </span>
                ) : canResend ? (
                  "↺  Resend OTP"
                ) : (
                  `Resend OTP in ${resendTimer}s`
                )}
              </button>

              <p className="mt-6 text-center text-sm text-gray-500">
                Wrong email?{" "}
                <Link
                  to="/forgot-password"
                  className="font-semibold text-black underline underline-offset-2 transition hover:text-gray-600"
                >
                  Go Back
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};

export default ForgotPasswordOTP;