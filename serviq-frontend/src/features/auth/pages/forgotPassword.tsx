import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { forgotPasswordAPICall } from "../services/auth";
import { getErrorMessage } from "../../../utils/toast.utils";
import AuthPageShell from "../../../components/layout/AuthPageShell";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      await forgotPasswordAPICall({ email });
      setEmailSent(true);
      toast.success("Reset OTP sent! Check your inbox. 📧");
      navigate("/forgot-password-verify-otp", { state: { email } });
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(error, "Failed to send reset OTP. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell
      title="Forgot your password?"
      description="Enter your registered email and we’ll send a secure OTP so you can reset your password safely."
      ctaText="Password recovery"
      ctaLink="/login"
      ctaLabel="Back to login"
      ctaPrompt="Remembered it?"
      features={[
        { icon: "✓", text: "OTP delivered to your inbox" },
        { icon: "✓", text: "Valid for 10 minutes" },
        { icon: "✓", text: "Secure password reset flow" },
      ]}
    >
      <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)] sm:p-10">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-black">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Enter the email tied to your account.
          </p>
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-6" noValidate>
          <div>
            <label
              htmlFor="forgot-email"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              autoComplete="email"
              required
              className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-4 pr-4 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/10"
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
                aria-label="Sending OTP"
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
                Sending OTP…
              </span>
            ) : (
              "Send reset OTP"
            )}
          </button>
        </form>

        {emailSent && (
          <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800">
            Check your inbox for the OTP. If you don’t see it, check your spam
            folder.
          </div>
        )}
      </div>
    </AuthPageShell>
  );
};

export default ForgotPassword;