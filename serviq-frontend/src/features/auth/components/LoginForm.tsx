import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { buildAuthSession, loginAPICall } from "../services/auth";
import { setSession } from "../authSlice";
import { getErrorMessage } from "../../../utils/toast.utils";
import { useAppDispatch } from "../../../app/hooks";

const LoginForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!formData.password) {
      toast.error("Password is required");
      return;
    }

    try {
      setLoading(true);

      const authUser = await loginAPICall(formData);

      dispatch(setSession(buildAuthSession(authUser)));
      toast.success("Welcome back! You've logged in successfully. 🎉");
      navigate("/dashboard");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Login failed. Please check your credentials."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="space-y-6">
      {/* Email */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onChangeHandler}
          placeholder="john@example.com"
          className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-4 pr-4 text-sm text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
        />
      </div>

      {/* Password */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={onChangeHandler}
            placeholder="Enter password"
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-4 pr-14 text-sm text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500 transition hover:text-black"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={onChangeHandler}
            className="h-4 w-4 rounded border-gray-300 accent-black focus:ring-0"
          />
          Remember Me
        </label>
        <Link
          to="/forgot-password"
          className="text-sm font-semibold text-black underline underline-offset-2 transition hover:text-gray-600"
        >
          Forgot Password?
        </Link>
      </div>

      {/* Login Button */}
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
            Logging In...
          </div>
        ) : (
          "Login"
        )}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <span className="text-xs font-medium text-gray-400">OR</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* Google */}
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
      </button>
    </form>
  );
};

export default LoginForm;