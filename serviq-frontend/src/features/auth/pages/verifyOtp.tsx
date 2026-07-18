import { use, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signupOTPVerifyCall } from "../services/signUp";
import { signupMailSendAPICall } from "../services/signUp";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location=useLocation();
  const data=location.state;

 const onSubmitHandler = async (
  e: React.FormEvent<HTMLFormElement>
) => {
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

    if (response.success) {
      toast.success(response.message);

      navigate("/");
    }
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message ||
        error?.message ||
        "Invalid OTP"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-50 px-5 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-4xl">
            📩
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Verify OTP
          </h1>

          <p className="mt-3 text-slate-500">
            We've sent a verification code to your email.
          </p>
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Enter OTP
            </label>

            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, ""))
              }
              placeholder="123456"
              className="w-full rounded-xl border border-slate-300 px-4 py-4 text-center text-2xl tracking-[0.5em] outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-lg font-semibold text-white transition ${
              loading
                ? "cursor-not-allowed bg-blue-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>

        <button
          className="mt-6 w-full rounded-xl border border-slate-300 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Resend OTP
        </button>

        <p className="mt-6 text-center text-sm text-slate-500">
          Wrong email?{" "}
          <Link
            to="/signup"
            className="font-semibold text-blue-600 hover:underline"
          >
            Go Back
          </Link>
        </p>
      </div>
    </main>
  );
};

export default VerifyOtp;