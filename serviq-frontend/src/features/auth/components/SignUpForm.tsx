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
    // role: "User",
  });

  // const setRoleHandler = (role: string) => {
  //   setFormData((prev) => ({ ...prev, role }));
  // };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    if (formData.password !== formData.confirmPassword) return toast.error("Passwords do not match");
    try {
      setLoading(true);
      const response = await signupMailSendAPICall(formData);
      toast.success(response.message || "OTP sent! Check your inbox to continue. 📨");
      navigate("/verify-otp", { state: formData });
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to send OTP. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="space-y-6">
      {/* Role toggle – sleek pill */}
      {/* <div className="grid grid-cols-2 rounded-full border border-gray-300 bg-gray-100 p-1">
        {["User", "Worker"].map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => setRoleHandler(role)}
            className={`rounded-full py-2.5 text-sm font-semibold transition-all duration-300 ${
              formData.role === role
                ? "bg-black text-white shadow-md"
                : "text-gray-600 hover:text-black"
            }`}
          >
            {role}
          </button>
        ))}
      </div> */}

      {/* Full Name & Email with subtle icon hint */}
      {[
        { label: "Full Name", name: "fullName", type: "text", placeholder: "John Doe" },
        { label: "Email Address", name: "email", type: "email", placeholder: "john@example.com" },
      ].map(({ label, name, type, placeholder }) => (
        <div key={name}>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
          <div className="relative">
            <input
              type={type}
              name={name}
              value={formData[name as keyof typeof formData] as string}
              onChange={onChangeHandler}
              placeholder={placeholder}
              className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-4 pr-4 text-sm text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              required
            />
          </div>
        </div>
      ))}

      {/* Password Fields */}
      {[
        { label: "Password", name: "password", placeholder: "Enter password", state: showPassword, set: setShowPassword },
        { label: "Confirm Password", name: "confirmPassword", placeholder: "Confirm password", state: showConfirmPassword, set: setShowConfirmPassword },
      ].map(({ label, name, placeholder, state, set }) => (
        <div key={name}>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
          <div className="relative">
            <input
              type={state ? "text" : "password"}
              name={name}
              value={formData[name as keyof typeof formData] as string}
              onChange={onChangeHandler}
              placeholder={placeholder}
              className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-4 pr-14 text-sm text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              required
            />
            <button
              type="button"
              onClick={() => set(!state)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500 transition hover:text-black"
            >
              {state ? "Hide" : "Show"}
            </button>
          </div>
        </div>
      ))}

      {/* Terms – checkmark styled */}
      <label className="flex cursor-pointer items-start gap-3 text-sm text-gray-600">
        <input
          type="checkbox"
          required
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black accent-black focus:ring-0"
        />
        <span>
          I agree to the{" "}
          <span className="font-semibold text-black underline decoration-gray-400 underline-offset-2 transition hover:text-gray-600">
            Terms
          </span>{" "}
          &{" "}
          <span className="font-semibold text-black underline decoration-gray-400 underline-offset-2 transition hover:text-gray-600">
            Privacy Policy
          </span>
        </span>
      </label>

      {/* Submit button – elegant black with gradient */}
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
          "Create Account"
        )}
      </button>

      {/* Divider with subtle styling */}
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