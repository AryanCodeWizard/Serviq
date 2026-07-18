import React from "react";
import SignUpForm from "../components/SignUpForm";

const features = [
  {
    title: "Verified Professionals",
    description:
      "Every worker is background verified and professionally trained before joining our platform.",
    icon: "🛡️",
  },
  {
    title: "Transparent Pricing",
    description:
      "Know the service price before booking. No hidden charges or surprises.",
    icon: "💳",
  },
  {
    title: "24×7 Customer Support",
    description:
      "Our support team is always available whenever you need assistance.",
    icon: "🎧",
  },
];

const stats = [
  {
    value: "50K+",
    label: "Professionals",
  },
  {
    value: "4.8★",
    label: "Customer Rating",
  },
  {
    value: "500K+",
    label: "Happy Customers",
  },
];

const SignUp = () => {
  return (
    <main className="relative overflow-hidden bg-slate-50">
      {/* Background Decorations */}

      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-100 blur-3xl opacity-60" />

      <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-cyan-100 blur-3xl opacity-60" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
          {/* LEFT */}

          <section>
            <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              Trusted by thousands of customers
            </span>

            <h1 className="mt-6 text-4xl font-black leading-tight text-slate-900 lg:text-6xl">
              Create your account &
              <span className="block text-blue-600">
                book trusted professionals
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Join India's trusted home service platform. Find verified workers,
              transparent pricing, and hassle-free bookings for every service.
            </p>

            {/* Highlights */}

            <div className="mt-10 space-y-4">
              {[
                "Instant booking confirmation",
                "Background verified professionals",
                "Transparent pricing",
                "Secure online payments",
                "100% trusted platform",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 font-bold text-green-600">
                    ✓
                  </div>

                  <p className="font-medium text-slate-700">{item}</p>
                </div>
              ))}
            </div>

            {/* Stats */}

            <div className="mt-12 grid grid-cols-3 gap-5">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <h2 className="text-3xl font-black text-slate-900">
                    {item.value}
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Features */}

            <div className="mt-12 space-y-5">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
                >
                  <div className="flex gap-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                      {feature.icon}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {feature.title}
                      </h3>

                      <p className="mt-2 leading-7 text-slate-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* RIGHT */}

          <section className="w-full">
            <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-2xl lg:p-10">
              <SignUpForm />

              <div className="mt-8 border-t border-slate-200 pt-6">
                <div className="flex flex-wrap justify-center gap-5 text-sm font-medium text-slate-500">
                  <span>🔒 Secure Signup</span>

                  <span>✔ SSL Protected</span>

                  <span>⭐ Trusted Platform</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default SignUp;