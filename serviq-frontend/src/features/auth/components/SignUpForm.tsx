// SignUpForm.tsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import { signupMailSendAPICall } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../../utils/toast.utils";

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (formData.password !== formData.confirmPassword)
      return toast.error("Passwords do not match");

    try {
      setLoading(true);
      const response = await signupMailSendAPICall(formData);
      toast.success(response.message || "OTP sent! Check your inbox to continue. 📨");
      navigate("/verify-otp", { state: formData });
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(error, "Failed to send OTP. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="space-y-6" noValidate>
      {/* Full Name */}
      <div>
        <label
          htmlFor="signup-fullname"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Full Name
        </label>
        <input
          id="signup-fullname"
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={onChangeHandler}
          placeholder="John Doe"
          autoComplete="name"
          required
          className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-4 pr-4 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/10"
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="signup-email"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Email Address
        </label>
        <input
          id="signup-email"
          type="email"
          name="email"
          value={formData.email}
          onChange={onChangeHandler}
          placeholder="john@example.com"
          autoComplete="email"
          required
          className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-4 pr-4 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/10"
        />
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="signup-password"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={onChangeHandler}
            placeholder="Enter password (min. 6 characters)"
            autoComplete="new-password"
            required
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-4 pr-14 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 transition hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
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
      </div>

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="signup-confirm-password"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="signup-confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={onChangeHandler}
            placeholder="Re-enter your password"
            autoComplete="new-password"
            required
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-4 pr-14 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 transition hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? (
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
      </div>

      {/* Terms */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="agree-terms"
          required
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 accent-black focus:ring-2 focus:ring-black focus:ring-offset-2 focus:outline-none"
        />
        <label htmlFor="agree-terms" className="text-sm text-gray-600">
          I agree to the{" "}
          <span className="font-semibold text-black underline decoration-gray-400 underline-offset-2">
            Terms
          </span>{" "}
          &{" "}
          <span className="font-semibold text-black underline decoration-gray-400 underline-offset-2">
            Privacy Policy
          </span>
        </label>
      </div>

      {/* Submit Button */}
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
          <span className="flex items-center justify-center gap-2" role="status" aria-label="Sending OTP">
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
            Sending OTP...
          </span>
        ) : (
          "Create Account"
        )}
      </button>

      {/* Divider and Google SSO (commented out, preserved) */}
      {/* <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <span className="text-xs font-medium text-gray-400">OR</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      <button
        type="button"
        className="flex w-full items-center justify-center gap-3 rounded-full border border-gray-300 bg-white py-3 font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 hover:shadow-md"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="h-5 w-5"
        />
        Continue with Google
      </button> */}
    </form>
  );
};

export default SignUpForm;