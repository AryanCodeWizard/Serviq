import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { forgotPasswordAPICall } from "../services/auth";
import { getErrorMessage } from "../../../utils/toast.utils";

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
      toast.error(getErrorMessage(error, "Failed to send reset OTP. Please try again."));
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
            Forgot your<span className="block text-black">password?</span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-gray-600">
            No worries — it happens to everyone. Enter your registered email and we'll send a secure OTP to reset your password instantly.
          </p>

          <div className="mt-10 space-y-5">
            {[
              { icon: "✓", text: "OTP delivered to your inbox" },
              { icon: "✓", text: "Valid for 10 minutes only" },
              { icon: "✓", text: "Secure & encrypted password reset" },
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

              {emailSent ? (
                /* Success state */
                <div className="text-center space-y-5">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-3xl">
                    ✉️
                  </div>
                  <h2 className="text-2xl font-bold text-black">Check your email!</h2>
                  <p className="text-gray-500">
                    We've sent a password reset OTP to{" "}
                    <span className="font-semibold text-black">{email}</span>.
                  </p>
                  <button
                    type="button"
                    onClick={() => setEmailSent(false)}
                    className="mt-2 text-sm font-semibold text-black underline underline-offset-2 hover:text-gray-700 transition"
                  >
                    Send again?
                  </button>
                </div>
              ) : (
                /* Email input form */
                <>
                  <div className="mb-8 text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-3xl">
                      🔑
                    </div>
                    <h2 className="text-2xl font-bold text-black">Reset Password</h2>
                    <p className="mt-2 text-gray-500">Enter your email to receive an OTP</p>
                  </div>

                  <form onSubmit={onSubmitHandler} className="space-y-6">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full rounded-xl border border-gray-300 bg-white py-3 px-4 text-sm text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full rounded-full py-3 text-base font-bold text-white transition-all duration-300 ${
                        loading
                          ? "cursor-not-allowed bg-gray-400"
                          : "bg-black hover:bg-gray-900 hover:shadow-lg active:scale-[0.98]"
                      }`}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                          </svg>
                          Sending OTP...
                        </div>
                      ) : (
                        "Send Reset OTP"
                      )}
                    </button>
                  </form>
                </>
              )}

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

export default ForgotPassword;