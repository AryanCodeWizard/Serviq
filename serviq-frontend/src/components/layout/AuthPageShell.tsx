import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface FeatureItem {
  icon: string;
  text: string;
}

interface AuthPageShellProps {
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  ctaLabel: string;
  ctaPrompt?: string;
  features: FeatureItem[];
  children: ReactNode;
}

const AuthPageShell = ({
  title,
  description,
  ctaText,
  ctaLink,
  ctaLabel,
  ctaPrompt,
  features,
  children,
}: AuthPageShellProps) => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gray-50 text-gray-900 antialiased">
      {/* Refined background with soft radial glow */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.03),transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-2">
        {/* Left panel – Branding & Features (elevated) */}
        <section
          className="relative flex flex-col justify-center gap-10 bg-white px-6 py-14 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] sm:px-12 sm:py-20 lg:px-16"
          aria-labelledby="auth-heading"
        >
          {/* Decorative blur behind left panel */}
          <div
            className="pointer-events-none absolute -top-32 left-0 h-64 w-64 rounded-full bg-black/5 blur-3xl"
            aria-hidden="true"
          />

          {/* Brand card */}
          <div
            className="relative flex items-center gap-4 rounded-[2rem] border border-gray-100 bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
            aria-label="ServiQ brand"
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-2xl font-black text-white shadow-md"
              aria-hidden="true"
            >
              S
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
                ServiQ
              </p>
              <p className="text-sm font-bold text-gray-900">
                Premium home services
              </p>
            </div>
            <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              🇮🇳 Trusted
            </span>
          </div>

          {/* Headline */}
          <div className="relative max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
              {ctaText}
            </p>
            <h1
              id="auth-heading"
              className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-black sm:text-5xl lg:text-6xl"
            >
              {title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-500 sm:text-xl">
              {description}
            </p>
          </div>

          {/* Feature list – interactive cards */}
          <ul className="space-y-4" aria-label="Why choose ServiQ">
            {features.map((feature) => (
              <li
                key={feature.text}
                className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50/80 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-l-4 hover:border-l-black hover:bg-white hover:shadow-lg"
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black text-lg font-bold text-white shadow transition-transform duration-300 group-hover:scale-105"
                  aria-hidden="true"
                >
                  {feature.icon}
                </div>
                <p className="text-sm font-semibold text-gray-700 group-hover:text-black sm:text-base">
                  {feature.text}
                </p>
              </li>
            ))}
          </ul>

          {/* CTA prompt */}
          <p className="text-sm text-gray-500">
            {ctaPrompt ?? "Already have an account?"}{" "}
            <Link
              to={ctaLink}
              className="font-bold text-black underline underline-offset-4 transition hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 rounded"
            >
              {ctaLabel}
            </Link>
          </p>
        </section>

        {/* Right panel – Form */}
        <aside
          className="flex items-center justify-center bg-gray-50/80 px-6 py-12 backdrop-blur-sm sm:px-10 lg:px-16"
          aria-label="Authentication form"
        >
          <div className="w-full max-w-md">{children}</div>
        </aside>
      </div>
    </main>
  );
};

export default AuthPageShell;