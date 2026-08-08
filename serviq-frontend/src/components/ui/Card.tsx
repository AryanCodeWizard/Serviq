import clsx from "clsx";
import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "surface";
}

const variantClasses: Record<NonNullable<CardProps["variant"]>, string> = {
  default:
    "rounded-[1.75rem] border border-gray-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-shadow duration-200",
  surface:
    "rounded-[1.75rem] border border-gray-200 bg-gray-50",
};

const Card = ({ children, variant = "default", className, ...props }: CardProps) => {
  return (
    <div className={clsx(variantClasses[variant], className)} {...props}>
      {children}
    </div>
  );
};

export default Card;