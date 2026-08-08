import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  forgotPasswordVerifyOTPCall,
  forgotPasswordAPICall,
} from "../services/auth";
import { getErrorMessage } from "../../../utils/toast.utils";
import AuthPageShell from "../../../components/layout/AuthPageShell";

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

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
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
      const response = await forgotPasswordVerifyOTPCall({
        email,
        otp: otpString,
      });

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
      toast.error(
        getErrorMessage(error, "Failed to resend OTP. Please try again."),
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <AuthPageShell
      title="Verify reset OTP"
      description="Enter the 4-digit code we sent to your email to continue resetting your password."
      ctaText="Secure reset"
      ctaLink="/forgot-password"
      ctaLabel="Start over"
      ctaPrompt="Need a new code?"
      features={[
        { icon: "✓", text: "Code valid for 10 minutes" },
        { icon: "✓", text: "Resend if needed" },
        { icon: "✓", text: "Secure recovery flow" },
      ]}
    >
      <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)] sm:p-10">
        <div className="mb-8 text-center">
          <div
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-3xl text-gray-700"
            aria-hidden="true"
          >
            🔐
          </div>
          <h2 className="text-2xl font-bold text-black">Enter your OTP</h2>
          <p className="mt-2 text-sm text-gray-500">
            A reset code was sent to{" "}
            <span className="font-semibold text-black">
              {email || "your email"}
            </span>
          </p>
        </div>

        <form onSubmit={onSubmitHandler} noValidate>
          <div
            className="mb-8 flex justify-center gap-3"
            onPaste={handlePaste}
            role="group"
            aria-label="OTP input fields"
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                id={`otp-input-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                autoFocus={index === 0}
                aria-label={`Digit ${index + 1}`}
                className={`h-16 w-16 rounded-2xl border text-center text-2xl font-bold outline-none transition-all duration-200 ${
                  digit
                    ? "border-black bg-gray-50 text-black shadow-sm"
                    : "border-gray-300 bg-white text-gray-400 placeholder-gray-300"
                } focus:border-black focus:ring-2 focus:ring-black/10`}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || otpString.length !== 4}
            className={`w-full rounded-full py-3 text-base font-bold text-white shadow-sm transition-all duration-300 ${
              loading || otpString.length !== 4
                ? "cursor-not-allowed bg-gray-400"
                : "bg-black hover:bg-gray-900 hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            }`}
          >
            {loading ? (
              <span
                className="flex items-center justify-center gap-2"
                role="status"
                aria-label="Verifying OTP"
              >
                <svg
                  className="h-5 w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Verifying…
              </span>
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>

        <button
          type="button"
          onClick={handleResendOtp}
          disabled={!canResend || resendLoading}
          className={`mt-4 w-full rounded-full border py-3 text-sm font-semibold transition-all duration-200 ${
            canResend && !resendLoading
              ? "border-gray-300 bg-white text-gray-800 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 active:scale-[0.98]"
              : "cursor-not-allowed border-gray-200 text-gray-400"
          }`}
        >
          {resendLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Resending…
            </span>
          ) : canResend ? (
            "↺ Resend OTP"
          ) : (
            `Resend in ${resendTimer}s`
          )}
        </button>

        <p className="mt-6 text-center text-sm text-gray-500">
          Wrong email?{" "}
          <Link
            to="/forgot-password"
            className="font-semibold text-black underline underline-offset-4 transition hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 rounded"
          >
            Go back
          </Link>
        </p>
      </div>
    </AuthPageShell>
  );
};

export default ForgotPasswordOTP;