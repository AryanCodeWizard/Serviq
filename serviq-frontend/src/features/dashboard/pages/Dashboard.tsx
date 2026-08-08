import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import axios from "axios";
import toast from "react-hot-toast";
import { getCustomerBookingsAPI, getWorkerBookingsAPI } from "../../../api/booking";
import { createProfileAPI, getProfileDetailsAPI, type UserProfile } from "../../../api/user";
import { useAppSelector } from "../../../app/hooks";

interface BookingSummary {
  _id: string;
  service: string[];
  bookingDate: string;
  bookingTime: string;
  bookingStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  price: number;
  customerAddress: string;
  problemDescription: string;
  customerPhoneNumber: string;
  workerPhoneNumber: string;
  createdAt?: string;
}

const statusToneMap: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Accepted: "bg-sky-50 text-sky-700 border-sky-200",
  "In Progress": "bg-violet-50 text-violet-700 border-violet-200",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

const services = [
  { icon: "🧹", title: "Deep Cleaning", desc: "Full home & office cleaning with trained staff." },
  { icon: "🔧", title: "Plumbing", desc: "Leak fixes, pipe work, and full plumbing repairs." },
  { icon: "⚡", title: "Electrical", desc: "Wiring, fitting, and safety inspections." },
  { icon: "❄️", title: "AC Repair", desc: "AC servicing, installation & gas refill." },
  { icon: "🛋️", title: "Carpentry", desc: "Furniture assembly, repair & custom woodwork." },
  { icon: "💅", title: "Beauty & Spa", desc: "At-home salon services for men & women." },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const session = useAppSelector((state) => state.auth.session);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    const activeSession = session;

    const buildFallbackProfileImage = () => {
      const seed = encodeURIComponent(
        activeSession?.user.fullName || activeSession?.user.email || "ServiQ",
      );
      return `https://api.dicebear.com/10.x/initials/svg?seed=${seed}`;
    };

    const ensureProfile = async () => {
      if (!activeSession) return null;
      const fallbackAuthUserId = activeSession.user._id ?? activeSession.user.authUserId;
      if (!fallbackAuthUserId) return null;

      await createProfileAPI(
        {
          authUserId: fallbackAuthUserId,
          email: activeSession.user.email,
          fullName: activeSession.user.fullName,
          profileImage: buildFallbackProfileImage(),
          role: activeSession.user.role,
        },
        { signal: abortController.signal },
      );

      const retryResponse = await getProfileDetailsAPI({ signal: abortController.signal });
      return retryResponse.data.data ?? null;
    };

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const [profileResult, bookingResult] = await Promise.allSettled([
          getProfileDetailsAPI({ signal: abortController.signal }),
          activeSession?.user.role === "Worker"
            ? getWorkerBookingsAPI(undefined, { signal: abortController.signal })
            : getCustomerBookingsAPI(undefined, { signal: abortController.signal }),
        ]);

        if (profileResult.status === "fulfilled") {
          setProfile(profileResult.value.data.data ?? null);
        } else if (
          axios.isAxiosError(profileResult.reason) &&
          profileResult.reason.response?.status === 404
        ) {
          try {
            const createdProfile = await ensureProfile();
            setProfile(createdProfile);
          } catch (profileCreationError) {
            if (!abortController.signal.aborted) {
              const message =
                profileCreationError instanceof Error
                  ? profileCreationError.message
                  : "Profile setup failed";
              setError(message);
              toast.error(message);
            }
          }
        } else if (!abortController.signal.aborted) {
          const message =
            profileResult.reason instanceof Error
              ? profileResult.reason.message
              : "Failed to load profile";
          setError(message);
          toast.error(message);
        }

        if (bookingResult.status === "fulfilled") {
          setBookings((bookingResult.value.data.data ?? []) as BookingSummary[]);
        } else if (!abortController.signal.aborted) {
          const message =
            bookingResult.reason instanceof Error
              ? bookingResult.reason.message
              : "Failed to load bookings";
          setError((current) => current ?? message);
          toast.error(message);
        }
      } catch (requestError) {
        if (!abortController.signal.aborted) {
          const message =
            requestError instanceof Error ? requestError.message : "Failed to load dashboard";
          setError(message);
          toast.error(message);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void loadDashboard();
    return () => abortController.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user.role]);

  const handleServiceClick = (service: string) => {
    navigate(`/bookings?category=${encodeURIComponent(service)}`);
  };

  const bookingStats = useMemo(() => {
    const total = bookings.length;
    const completed = bookings.filter(
      (booking) => booking.bookingStatus === "Completed",
    ).length;
    const active = bookings.filter((booking) =>
      ["Pending", "Accepted", "In Progress"].includes(booking.bookingStatus),
    ).length;
    return { total, completed, active };
  }, [bookings]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-[1.25rem] border border-gray-200 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:p-8">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">
              Dashboard
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-black sm:text-4xl">
              Welcome back{profile?.fullName ? `, ${profile.fullName}` : ""}.
            </h1>
            <p className="mt-3 text-base leading-7 text-gray-600">
              Review your profile, track bookings, and keep your ServiQ account ready for the next
              request.
            </p>
          </div>

          {/* Stats */}
          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[320px]">
            {[
              { label: "Bookings", value: bookingStats.total, icon: "📋" },
              { label: "Active", value: bookingStats.active, icon: "⚡" },
              { label: "Completed", value: bookingStats.completed, icon: "✅" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 shadow-sm"
              >
                <span className="text-xl" aria-hidden="true">{item.icon}</span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
                    {item.label}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-black">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="animate-pulse space-y-4">
              <div className="h-8 w-48 rounded-lg bg-gray-200" />
              <div className="h-40 rounded-xl bg-gray-100" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-20 rounded-xl bg-gray-100" />
                <div className="h-20 rounded-xl bg-gray-100" />
                <div className="h-20 rounded-xl bg-gray-100" />
                <div className="h-20 rounded-xl bg-gray-100" />
              </div>
            </div>
            <div className="animate-pulse space-y-3">
              <div className="h-8 w-48 rounded-lg bg-gray-200" />
              <div className="h-24 rounded-xl bg-gray-100" />
              <div className="h-24 rounded-xl bg-gray-100" />
              <div className="h-24 rounded-xl bg-gray-100" />
            </div>
            <div className="animate-pulse lg:col-span-2 mt-10">
              <div className="h-8 w-48 rounded-lg bg-gray-200 mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-40 rounded-xl bg-gray-100" />
                ))}
              </div>
            </div>
          </div>
        ) : error ? (
          /* Error */
          <div className="mt-8 rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm font-medium text-rose-700 shadow-sm">
            <div className="flex items-start gap-3">
              <svg className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <div>
                <p className="font-semibold text-rose-800">Something went wrong</p>
                <p className="mt-1 text-sm font-normal">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Profile + Recent Bookings row */}
            <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              {/* Account Profile */}
              <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-black">Account profile</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Your personal and service information.
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                      statusToneMap[profile?.workerApplicationStatus ?? "Pending"] ??
                      "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-75" aria-hidden="true" />
                    {profile?.role ?? session?.user.role ?? "User"}
                  </span>
                </div>

                <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-black text-lg font-bold text-white shadow-sm">
                    {profile?.fullName?.slice(0, 2)?.toUpperCase() ?? "S"}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-black">
                      {profile?.fullName ?? session?.user.fullName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {profile?.email ?? session?.user.email}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {profile?.bio || "No bio has been added yet."}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <DetailPill label="Phone" value={profile?.phone ?? "Not provided"} icon="📞" />
                  <DetailPill label="Address" value={profile?.address ?? "Not provided"} icon="📍" />
                  <DetailPill
                    label="Skills"
                    value={
                      profile?.skills?.length
                        ? profile.skills.join(", ")
                        : "Not provided"
                    }
                    icon="🛠️"
                  />
                  <DetailPill
                    label="Services"
                    value={
                      profile?.serviceCategory?.length
                        ? profile.serviceCategory.join(", ")
                        : "Not provided"
                    }
                    icon="📦"
                  />
                </div>
              </section>

              {/* Recent Bookings */}
              <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-black">Recent bookings</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Latest activity from your account.
                    </p>
                  </div>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                    {session?.user.role === "Worker" ? "Worker view" : "Customer view"}
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  {bookings.length > 0 ? (
                    bookings.slice(0, 5).map((booking) => (
                      <article
                        key={booking._id}
                        className="group rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-sm cursor-pointer"
                        onClick={() => navigate(`/bookings/${booking._id}`)}
                        tabIndex={0}
                        role="link"
                        aria-label={`Booking for ${booking.service.join(", ")} on ${format(new Date(booking.bookingDate), "dd MMM yyyy")}`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            navigate(`/bookings/${booking._id}`);
                          }
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-black group-hover:text-gray-800 transition-colors">
                              {booking.service.join(", ")}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {format(new Date(booking.bookingDate), "dd MMM yyyy")} at{" "}
                              {booking.bookingTime}
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                              statusToneMap[booking.bookingStatus] ??
                              "bg-gray-50 text-gray-700 border-gray-200"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                booking.bookingStatus === "Completed"
                                  ? "bg-emerald-500"
                                  : booking.bookingStatus === "Cancelled"
                                  ? "bg-rose-500"
                                  : booking.bookingStatus === "In Progress"
                                  ? "bg-violet-500"
                                  : booking.bookingStatus === "Accepted"
                                  ? "bg-sky-500"
                                  : "bg-amber-500"
                              }`}
                              aria-hidden="true"
                            />
                            {booking.bookingStatus}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-gray-600 line-clamp-2">
                          {booking.problemDescription}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          <span className="rounded-full bg-white border border-gray-200 px-2.5 py-1">
                            {booking.paymentStatus}
                          </span>
                          <span className="rounded-full bg-white border border-gray-200 px-2.5 py-1">
                            {booking.paymentMethod}
                          </span>
                          <span className="rounded-full bg-white border border-gray-200 px-2.5 py-1 font-semibold text-gray-700">
                            ₹{booking.price}
                          </span>
                          <span className="ml-auto text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-black" aria-hidden="true">
                            →
                          </span>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="flex flex-col items-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-10 text-center">
                      <svg
                        className="mb-3 h-10 w-10 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                        />
                      </svg>
                      <p className="text-sm font-medium text-gray-500">No bookings yet</p>
                      <p className="mt-1 text-xs text-gray-400">
                        Your upcoming bookings will appear here once they are created.
                      </p>
                      <button
                        type="button"
                        onClick={() => navigate("/bookings")}
                        className="mt-4 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 active:scale-[0.98]"
                      >
                        Book a service
                      </button>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Quick book section */}
            <section className="mt-10 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-black">Book a service</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Quickly start a booking from your dashboard.
                  </p>
                </div>
                <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                  Quick book
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <button
                    key={service.title}
                    type="button"
                    onClick={() => handleServiceClick(service.title)}
                    className="group rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-gray-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-2xl transition group-hover:bg-black group-hover:text-white group-hover:scale-105">
                      {service.icon}
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-black group-hover:text-gray-900 transition-colors">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">
                      {service.desc}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-black transition group-hover:translate-x-0.5">
                      Book now <span className="text-lg">→</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
};

const DetailPill = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: string;
}) => (
  <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
    {icon && (
      <span className="text-lg" aria-hidden="true">
        {icon}
      </span>
    )}
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-black">{value}</p>
    </div>
  </div>
);

export default Dashboard;