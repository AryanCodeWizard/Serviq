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
            const seed = encodeURIComponent(activeSession?.user.fullName || activeSession?.user.email || "ServiQ");
            return `https://api.dicebear.com/10.x/initials/svg?seed=${seed}`;
        };

        const ensureProfile = async () => {
            if (!activeSession) {
                return null;
            }

            const fallbackAuthUserId = activeSession.user._id ?? activeSession.user.authUserId;

            if (!fallbackAuthUserId) {
                return null;
            }

            await createProfileAPI(
                {
                    authUserId: fallbackAuthUserId,
                    email: activeSession.user.email,
                    fullName: activeSession.user.fullName,
                    profileImage: buildFallbackProfileImage(),
                    role: activeSession.user.role,
                },
                { signal: abortController.signal }
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
                } else if (axios.isAxiosError(profileResult.reason) && profileResult.reason.response?.status === 404) {
                    try {
                        const createdProfile = await ensureProfile();
                        setProfile(createdProfile);
                    } catch (profileCreationError) {
                        if (!abortController.signal.aborted) {
                            const message = profileCreationError instanceof Error ? profileCreationError.message : "Profile setup failed";
                            setError(message);
                            toast.error(message);
                        }
                    }
                } else if (!abortController.signal.aborted) {
                    const message = profileResult.reason instanceof Error ? profileResult.reason.message : "Failed to load profile";
                    setError(message);
                    toast.error(message);
                }

                if (bookingResult.status === "fulfilled") {
                    setBookings((bookingResult.value.data.data ?? []) as BookingSummary[]);
                } else if (!abortController.signal.aborted) {
                    const message = bookingResult.reason instanceof Error ? bookingResult.reason.message : "Failed to load bookings";
                    setError((current) => current ?? message);
                    toast.error(message);
                }
            } catch (requestError) {
                if (!abortController.signal.aborted) {
                    const message = requestError instanceof Error ? requestError.message : "Failed to load dashboard";
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
    }, [session?.user.role]);

    const handleServiceClick = (service: string) => {
        navigate(`/bookings?category=${encodeURIComponent(service)}`);
    };

    const bookingStats = useMemo(() => {
        const total = bookings.length;
        const completed = bookings.filter((booking) => booking.bookingStatus === "Completed").length;
        const active = bookings.filter((booking) => ["Pending", "Accepted", "In Progress"].includes(booking.bookingStatus)).length;

        return { total, completed, active };
    }, [bookings]);

    return (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <section className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gray-500">Dashboard</p>
                        <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                            Welcome back{profile?.fullName ? `, ${profile.fullName}` : ""}.
                        </h1>
                        <p className="mt-3 text-base leading-7 text-gray-600">
                            Review your profile, track bookings, and keep your ServiQ account ready for the next request.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[320px]">
                        {[
                            { label: "Bookings", value: bookingStats.total },
                            { label: "Active", value: bookingStats.active },
                            { label: "Completed", value: bookingStats.completed },
                        ].map((item) => (
                            <div key={item.label} className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                                <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">{item.label}</p>
                                <p className="mt-2 text-2xl font-semibold text-gray-950">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="h-56 animate-pulse rounded-3xl bg-gray-100" />
                        <div className="h-56 animate-pulse rounded-3xl bg-gray-100" />
                    </div>
                ) : error ? (
                    <div className="mt-8 rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
                        {error}
                    </div>
                ) : (
                    <>
                        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                            <section className="rounded-3xl border border-gray-200 bg-white p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-950">Account profile</h2>
                                        <p className="mt-1 text-sm text-gray-500">Pulled directly from the user service.</p>
                                    </div>
                                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusToneMap[profile?.workerApplicationStatus ?? "Pending"] ?? "bg-gray-50 text-gray-700 border-gray-200"}`}>
                                        {profile?.role ?? session?.user.role ?? "User"}
                                    </span>
                                </div>

                                <div className="mt-5 grid gap-4 sm:grid-cols-[auto_1fr]">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-lg font-semibold text-gray-700">
                                        {profile?.fullName?.slice(0, 2)?.toUpperCase() ?? "S"}
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-gray-950">{profile?.fullName ?? session?.user.fullName}</p>
                                        <p className="text-sm text-gray-500">{profile?.email ?? session?.user.email}</p>
                                        <p className="mt-2 text-sm leading-6 text-gray-600">{profile?.bio || "No bio has been added yet."}</p>
                                    </div>
                                </div>

                                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                    <DetailPill label="Phone" value={profile?.phone ?? "Not provided"} />
                                    <DetailPill label="Address" value={profile?.address ?? "Not provided"} />
                                    <DetailPill label="Skills" value={profile?.skills?.length ? profile.skills.join(", ") : "Not provided"} />
                                    <DetailPill label="Services" value={profile?.serviceCategory?.length ? profile.serviceCategory.join(", ") : "Not provided"} />
                                </div>
                            </section>

                            <section className="rounded-3xl border border-gray-200 bg-white p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-950">Recent bookings</h2>
                                        <p className="mt-1 text-sm text-gray-500">Live data from the booking service.</p>
                                    </div>
                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                                        {session?.user.role === "Worker" ? "Worker view" : "Customer view"}
                                    </span>
                                </div>

                                <div className="mt-5 space-y-4">
                                    {bookings.length > 0 ? bookings.slice(0, 5).map((booking) => (
                                        <article key={booking._id} className="rounded-2xl border border-gray-200 p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <h3 className="font-semibold text-gray-950">{booking.service.join(", ")}</h3>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {format(new Date(booking.bookingDate), "dd MMM yyyy")} at {booking.bookingTime}
                                                    </p>
                                                </div>
                                                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusToneMap[booking.bookingStatus] ?? "bg-gray-50 text-gray-700 border-gray-200"}`}>
                                                    {booking.bookingStatus}
                                                </span>
                                            </div>
                                            <p className="mt-3 text-sm leading-6 text-gray-600">{booking.problemDescription}</p>
                                            <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
                                                <span className="rounded-full bg-gray-50 px-2.5 py-1">{booking.paymentStatus}</span>
                                                <span className="rounded-full bg-gray-50 px-2.5 py-1">{booking.paymentMethod}</span>
                                                <span className="rounded-full bg-gray-50 px-2.5 py-1">₹{booking.price}</span>
                                            </div>
                                        </article>
                                    )) : (
                                        <div className="rounded-2xl border border-dashed border-gray-300 px-5 py-10 text-center">
                                            <p className="text-base font-medium text-gray-950">No bookings yet</p>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Your upcoming bookings will appear here once they are created from the booking flow.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>

                        <section className="mt-10 rounded-3xl border border-gray-200 bg-white p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-950">Book a service</h2>
                                <p className="mt-1 text-sm text-gray-500">Quickly start a booking from your dashboard.</p>
                            </div>
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">Start booking</span>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {services.map((service) => (
                                <button
                                    key={service.title}
                                    type="button"
                                    onClick={() => handleServiceClick(service.title)}
                                    className="group rounded-3xl border border-gray-200 bg-white p-5 text-left transition hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-2xl transition group-hover:bg-black group-hover:text-white">
                                        {service.icon}
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold text-gray-950">{service.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-gray-500">{service.desc}</p>
                                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-black transition group-hover:text-gray-900">
                                        Book now <span className="text-lg">→</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>
                    </>
                )}
            </section>
        </main>
    );
};

const DetailPill = ({ label, value }: { label: string; value: string }) => (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">{label}</p>
        <p className="mt-2 text-sm font-medium text-gray-900">{value}</p>
    </div>
);

export default Dashboard;