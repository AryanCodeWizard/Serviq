import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  buildAuthSession,
  signupOTPVerifyCall,
  signupMailSendAPICall,
} from "../services/auth";
import { setSession } from "../authSlice";
import { getErrorMessage } from "../../../utils/toast.utils";
import { useAppDispatch } from "../../../app/hooks";
import AuthPageShell from "../../../components/layout/AuthPageShell";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state as
    | {
        fullName: string;
        email: string;
        password: string;
        confirmPassword: string;
      }
    | null;

  const dispatch = useAppDispatch();

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-16 text-gray-900 antialiased">
        <div className="max-w-md rounded-[2rem] border border-gray-200 bg-white p-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
          <p className="text-lg font-bold text-black">
            Signup session missing
          </p>
          <p className="mt-3 text-sm leading-6 text-gray-500">
            Please start the signup flow again so we can verify your email.
          </p>
          <Link
            to="/signup"
            className="mt-6 inline-flex rounded-full bg-black px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 active:scale-[0.98]"
          >
            Go to signup
          </Link>
        </div>
      </main>
    );
  }

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (otp.length !== 4) {
      toast.error("Please enter a valid 4-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const signUpData = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        otp,
      };

      const authUser = await signupOTPVerifyCall(signUpData);
      dispatch(setSession(buildAuthSession(authUser)));
      toast.success("Account created! Welcome aboard. 🎉");
      navigate("/dashboard");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Invalid OTP. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!data?.email) {
      toast.error("Email not found. Please go back and try again.");
      return;
    }

    try {
      setResendLoading(true);
      const resendData = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      };
      const response = await signupMailSendAPICall(resendData);
      toast.success(response.message || "OTP resent! Check your inbox. 📨");
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
      title="Almost there"
      description="Enter the 4-digit code sent to your email to complete account setup."
      ctaText="Email verification"
      ctaLink="/signup"
      ctaLabel="Start again"
      ctaPrompt="Need a fresh start?"
      features={[
        { icon: "✓", text: "Code valid for 10 minutes" },
        { icon: "✓", text: "Resend anytime if needed" },
        { icon: "✓", text: "Secure verification process" },
      ]}
    >
      <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)] sm:p-10">
        <div className="mb-8 text-center">
          <div
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-3xl text-gray-700"
            aria-hidden="true"
          >
            📩
          </div>
          <h2 className="text-2xl font-bold text-black">
            Verify your OTP
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Enter the 4-digit code sent to{" "}
            <span className="font-semibold text-black">{data.email}</span>
          </p>
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-6" noValidate>
          <div>
            <label
              htmlFor="verify-otp-input"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              OTP Code
            </label>
            <input
              id="verify-otp-input"
              type="text"
              maxLength={4}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="• • • •"
              autoComplete="one-time-code"
              className="w-full rounded-xl border border-gray-300 bg-white px-5 py-4 text-center text-2xl tracking-[0.5em] text-black outline-none transition placeholder:text-gray-300 focus:border-black focus:ring-2 focus:ring-black/10"
              aria-label="Four digit OTP code"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-full py-3 text-base font-bold text-white shadow-sm transition-all duration-300 ${
              loading
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
          disabled={resendLoading}
          className="mt-4 w-full rounded-full border border-gray-300 bg-white py-3 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
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
          ) : (
            "↺ Resend OTP"
          )}
        </button>
      </div>
    </AuthPageShell>
  );
};

export default VerifyOtp;