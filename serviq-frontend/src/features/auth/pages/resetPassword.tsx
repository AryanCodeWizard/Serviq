import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { resetPasswordAPICall } from "../services/auth";
import { getErrorMessage } from "../../../utils/toast.utils";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  // Password strength
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
  const strengthColors = ["#ef4444", "#f97316", "#eab308", "#16a34a"];
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
      toast.success("Password reset successfully! Please log in with your new password. ✅");
      navigate("/login");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to reset password. The link may have expired."));
    } finally {
      setLoading(false);
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
            Set your new<span className="block text-black">password.</span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-gray-600">
            Your identity has been verified. Choose a strong new password to secure your account and get back to enjoying our services.
          </p>

          <div className="mt-10 space-y-5">
            {[
              { icon: "✓", text: "Use at least 8 characters" },
              { icon: "✓", text: "Mix uppercase, numbers & symbols" },
              { icon: "✓", text: "Passwords are securely encrypted" },
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

        {/* RIGHT PANEL – Form */}
        <div className="flex items-center justify-center px-6 py-12 lg:px-10">
          <div className="w-full max-w-md">
            <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] sm:p-10">

              {/* Header */}
              <div className="mb-8 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-3xl">
                  🔑
                </div>
                <h2 className="text-2xl font-bold text-black">Create New Password</h2>
                <p className="mt-2 text-gray-500">Choose a strong password for your account</p>
              </div>

              {/* Token missing warning */}
              {!token && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
                  ⚠️ Reset token is missing. Please{" "}
                  <Link to="/forgot-password" className="font-semibold underline">
                    request a new OTP
                  </Link>
                  .
                </div>
              )}

              <form onSubmit={onSubmitHandler} className="space-y-5">
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
                      required
                      className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-4 pr-14 text-sm text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((v) => !v)}
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500 transition hover:text-black"
                    >
                      {showNew ? "Hide" : "Show"}
                    </button>
                  </div>

                  {/* Strength bar */}
                  {newPassword.length > 0 && (
                    <div className="mt-3">
                      <div className="flex gap-1.5 mb-1.5">
                        {[1, 2, 3, 4].map((s) => (
                          <div
                            key={s}
                            className="h-1.5 flex-1 rounded-full transition-all duration-300"
                            style={{
                              background: s <= strength ? strengthColors[strength - 1] : "#e5e7eb",
                            }}
                          />
                        ))}
                      </div>
                      <span
                        className="text-xs font-medium"
                        style={{ color: strength > 0 ? strengthColors[strength - 1] : "#9ca3af" }}
                      >
                        {strength > 0 ? strengthLabels[strength - 1] : ""}
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
                      required
                      className={`w-full rounded-xl border bg-white py-3 pl-4 pr-14 text-sm text-black outline-none transition focus:ring-2 focus:ring-black/10 ${
                        confirmPassword.length > 0
                          ? newPassword === confirmPassword
                            ? "border-green-400 focus:border-green-500"
                            : "border-red-400 focus:border-red-500"
                          : "border-gray-300 focus:border-black"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500 transition hover:text-black"
                    >
                      {showConfirm ? "Hide" : "Show"}
                    </button>
                  </div>
                  {confirmPassword.length > 0 && (
                    <p
                      className="mt-1.5 text-xs font-medium"
                      style={{ color: newPassword === confirmPassword ? "#16a34a" : "#dc2626" }}
                    >
                      {newPassword === confirmPassword
                        ? "✓ Passwords match"
                        : "✗ Passwords do not match"}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  id="reset-password-btn"
                  type="submit"
                  disabled={loading || !token}
                  className={`w-full rounded-full py-3 text-base font-bold text-white transition-all duration-300 ${
                    loading || !token
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
                      Resetting Password...
                    </div>
                  ) : (
                    "Reset Password →"
                  )}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-gray-500">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-black underline underline-offset-2 transition hover:text-gray-600"
                >
                  Back to Login
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};

export default ResetPassword;