import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import BookingFlowModal from "../../../components/booking/BookingFlowModal";
import { homeServices } from "../../../utils/serviceCatalog";

const Services = () => {
  const [selectedService, setSelectedService] = useState<(typeof homeServices)[number] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return homeServices;
    return homeServices.filter((service) => `${service.label} ${service.description}`.toLowerCase().includes(term));
  }, [searchTerm]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gray-500">Services</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">Book the right help for your home</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">Browse trusted household services and book in minutes with automatic assignment.</p>
          </div>
          <Link to="/dashboard" className="inline-flex rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
            Back to dashboard
          </Link>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="overflow-hidden rounded-[1.5rem] border border-gray-200">
            <img
              src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80"
              alt="Professional service at a home"
              className="h-64 w-full object-cover"
            />
          </div>
          <div className="rounded-[1.5rem] border border-gray-200 bg-gray-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gray-500">Why it feels premium</p>
            <h2 className="mt-3 text-2xl font-semibold text-gray-950">Beautiful, fast, and dependable</h2>
            <p className="mt-3 text-sm leading-7 text-gray-600">Each booking is backed by verified professionals, clear pricing, and a seamless experience from discovery to completion.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-gray-600">Verified experts</span>
              <span className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-gray-600">Easy rescheduling</span>
              <span className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-gray-600">Transparent pricing</span>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[1.5rem] border border-gray-200 bg-gray-50 p-4">
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search services"
            className="w-full rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-black"
          />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredServices.map((service) => (
            <button
              key={service.label}
              type="button"
              onClick={() => setSelectedService(service)}
              className="overflow-hidden rounded-[1.5rem] border border-gray-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:border-gray-300"
            >
              <img src={service.image} alt={service.label} className="h-40 w-full object-cover" loading="lazy" />
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl">{service.icon}</div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{service.duration}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-950">{service.label}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{service.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm font-semibold text-gray-900">
                  <span>From ₹{service.price}</span>
                  <span>Book →</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <BookingFlowModal isOpen={Boolean(selectedService)} onClose={() => setSelectedService(null)} service={selectedService} />
    </main>
  );
};

export default Services;
