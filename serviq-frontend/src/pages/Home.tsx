import { Link } from "react-router-dom";

/* ─── Data ──────────────────────────────────────────────── */

const stats = [
  { value: "50K+", label: "Verified Professionals" },
  { value: "4.8★", label: "Average Rating" },
  { value: "500K+", label: "Happy Customers" },
  { value: "200+", label: "Cities Covered" },
];

const services = [
  { icon: "🧹", title: "Deep Cleaning", desc: "Full home & office cleaning with trained staff." },
  { icon: "🔧", title: "Plumbing", desc: "Leak fixes, pipe work, and full plumbing repairs." },
  { icon: "⚡", title: "Electrical", desc: "Wiring, fitting, and safety inspections." },
  { icon: "❄️", title: "AC Repair", desc: "AC servicing, installation & gas refill." },
  { icon: "🛋️", title: "Carpentry", desc: "Furniture assembly, repair & custom woodwork." },
  { icon: "💅", title: "Beauty & Spa", desc: "At-home salon services for men & women." },
];

const steps = [
  {
    step: "01",
    title: "Pick a Service",
    desc: "Browse our 50+ home service categories and select what you need.",
  },
  {
    step: "02",
    title: "Choose a Time",
    desc: "Pick a date and slot that works best for your schedule.",
  },
  {
    step: "03",
    title: "Expert Arrives",
    desc: "A background-verified professional shows up on time, every time.",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Home Owner, Mumbai",
    quote:
      "ServiQ made booking a plumber so effortless. The professional arrived in 2 hours and fixed everything perfectly!",
    rating: 5,
    avatar: "PS",
  },
  {
    name: "Rahul Mehta",
    role: "Startup Founder, Bangalore",
    quote:
      "I use ServiQ for office cleaning every week. Consistent quality, transparent pricing — absolutely love it.",
    rating: 5,
    avatar: "RM",
  },
  {
    name: "Anjali Verma",
    role: "Working Professional, Delhi",
    quote:
      "The at-home salon service was a game changer. Saved me hours and the quality was salon-level.",
    rating: 5,
    avatar: "AV",
  },
];

const faqs = [
  {
    q: "How are professionals verified?",
    a: "Every professional goes through identity verification, background checks, and skill assessments before being listed on ServiQ.",
  },
  {
    q: "What if I'm not satisfied with the service?",
    a: "We offer a 100% satisfaction guarantee. If you're not happy, we'll re-do the service for free or issue a full refund.",
  },
  {
    q: "How do I pay for services?",
    a: "We support UPI, cards, net banking, and cash on delivery. All online payments are SSL secured.",
  },
  {
    q: "Can I reschedule or cancel a booking?",
    a: "Yes! You can reschedule or cancel up to 2 hours before the appointment with no charges.",
  },
];

/* ─── Component ─────────────────────────────────────────── */

const Home = () => {
  return (
    <main className="relative bg-white overflow-hidden">
      {/* Global subtle dot-grid pattern */}
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-[0.025] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pt-32">
        {/* Faint glow blob */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-gray-100 blur-3xl opacity-60" />

        <div className="relative grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left – copy */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gray-500">
              🇮🇳 India's #1 Home Service Platform
            </span>

            <h1 className="mt-6 text-5xl font-extrabold leading-[1.1] tracking-tight text-black lg:text-6xl xl:text-7xl">
              Book trusted<br />
              <span className="relative">
                professionals
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M2 9C50 3 150 1 298 9" stroke="black" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
              <br />
              <span className="text-gray-400">for every home.</span>
            </h1>

            <p className="mt-8 max-w-lg text-lg leading-relaxed text-gray-500">
              From cleaning and repairs to beauty and maintenance — find verified workers, transparent pricing, and hassle‑free bookings delivered to your doorstep.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/signup"
                className="rounded-full bg-black px-8 py-3.5 text-base font-bold text-white shadow-lg transition hover:bg-gray-800 hover:shadow-xl active:scale-[0.98]"
              >
                Get Started — It's Free
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-full border border-gray-200 px-8 py-3.5 text-base font-semibold text-gray-700 transition hover:bg-gray-50 hover:shadow-md"
              >
                Log in →
              </Link>
            </div>

            {/* Trust bar */}
            <div className="mt-10 flex flex-wrap items-center gap-6">
              {["No hidden charges", "Verified professionals", "24×7 support"].map((t) => (
                <span key={t} className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">✓</span>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right – floating stat cards */}
          <div className="relative grid grid-cols-2 gap-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] duration-300 ${
                  i === 1 ? "mt-6" : i === 3 ? "-mt-6" : ""
                }`}
              >
                <p className="text-3xl font-extrabold text-black">{s.value}</p>
                <p className="mt-1 text-sm font-medium text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────── */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Section header */}
          <div className="mb-14 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">What we offer</span>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-black lg:text-5xl">
              Services at your doorstep
            </h2>
            <p className="mt-4 text-gray-500 text-lg max-w-xl mx-auto">
              50+ categories of home services, all delivered by trained & verified professionals.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.title}
                className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)]"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-2xl transition group-hover:bg-black group-hover:text-white duration-300">
                  {s.icon}
                </div>
                <h3 className="text-lg font-bold text-black">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{s.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-black opacity-0 transition group-hover:opacity-100 duration-200">
                  Book now →
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-14 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Simple process</span>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-black lg:text-5xl">
              How it works
            </h2>
            <p className="mt-4 text-gray-500 text-lg max-w-xl mx-auto">
              Book a service in under 2 minutes. It's that simple.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.step} className="relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="absolute right-0 top-8 hidden h-px w-full translate-x-1/2 border-t-2 border-dashed border-gray-200 md:block" />
                )}
                <div className="relative z-10 rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] duration-300">
                  <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-black text-lg font-extrabold text-white">
                    {step.step}
                  </span>
                  <h3 className="mt-4 text-xl font-bold text-black">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-14 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Customer love</span>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-black lg:text-5xl">
              Trusted by thousands
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="flex flex-col rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] duration-300"
              >
                {/* Stars */}
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-black text-sm">★</span>
                  ))}
                </div>
                <p className="flex-1 text-sm leading-relaxed text-gray-600">"{t.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-black">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="mb-14 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">FAQs</span>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-black lg:text-5xl">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm transition hover:shadow-md"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-black">
                  {faq.q}
                  <span className="ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition group-open:rotate-45 group-open:border-black group-open:text-black duration-200">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-gray-500">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-black px-8 py-16 text-center shadow-2xl lg:px-16">
          {/* Subtle grid overlay */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="relative">
            <h2 className="text-4xl font-extrabold tracking-tight text-white lg:text-5xl">
              Ready to get started?
            </h2>
            <p className="mt-4 text-lg text-gray-400 max-w-xl mx-auto">
              Join 500K+ happy customers who trust ServiQ for all their home service needs.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                to="/signup"
                className="rounded-full bg-white px-8 py-3.5 text-base font-bold text-black shadow-lg transition hover:bg-gray-100 hover:shadow-xl active:scale-[0.98]"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="rounded-full border border-white/20 px-8 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Log in →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="border-t border-gray-100 bg-white py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-sm font-bold text-white">
              S
            </div>
            <span className="text-sm font-semibold text-gray-700">ServiQ</span>
          </div>
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} ServiQ. All rights reserved.</p>
          <div className="flex gap-5 text-sm text-gray-400">
            <a href="#" className="transition hover:text-black">Privacy</a>
            <a href="#" className="transition hover:text-black">Terms</a>
            <a href="#" className="transition hover:text-black">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Home;