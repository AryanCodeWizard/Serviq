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
    return services.filter((service) => `${service.label} ${service.description}`.toLowerCase().includes(term));
  }, [searchTerm]);

  const handleServiceClick = (service: ServiceOption) => {
    setSelectedService(service);
  };

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
              <button
                type="button"
                onClick={() => setSelectedService(services[0])}
                className="rounded-full bg-black px-8 py-3.5 text-base font-bold text-white shadow-lg transition hover:bg-gray-800 hover:shadow-xl active:scale-[0.98]"
              >
                Book a Service
              </button>
              <Link
                to="/bookings"
                className="flex items-center gap-2 rounded-full border border-gray-200 px-8 py-3.5 text-base font-semibold text-gray-700 transition hover:bg-gray-50 hover:shadow-md"
              >
                My Bookings →
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

          {/* Right – visual showcase */}
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
              <img
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80"
                alt="A professional helping a happy home owner"
                className="h-80 w-full object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">Live booking experience</p>
                    <h3 className="mt-2 text-xl font-semibold text-black">Fast, friendly, and fully verified</h3>
                  </div>
                  <span className="rounded-full bg-black px-3 py-1 text-sm font-semibold text-white">24/7</span>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {stats.map((s) => (
                    <div key={s.label} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <p className="text-2xl font-extrabold text-black">{s.value}</p>
                      <p className="mt-1 text-sm font-medium text-gray-500">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────── */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Services for your home</span>
              <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-black lg:text-5xl">
                Trusted help for everyday chores
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Browse popular household services, then book in minutes with automatic professional assignment.
              </p>
            </div>
            <div className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm">
              Verified professionals • Transparent pricing
            </div>
          </div>

          <div className="mb-6 rounded-[24px] border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search services"
              className="w-full rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-black"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <button
                key={service.label}
                onClick={() => handleServiceClick(service)}
                type="button"
                className="group overflow-hidden rounded-[24px] border border-gray-200 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)]"
              >
                <img src={service.image} alt={service.label} className="h-40 w-full object-cover" loading="lazy" />
                <div className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                    {service.icon}
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-black">{service.label}</h3>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{service.duration}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-gray-500">{service.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">From ₹{service.price}</span>
                    <span className="text-sm font-semibold text-black">Book →</span>
                  </div>
                </div>
              </button>
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

      {/* ── VIDEO SHOWCASE ─────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">See ServiQ in action</span>
              <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-black lg:text-5xl">
                A polished booking flow built for modern homes
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-500">
                From discovery to doorstep delivery, every step feels smooth, visual, and trustworthy.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600">Instant booking</span>
                <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600">Verified professionals</span>
                <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600">Flexible schedules</span>
              </div>
            </div>
            <div className="overflow-hidden rounded-[2rem] border border-gray-200 bg-gray-50 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
              <div className="aspect-video w-full">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/ScMzIvxBSi4?rel=0"
                  title="ServiQ service experience"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
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

      <BookingFlowModal isOpen={Boolean(selectedService)} onClose={() => setSelectedService(null)} service={selectedService} />

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