import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signupOTPVerifyCall, signupMailSendAPICall } from "../services/auth";
import { useDispatch } from "react-redux";
import { setToken } from "../authSlice";
import { getErrorMessage } from "../../../utils/toast.utils";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;

  const dispatch = useDispatch();

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
        role: data.role,
        otp,
      };

      const response = await signupOTPVerifyCall(signUpData);
      dispatch(setToken(response?.data?.accessToken));

      if (response.success) {
        toast.success(response.message || "Account created! Welcome aboard. 🎉");
        navigate("/");
      }
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
        role: data.role,
      };
      const response = await signupMailSendAPICall(resendData);
      toast.success(response.message || "OTP resent! Check your inbox. 📨");
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
            Almost there!<span className="block text-black">Verify your email.</span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-gray-600">
            We've sent a 4-digit verification code to{" "}
            <span className="font-semibold text-black">{data?.email || "your email"}</span>.
            Enter it below to activate your account.
          </p>

          <div className="mt-10 space-y-5">
            {[
              { icon: "✓", text: "Code valid for 10 minutes" },
              { icon: "✓", text: "Didn't receive it? Resend anytime" },
              { icon: "✓", text: "Your data stays secure & encrypted" },
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
              {/* Icon */}
              <div className="mb-8 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-3xl">
                  📩
                </div>
                <h2 className="text-2xl font-bold text-black">Verify Your OTP</h2>
                <p className="mt-2 text-gray-500">Enter the 4-digit code we sent you</p>
              </div>

              <form onSubmit={onSubmitHandler} className="space-y-6">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    OTP Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="• • • •"
                    className="w-full rounded-xl border border-gray-300 bg-white py-4 px-4 text-center text-2xl tracking-[0.5em] text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
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
                      Verifying...
                    </div>
                  ) : (
                    "Verify OTP"
                  )}
                </button>
              </form>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendLoading}
                className="mt-4 w-full rounded-full border border-gray-300 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
              >
                {resendLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Resending...
                  </span>
                ) : (
                  "↺  Resend OTP"
                )}
              </button>

              <p className="mt-6 text-center text-sm text-gray-500">
                Wrong email?{" "}
                <Link to="/signup" className="font-semibold text-black underline underline-offset-2 transition hover:text-gray-600">
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

export default VerifyOtp;