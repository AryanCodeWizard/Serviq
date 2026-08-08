import clsx from "clsx";
import { useId, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = ({ label, error, className, ...props }: InputProps) => {
  const errorId = useId();

  return (
    <label className="block text-sm font-medium text-gray-900">
      {label && (
        <span className="mb-2 block text-sm font-medium text-gray-900">
          {label}
        </span>
      )}
      <input
        className={clsx(
          "w-full rounded-2xl border bg-white px-4 py-3 text-sm text-gray-950 outline-none transition-all duration-200",
          "placeholder:text-gray-400",
          "hover:border-gray-300",
          "focus:border-black focus:shadow-sm focus:ring-2 focus:ring-black/10",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100",
          error
            ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10"
            : "border-gray-200",
          className,
        )}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <p
          id={errorId}
          className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-600"
        >
          <svg
            className="h-3.5 w-3.5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
          {error}
        </p>
      )}
    </label>
  );
};

export default Input;