import clsx from "clsx";

interface BadgeProps {
  label: string;
  tone?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

const toneClasses: Record<NonNullable<BadgeProps["tone"]>, string> = {
  default: "bg-gray-100 text-gray-700 border border-gray-200",
  success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border border-amber-200",
  danger: "bg-rose-50 text-rose-700 border border-rose-200",
  info: "bg-sky-50 text-sky-700 border border-sky-200",
};

const Badge = ({ label, tone = "default", className }: BadgeProps) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide shadow-sm transition-colors",
        toneClasses[tone],
        className,
      )}
      role="status"
    >
      {label}
    </span>
  );
};

export default Badge;