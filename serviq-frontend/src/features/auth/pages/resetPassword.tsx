import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { resetPasswordAPICall } from "../services/auth";
import { getErrorMessage } from "../../../utils/toast.utils";
import AuthPageShell from "../../../components/layout/AuthPageShell";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const getStrength = (pw: string) => {
    if (pw.length === 0) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = getStrength(newPassword);
  const strengthColors = ["#ef4444", "#f97316", "#eab308", "#22c55e"];
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or missing reset token. Please request a new OTP.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await resetPasswordAPICall({ newPassword, confirmPassword, token });
      toast.success(
        "Password reset successfully! Please log in with your new password. ✅",
      );
      navigate("/login");
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(
          error,
          "Failed to reset password. The link may have expired.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell
      title="Reset your password"
      description="Enter a strong new password to secure your ServiQ account and continue managing your booking experience."
      ctaText="Secure reset"
      ctaLink="/login"
      ctaLabel="Back to login"
      ctaPrompt="Need help?"
      features={[
        { icon: "✓", text: "Strong password enforcement" },
        { icon: "✓", text: "Encrypted account recovery" },
        { icon: "✓", text: "Ready in seconds" },
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
          <h2 className="text-2xl font-bold text-black">
            Choose a new password
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Make sure it’s strong and easy for you to remember.
          </p>
        </div>

        {!token && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
            Missing reset token. Please request a new OTP from the password
            recovery page.
          </div>
        )}

        <form onSubmit={onSubmitHandler} className="space-y-5" noValidate>
          {/* New Password */}
          <div>
            <label
              htmlFor="new-password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                required
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-4 pr-14 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/10"
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 transition hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                aria-label={showNew ? "Hide password" : "Show password"}
              >
                {showNew ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            {newPassword.length > 0 && (
              <div className="mt-3">
                <div className="mb-1.5 flex gap-1.5">
                  {[1, 2, 3, 4].map((s) => (
                    <div
                      key={s}
                      className="h-1.5 flex-1 rounded-full"
                      style={{
                        background:
                          s <= strength
                            ? strengthColors[strength - 1]
                            : "#e5e7eb",
                      }}
                    />
                  ))}
                </div>
                <span
                  className="text-xs font-medium"
                  style={{
                    color: strength > 0 ? strengthColors[strength - 1] : "#6b7280",
                  }}
                >
                  {strength > 0 ? strengthLabels[strength - 1] : "Too short"}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirm-password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                required
                className={`w-full rounded-xl border bg-white py-3 pl-4 pr-14 text-sm text-black outline-none transition placeholder:text-gray-400 focus:ring-2 focus:ring-black/10 ${
                  confirmPassword.length > 0
                    ? newPassword === confirmPassword
                      ? "border-emerald-500 focus:border-emerald-600"
                      : "border-rose-400 focus:border-rose-500"
                    : "border-gray-300 focus:border-black"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 transition hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            {confirmPassword.length > 0 && (
              <p
                className="mt-1.5 text-xs font-medium"
                style={{
                  color:
                    newPassword === confirmPassword ? "#16a34a" : "#dc2626",
                }}
              >
                {newPassword === confirmPassword
                  ? "✓ Passwords match"
                  : "✗ Passwords do not match"}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !token}
            className={`w-full rounded-full py-3 text-base font-bold text-white shadow-sm transition-all duration-300 ${
              loading || !token
                ? "cursor-not-allowed bg-gray-400"
                : "bg-black hover:bg-gray-900 hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            }`}
          >
            {loading ? (
              <span
                className="flex items-center justify-center gap-2"
                role="status"
                aria-label="Resetting password"
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
                Resetting…
              </span>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Remembered your password?{" "}
          <Link
            to="/login"
            className="font-semibold text-black underline underline-offset-4 transition hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 rounded"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </AuthPageShell>
  );
};

export default ResetPassword;