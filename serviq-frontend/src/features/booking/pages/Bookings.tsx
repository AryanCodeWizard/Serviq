import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { format } from "date-fns";
import { createBookingAPICall, getCustomerBookingsAPICall, getWorkerBookingsAPICall } from "../services/booking";
import { createProfileAPI, getProfileDetailsAPI, getWorkerDetailsAPI, type UserProfile } from "../../../api/user";
import { useAppSelector } from "../../../app/hooks";
import type { BookingPayload, BookingStatus } from "../../../types/booking";

interface BookingRecord {
    _id: string;
    service: string[];
    bookingDate: string;
    bookingTime: string;
    bookingStatus: BookingStatus;
    paymentStatus: string;
    paymentMethod: string;
    price: number;
    customerAddress: string;
    problemDescription: string;
    customerPhoneNumber: string;
    workerPhoneNumber: string;
    rejectReason?: string;
    createdAt?: string;
}

const serviceOptions = [
    "Deep Cleaning",
    "Plumbing",
    "Electrical",
    "AC Repair",
    "Carpentry",
    "Painting",
    "Pest Control",
    "Appliance Repair",
];

const bookingSchema = z.object({
    workerAuthId: z.string().min(1, "Worker is required"),
    service: z.array(z.string()).min(1, "Select at least one service"),
    bookingDate: z.string().min(1, "Booking date is required"),
    bookingTime: z.string().min(1, "Booking time is required"),
    customerAddress: z.string().min(8, "Customer address is required"),
    customerPhoneNumber: z.string().min(7, "Customer phone number is required"),
    workerPhoneNumber: z.string().min(7, "Worker phone number is required"),
    problemDescription: z.string().min(10, "Please describe the service need"),
    price: z.coerce.number().positive("Enter a valid price"),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const statusToneMap: Record<BookingStatus, string> = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Accepted: "bg-sky-50 text-sky-700 border-sky-200",
    "In Progress": "bg-violet-50 text-violet-700 border-violet-200",
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

const Bookings = () => {
    const navigate = useNavigate();
    const session = useAppSelector((state) => state.auth.session);
    const role = session?.user.role ?? "User";
    const isWorker = role === "Worker";
    const [bookings, setBookings] = useState<BookingRecord[]>([]);
    const [bookingsLoading, setBookingsLoading] = useState(true);
    const [bookingsError, setBookingsError] = useState<string | null>(null);
    const [selectedWorker, setSelectedWorker] = useState<UserProfile | null>(null);
    const [workerLookupId, setWorkerLookupId] = useState("");
    const [workerLookupLoading, setWorkerLookupLoading] = useState(false);
    const [workerLookupError, setWorkerLookupError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("all");

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<BookingFormValues>({
        resolver: zodResolver(bookingSchema) as unknown as Resolver<BookingFormValues>,
        defaultValues: {
            workerAuthId: "",
            service: [],
            bookingDate: "",
            bookingTime: "",
            customerAddress: "",
            customerPhoneNumber: "",
            workerPhoneNumber: "",
            problemDescription: "",
            price: 0,
        },
    });

    const selectedServices = watch("service");

    useEffect(() => {
        const abortController = new AbortController();
        const activeSession = session;

        const loadInitialState = async () => {
            try {
                setBookingsLoading(true);
                setBookingsError(null);

                const [profileResult, bookingsResult] = await Promise.allSettled([
                    getProfileDetailsAPI({ signal: abortController.signal }),
                    isWorker
                        ? getWorkerBookingsAPICall(statusFilter, { signal: abortController.signal })
                        : getCustomerBookingsAPICall(statusFilter, { signal: abortController.signal }),
                ]);

                if (profileResult.status === "fulfilled") {
                    const loadedProfile = profileResult.value.data.data ?? null;

                    if (!isWorker) {
                        if (loadedProfile?.address) {
                            setValue("customerAddress", loadedProfile.address);
                        }
                        if (loadedProfile?.phone) {
                            setValue("customerPhoneNumber", loadedProfile.phone);
                        }
                    }
                } else if (axios.isAxiosError(profileResult.reason) && profileResult.reason.response?.status === 404 && activeSession) {
                    const fallbackId = activeSession.user._id ?? activeSession.user.authUserId;
                    if (fallbackId) {
                        await createProfileAPI(
                            {
                                authUserId: fallbackId,
                                email: activeSession.user.email,
                                fullName: activeSession.user.fullName,
                                profileImage: `https://api.dicebear.com/10.x/initials/svg?seed=${encodeURIComponent(activeSession.user.fullName || activeSession.user.email || "ServiQ")}`,
                                role: activeSession.user.role,
                            },
                            { signal: abortController.signal }
                        );
                        const retryProfile = await getProfileDetailsAPI({ signal: abortController.signal });
                        const createdProfile = retryProfile.data.data ?? null;
                        if (!isWorker) {
                            if (createdProfile?.address) setValue("customerAddress", createdProfile.address);
                            if (createdProfile?.phone) setValue("customerPhoneNumber", createdProfile.phone);
                        }
                    }
                } else if (!abortController.signal.aborted) {
                    setBookingsError(profileResult.reason instanceof Error ? profileResult.reason.message : "Failed to load profile");
                }

                if (bookingsResult.status === "fulfilled") {
                    setBookings((bookingsResult.value.data.data ?? []) as BookingRecord[]);
                } else if (!abortController.signal.aborted) {
                    setBookingsError(bookingsResult.reason instanceof Error ? bookingsResult.reason.message : "Failed to load bookings");
                }
            } catch (requestError) {
                if (!abortController.signal.aborted) {
                    const message = requestError instanceof Error ? requestError.message : "Failed to load bookings";
                    setBookingsError(message);
                    toast.error(message);
                }
            } finally {
                if (!abortController.signal.aborted) {
                    setBookingsLoading(false);
                }
            }
        };

        void loadInitialState();
        return () => abortController.abort();
    }, [session, setValue, statusFilter, isWorker]);

    const bookingStats = useMemo(() => ({
        total: bookings.length,
        pending: bookings.filter((booking) => booking.bookingStatus === "Pending").length,
        active: bookings.filter((booking) => ["Accepted", "In Progress"].includes(booking.bookingStatus)).length,
        completed: bookings.filter((booking) => booking.bookingStatus === "Completed").length,
    }), [bookings]);

    const handleWorkerLookup = async () => {
        if (!workerLookupId.trim()) {
            setWorkerLookupError("Enter a worker auth ID or database ID.");
            return;
        }

        try {
            setWorkerLookupLoading(true);
            setWorkerLookupError(null);
            const response = await getWorkerDetailsAPI(workerLookupId.trim());
            const worker = response.data.data ?? null;
            setSelectedWorker(worker);
            if (worker?.authUserId || worker?._id) {
                setValue("workerAuthId", worker.authUserId || worker._id || "");
            }
            if (worker?.phone) {
                setValue("workerPhoneNumber", worker.phone);
            }
            toast.success("Worker loaded successfully");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Worker not found";
            setWorkerLookupError(message);
            setSelectedWorker(null);
            toast.error(message);
        } finally {
            setWorkerLookupLoading(false);
        }
    };

    const toggleService = (serviceName: string) => {
        const nextServices = selectedServices.includes(serviceName)
            ? selectedServices.filter((item) => item !== serviceName)
            : [...selectedServices, serviceName];
        setValue("service", nextServices, { shouldValidate: true });
    };

    const submitBooking: SubmitHandler<BookingFormValues> = async (values) => {
        if (!selectedWorker) {
            toast.error("Please load a worker before booking.");
            return;
        }

        const resolvedCustomerId = session?.user._id ?? session?.user.authUserId;
        if (!resolvedCustomerId) {
            toast.error("Unable to resolve your account identity.");
            return;
        }

        const payload: BookingPayload = {
            customerAuthId: resolvedCustomerId,
            workerAuthId: values.workerAuthId,
            service: values.service,
            bookingDate: values.bookingDate,
            bookingTime: values.bookingTime,
            customerAddress: values.customerAddress,
            customerPhoneNumber: values.customerPhoneNumber,
            workerPhoneNumber: values.workerPhoneNumber,
            problemDescription: values.problemDescription,
            price: values.price,
        };

        const response = await createBookingAPICall(payload);
        if (!response.data?.success) {
            throw new Error(response.data?.message || "Failed to create booking");
        }

        toast.success("Booking created successfully");
        reset();
        setSelectedWorker(null);
        setWorkerLookupId("");
        const createdBookingId = response.data.data?._id;
        if (createdBookingId) {
            navigate(`/bookings/${createdBookingId}`);
        } else {
            navigate("/bookings");
        }
    };

    const pageTitle = isWorker ? "Assigned bookings" : "Create and track bookings";
    const pageDescription = isWorker
        ? "Review assigned jobs, monitor status, and open a booking for details or status updates."
        : "Search a worker, book a slot, and keep tabs on your service history.";

    return (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <section className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-8">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gray-500">{isWorker ? "Worker bookings" : "Bookings"}</p>
                        <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">{pageTitle}</h1>
                        <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">{pageDescription}</p>
                    </div>

                    <Link to="/dashboard" className="inline-flex rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                        Back to dashboard
                    </Link>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-4">
                    {[
                        { label: "Total", value: bookingStats.total },
                        { label: "Pending", value: bookingStats.pending },
                        { label: "Active", value: bookingStats.active },
                        { label: "Completed", value: bookingStats.completed },
                    ].map((stat) => (
                        <div key={stat.label} className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">{stat.label}</p>
                            <p className="mt-2 text-2xl font-semibold text-gray-950">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                    {!isWorker ? (
                        <section className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-950">Create booking</h2>
                                    <p className="mt-1 text-sm text-gray-500">Select a verified worker and submit the booking request.</p>
                                </div>
                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">Customer view</span>
                            </div>

                            <form onSubmit={handleSubmit(submitBooking)} className="mt-6 space-y-6">
                                <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Worker Auth ID</label>
                                        <input
                                            value={workerLookupId}
                                            onChange={(event) => setWorkerLookupId(event.target.value)}
                                            placeholder="Paste worker auth ID or MongoDB ID"
                                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleWorkerLookup}
                                        disabled={workerLookupLoading}
                                        className="mt-auto rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {workerLookupLoading ? "Loading..." : "Load worker"}
                                    </button>
                                </div>
                                {workerLookupError && <p className="text-sm text-rose-600">{workerLookupError}</p>}

                                {selectedWorker ? (
                                    <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Selected Worker</p>
                                                <h3 className="mt-1 text-xl font-semibold text-gray-950">{selectedWorker.fullName}</h3>
                                                <p className="text-sm text-gray-500">{selectedWorker.email}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700">{selectedWorker.role}</span>
                                                <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700">{selectedWorker.workerApplicationStatus ?? "Pending"}</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                            <MiniInfo label="Phone" value={selectedWorker.phone ?? "Not provided"} />
                                            <MiniInfo label="Services" value={selectedWorker.serviceCategory?.join(", ") || "Not listed"} />
                                            <MiniInfo label="Availability" value={selectedWorker.isAvailable ? "Available" : "Unavailable"} />
                                            <MiniInfo label="Rating" value={`${selectedWorker.averageRating?.toFixed(1) ?? "0.0"} / 5`} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 px-5 py-6 text-sm text-gray-600">
                                        Load a worker to autofill worker details and continue.
                                    </div>
                                )}

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Services</label>
                                    <div className="flex flex-wrap gap-2">
                                        {serviceOptions.map((service) => {
                                            const active = selectedServices.includes(service);
                                            return (
                                                <button
                                                    key={service}
                                                    type="button"
                                                    onClick={() => toggleService(service)}
                                                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${active ? "border-black bg-black text-white" : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"}`}
                                                >
                                                    {service}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {errors.service && <p className="mt-2 text-sm text-rose-600">{errors.service.message}</p>}
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field label="Booking Date" error={errors.bookingDate?.message}>
                                        <input type="date" {...register("bookingDate")} className="input" />
                                    </Field>
                                    <Field label="Booking Time" error={errors.bookingTime?.message}>
                                        <input type="time" {...register("bookingTime")} className="input" />
                                    </Field>
                                    <Field label="Customer Phone" error={errors.customerPhoneNumber?.message}>
                                        <input placeholder="Customer phone number" {...register("customerPhoneNumber")} className="input" />
                                    </Field>
                                    <Field label="Worker Phone" error={errors.workerPhoneNumber?.message}>
                                        <input placeholder="Worker phone number" {...register("workerPhoneNumber")} className="input" />
                                    </Field>
                                </div>

                                <Field label="Customer Address" error={errors.customerAddress?.message}>
                                    <textarea rows={3} placeholder="Enter the service address" {...register("customerAddress")} className="input" />
                                </Field>

                                <Field label="Problem Description" error={errors.problemDescription?.message}>
                                    <textarea rows={4} placeholder="Describe the work you need done" {...register("problemDescription")} className="input" />
                                </Field>

                                <Field label="Price" error={errors.price?.message}>
                                    <input type="number" min="1" step="1" placeholder="Service price" {...register("price")} className="input" />
                                </Field>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || !selectedWorker}
                                    className="w-full rounded-full bg-black px-6 py-3.5 text-base font-semibold text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSubmitting ? "Creating booking..." : "Create booking"}
                                </button>
                            </form>
                        </section>
                    ) : (
                        <section className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-950">Worker overview</h2>
                                    <p className="mt-1 text-sm text-gray-500">Only assigned job details are shown for workers.</p>
                                </div>
                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">Worker view</span>
                            </div>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                <DetailPill label="Available jobs" value={String(bookingStats.pending)} />
                                <DetailPill label="In progress" value={String(bookingStats.active)} />
                                <DetailPill label="Completed" value={String(bookingStats.completed)} />
                                <DetailPill label="Total assigned" value={String(bookingStats.total)} />
                            </div>

                            <div className="mt-6 rounded-3xl border border-gray-200 bg-gray-50 p-5">
                                <h3 className="text-base font-semibold text-gray-950">What you can do</h3>
                                <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-600">
                                    <li>View assigned bookings and open details.</li>
                                    <li>Accept, move to in progress, or complete jobs from the booking details page.</li>
                                    <li>See customer address, contact numbers, and service description only when needed.</li>
                                </ul>
                            </div>
                        </section>
                    )}

                    <aside className="space-y-6">
                        <section className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-950">{isWorker ? "Assigned bookings" : "My bookings"}</h2>
                                    <p className="mt-1 text-sm text-gray-500">Latest records from the backend.</p>
                                </div>
                                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm">
                                    <option value="all">All</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Accepted">Accepted</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div className="mt-4 space-y-3">
                                {bookingsLoading ? (
                                    <div className="space-y-3">
                                        <div className="h-20 animate-pulse rounded-2xl bg-gray-100" />
                                        <div className="h-20 animate-pulse rounded-2xl bg-gray-100" />
                                    </div>
                                ) : bookingsError ? (
                                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{bookingsError}</div>
                                ) : bookings.length > 0 ? (
                                    bookings.slice(0, 5).map((booking) => (
                                        <Link key={booking._id} to={`/bookings/${booking._id}`} className="block rounded-2xl border border-gray-200 p-4 transition hover:border-gray-300 hover:bg-gray-50">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="font-semibold text-gray-950">{booking.service.join(", ")}</p>
                                                    <p className="mt-1 text-sm text-gray-500">{format(new Date(booking.bookingDate), "dd MMM yyyy")} at {booking.bookingTime}</p>
                                                </div>
                                                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusToneMap[booking.bookingStatus]}`}>{booking.bookingStatus}</span>
                                            </div>
                                            <p className="mt-3 text-sm leading-6 text-gray-600">{isWorker ? booking.customerAddress : booking.problemDescription}</p>
                                            <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
                                                <span className="rounded-full bg-gray-50 px-2.5 py-1">{booking.paymentStatus}</span>
                                                <span className="rounded-full bg-gray-50 px-2.5 py-1">{booking.paymentMethod}</span>
                                                <span className="rounded-full bg-gray-50 px-2.5 py-1">₹{booking.price}</span>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="rounded-2xl border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500">No bookings found yet.</div>
                                )}
                            </div>
                        </section>

                        {!isWorker && (
                            <section className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
                                <h2 className="text-xl font-semibold text-gray-950">Booking guide</h2>
                                <ol className="mt-4 space-y-3 text-sm text-gray-600">
                                    <li className="rounded-2xl bg-gray-50 px-4 py-3">1. Load the worker by auth ID or database ID.</li>
                                    <li className="rounded-2xl bg-gray-50 px-4 py-3">2. Pick one or more services and fill in the schedule.</li>
                                    <li className="rounded-2xl bg-gray-50 px-4 py-3">3. Submit to create a pending booking and jump to its detail view.</li>
                                </ol>
                            </section>
                        )}
                    </aside>
                </div>
            </section>
        </main>
    );
};

const Field = ({ label, error, children }: { label: string; error?: string; children: ReactNode }) => (
    <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>
        {children}
        {error && <span className="mt-1.5 block text-sm text-rose-600">{error}</span>}
    </label>
);

const MiniInfo = ({ label, value }: { label: string; value: string }) => (
    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">{label}</p>
        <p className="mt-1.5 text-sm font-medium text-gray-900">{value}</p>
    </div>
);

const DetailPill = ({ label, value }: { label: string; value: string }) => (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">{label}</p>
        <p className="mt-1.5 text-sm font-medium text-gray-900">{value}</p>
    </div>
);

export default Bookings;