import React, { useState } from "react";
import toast from "react-hot-toast";
import { signupMailSendAPICall } from "../services/signUp";
import { useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [loading, setLoading] = useState(false);
const navigate=useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "User",
  });

  const setRoleHandler = (role: string) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // console.log(formData);

const onSubmitHandler = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  if (!formData.fullName.trim()) {
    toast.error("Full name is required");
    return;
  }

  if (!formData.email.trim()) {
    toast.error("Email is required");
    return;
  }

  if (formData.password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

 try {
  console.log("Loading Start");

  setLoading(true);

  const response = await signupMailSendAPICall(formData);

  console.log(response);

  toast.success(response.message);
  navigate("/verify-otp",{
    state: formData,
  })

} catch (error) {
  console.log(error);
} finally {
  console.log("Loading End");

  setLoading(false);
}
};
  return (
    <form onSubmit={onSubmitHandler} className="space-y-6">
      {/* Heading */}

      <div>
        <h2 className="text-3xl font-bold text-slate-900">
          Create Account
        </h2>

        <p className="mt-2 text-slate-500">
          Fill in your details to continue.
        </p>
      </div>

      {/* Role */}

      <div>
        <label className="mb-3 block text-sm font-semibold text-slate-700">
          Account Type
        </label>

        <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setRoleHandler("User")}
            className={`rounded-lg py-3 font-semibold transition-all duration-300 ${
              formData.role === "User"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-slate-600 hover:bg-white"
            }`}
          >
            User
          </button>

          <button
            type="button"
            onClick={() => setRoleHandler("Worker")}
            className={`rounded-lg py-3 font-semibold transition-all duration-300 ${
              formData.role === "Worker"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-slate-600 hover:bg-white"
            }`}
          >
            Worker
          </button>
        </div>
      </div>

      {/* Full Name */}

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Full Name
        </label>

        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={onChangeHandler}
          placeholder="John Doe"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          required
        />
      </div>

      {/* Email */}

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Email Address
        </label>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onChangeHandler}
          placeholder="john@example.com"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          required
        />
      </div>

      {/* Password */}

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Password
        </label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={onChangeHandler}
            placeholder="Enter password"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-16 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {/* Confirm Password */}

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Confirm Password
        </label>

        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={onChangeHandler}
            placeholder="Confirm password"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-16 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            required
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600"
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {/* Terms */}

      <label className="flex items-start gap-3 text-sm text-slate-600">
        <input
          type="checkbox"
          required
          className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
        />

        <span>
          I agree to the{" "}
          <span className="font-semibold text-blue-600 cursor-pointer">
            Terms & Conditions
          </span>{" "}
          and{" "}
          <span className="font-semibold text-blue-600 cursor-pointer">
            Privacy Policy
          </span>
          .
        </span>
      </label>

      {/* Submit */}

      <button
  type="submit"
  disabled={loading}
  className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-lg font-semibold text-white transition-all duration-300 ${
    loading
      ? "cursor-not-allowed bg-blue-400"
      : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-95"
  }`}
>
  {loading ? (
    <>
      <svg
        className="h-5 w-5 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
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

      Sending OTP...
    </>
  ) : (
    "Create Account"
  )}
</button>

      {/* Divider */}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>

        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-sm text-slate-400">
            OR
          </span>
        </div>
      </div>

      {/* Google */}

      <button
        type="button"
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="h-5 w-5"
        />

        Continue with Google
      </button>

      {/* Login */}

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <span className="cursor-pointer font-semibold text-blue-600 hover:underline">
          Login
        </span>
      </p>
    </form>
  );
};

export default SignUpForm;