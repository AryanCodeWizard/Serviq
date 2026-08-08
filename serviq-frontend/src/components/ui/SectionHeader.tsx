import type { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

const SectionHeader = ({ eyebrow, title, description, actions }: SectionHeaderProps) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div className="max-w-2xl">
      <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">
        <span className="h-1.5 w-1.5 rounded-full bg-black" aria-hidden="true" />
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-black sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base leading-7 text-gray-500 sm:mt-4 sm:text-lg">
          {description}
        </p>
      )}
    </div>
    {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
  </div>
);

export default SectionHeader;