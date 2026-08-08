import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import BookingFlowModal from "../components/booking/BookingFlowModal";
import { homeServices, type ServiceOption } from "../utils/serviceCatalog";

/* ─── Data ──────────────────────────────────────────────── */

const stats = [
  { value: "50K+", label: "Verified Professionals" },
  { value: "4.8★", label: "Average Rating" },
  { value: "500K+", label: "Happy Customers" },
  { value: "200+", label: "Cities Covered" },
];

const services = homeServices;

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
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return services;
    return services.filter((service) =>
      `${service.label} ${service.description}`.toLowerCase().includes(term),
    );
  }, [searchTerm]);

  const handleServiceClick = (service: ServiceOption) => {
    setSelectedService(service);
  };

  return (
    <main className="relative bg-white">
      {/* Global subtle dot-grid pattern */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-32">
        {/* Faint glow blob */}
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-gray-100 blur-3xl opacity-60"
          aria-hidden="true"
        />

        <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Left – copy */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gray-500">
              🇮🇳 India's #1 Home Service Platform
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-black sm:text-5xl lg:text-6xl xl:text-7xl">
              Book trusted
              <br />
              <span className="relative inline-block">
                professionals
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M2 9C50 3 150 1 298 9"
                    stroke="black"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br />
              <span className="text-gray-400">for every home.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-gray-500 sm:mt-8 sm:text-lg">
              From cleaning and repairs to beauty and maintenance — find verified
              workers, transparent pricing, and hassle‑free bookings delivered to
              your doorstep.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4 sm:mt-10">
              <button
                type="button"
                onClick={() => setSelectedService(services[0])}
                className="rounded-full bg-black px-7 py-3 text-base font-bold text-white shadow-lg transition hover:bg-gray-800 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 active:scale-[0.98] sm:px-8 sm:py-3.5"
              >
                Book a Service
              </button>
              <Link
                to="/bookings"
                className="rounded-full border border-gray-200 px-7 py-3 text-base font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 active:scale-[0.98] sm:px-8 sm:py-3.5"
              >
                My Bookings →
              </Link>
            </div>

            {/* Trust bar */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 sm:mt-10">
              {["No hidden charges", "Verified professionals", "24×7 support"].map(
                (t) => (
                  <span
                    key={t}
                    className="flex items-center gap-2 text-sm font-medium text-gray-500"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                      ✓
                    </span>
                    {t}
                  </span>
                ),
              )}
            </div>
          </div>

          {/* Right – visual showcase */}
          <div className="relative">
            <div className="overflow-hidden rounded-[1.25rem] border border-gray-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
              <img
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80"
                alt="A smiling professional providing home service to a happy customer in a bright, modern living room"
                className="h-64 w-full object-cover sm:h-72 lg:h-80"
                loading="eager"
              />
              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
                      Live booking experience
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-black sm:text-xl">
                      Fast, friendly, and fully verified
                    </h3>
                  </div>
                  <span className="shrink-0 rounded-full bg-black px-3 py-1 text-sm font-semibold text-white">
                    24/7
                  </span>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {stats.map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl border border-gray-100 bg-gray-50 p-3 sm:p-4"
                    >
                      <p className="text-xl font-extrabold text-black sm:text-2xl">
                        {s.value}
                      </p>
                      <p className="mt-1 text-xs font-medium text-gray-500 sm:text-sm">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────── */}
      <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                Services for your home
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-black sm:text-4xl lg:text-5xl">
                Trusted help for everyday chores
              </h2>
              <p className="mt-4 text-base text-gray-500 sm:text-lg">
                Browse popular household services, then book in minutes with
                automatic professional assignment.
              </p>
            </div>
            <div className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" aria-hidden="true" />
              Verified professionals • Transparent pricing
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6 sm:mb-8">
            <label htmlFor="service-search" className="sr-only">
              Search services
            </label>
            <div className="relative">
              {/* Search icon */}
              <svg
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <input
                id="service-search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search services (e.g., plumbing, salon, cleaning)"
                className="w-full rounded-[1rem] border border-gray-200 bg-white py-3 pl-12 pr-12 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 sm:py-3.5 sm:text-base"
              />
              {/* Clear button */}
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                  aria-label="Clear search"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Services grid */}
          {filteredServices.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredServices.map((service) => (
                <button
                  key={service.label}
                  onClick={() => handleServiceClick(service)}
                  type="button"
                  className="group overflow-hidden rounded-[1.25rem] border border-gray-200 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                >
                  <img
                    src={service.image}
                    alt={`${service.label} service — ${service.description}`}
                    className="h-40 w-full object-cover"
                    loading="lazy"
                  />
                  <div className="p-5 sm:p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
                      {service.icon}
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-semibold text-black">
                        {service.label}
                      </h3>
                      <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                        {service.duration}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      {service.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">
                        From ₹{service.price}
                      </span>
                      <span className="text-sm font-semibold text-black transition group-hover:translate-x-0.5">
                        Book →
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            /* Empty state for search */
            <div className="flex flex-col items-center justify-center rounded-[1.25rem] border border-dashed border-gray-300 bg-white py-16 text-center">
              <svg
                className="mb-4 h-12 w-12 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <p className="text-base font-semibold text-gray-500">
                No services match "{searchTerm}"
              </p>
              <p className="mt-1 text-sm text-gray-400">
                Try a different search term or browse all services below.
              </p>
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="mt-4 rounded-full border border-gray-200 px-5 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center sm:mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Simple process
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-black sm:text-4xl lg:text-5xl">
              How it works
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-gray-500 sm:text-lg">
              Book a service in under 2 minutes. It's that simple.
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.step} className="relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div
                    className="absolute right-0 top-8 hidden h-px w-full translate-x-1/2 border-t-2 border-dashed border-gray-200 md:block"
                    aria-hidden="true"
                  />
                )}
                <div className="relative z-10 rounded-[1.25rem] border border-gray-100 bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] duration-300 sm:p-8">
                  <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-black text-lg font-extrabold text-white">
                    {step.step}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-black sm:text-xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500 sm:text-base">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VIDEO SHOWCASE ─────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                See ServiQ in action
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-black sm:text-4xl lg:text-5xl">
                A polished booking flow built for modern homes
              </h2>
              <p className="mt-4 text-base leading-7 text-gray-500 sm:text-lg sm:leading-8">
                From discovery to doorstep delivery, every step feels smooth,
                visual, and trustworthy.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600">
                  Instant booking
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600">
                  Verified professionals
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600">
                  Flexible schedules
                </span>
              </div>
            </div>
            <div className="overflow-hidden rounded-[1.25rem] border border-gray-200 bg-gray-50 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
              <div className="aspect-video w-full">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/ScMzIvxBSi4?rel=0"
                  title="ServiQ service experience — see how easy it is to book a home service"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center sm:mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Customer love
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-black sm:text-4xl lg:text-5xl">
              Trusted by thousands
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="flex flex-col rounded-[1.25rem] border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] duration-300 sm:p-7"
              >
                {/* Stars */}
                <div className="mb-4 flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-amber-500 text-sm">
                      ★
                    </span>
                  ))}
                </div>
                <blockquote className="flex-1">
                  <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                    "{t.quote}"
                  </p>
                </blockquote>
                <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-4">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white"
                    aria-hidden="true"
                  >
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
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center sm:mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              FAQs
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-black sm:text-4xl lg:text-5xl">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                name="faq-accordion"
                className="group rounded-[1.25rem] border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 rounded-[1.25rem] sm:px-6 sm:py-5 sm:text-base">
                  {faq.q}
                  <span className="ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition duration-200 group-open:rotate-45 group-open:border-black group-open:text-black">
                    +
                  </span>
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-gray-500 sm:px-6 sm:pb-6 sm:text-base">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Booking modal — functionality fully preserved */}
      <BookingFlowModal
        isOpen={Boolean(selectedService)}
        onClose={() => setSelectedService(null)}
        service={selectedService}
      />

      {/* ── CTA BANNER ───────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
        <div className="relative overflow-hidden rounded-[1.25rem] bg-black px-6 py-12 text-center shadow-2xl sm:px-8 sm:py-16 lg:px-16">
          {/* Subtle grid overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
            aria-hidden="true"
          />
          <div className="relative">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-gray-400 sm:text-lg">
              Join 500K+ happy customers who trust ServiQ for all their home
              service needs.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 sm:mt-10">
              <Link
                to="/signup"
                className="rounded-full bg-white px-7 py-3 text-base font-bold text-black shadow-lg transition hover:bg-gray-100 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-[0.98] sm:px-8 sm:py-3.5"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="rounded-full border border-white/20 px-7 py-3 text-base font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-[0.98] sm:px-8 sm:py-3.5"
              >
                Log in →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="border-t border-gray-100 bg-white py-8 sm:py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-sm font-bold text-white"
              aria-hidden="true"
            >
              S
            </div>
            <span className="text-sm font-semibold text-gray-700">ServiQ</span>
          </div>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} ServiQ. All rights reserved.
          </p>
          <div className="flex gap-5 text-sm text-gray-400">
            <a
              href="#"
              className="transition hover:text-black focus-visible:outline-none focus-visible:underline focus-visible:underline-offset-4"
              rel="noopener noreferrer"
            >
              Privacy
            </a>
            <a
              href="#"
              className="transition hover:text-black focus-visible:outline-none focus-visible:underline focus-visible:underline-offset-4"
              rel="noopener noreferrer"
            >
              Terms
            </a>
            <a
              href="#"
              className="transition hover:text-black focus-visible:outline-none focus-visible:underline focus-visible:underline-offset-4"
              rel="noopener noreferrer"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Home;