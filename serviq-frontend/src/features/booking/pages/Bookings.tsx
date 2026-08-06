import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { format } from "date-fns";
import { createBookingAPICall, getCustomerBookingsAPICall, getWorkerBookingsAPICall } from "../services/booking";
import { createProfileAPI, getProfileDetailsAPI, getWorkersByCategoryAPI, type UserProfile } from "../../../api/user";
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

const serviceCategories = [
    { label: "Deep Cleaning", description: "Full home & office cleaning with trained staff.", icon: "🧹" },
    { label: "Plumbing", description: "Leak fixes, pipe work, and full plumbing repairs.", icon: "🔧" },
    { label: "Electrical", description: "Wiring, fitting, and safety inspections.", icon: "⚡" },
    { label: "AC Repair", description: "AC servicing, installation & gas refill.", icon: "❄️" },
    { label: "Carpentry", description: "Furniture assembly, repair & custom woodwork.", icon: "🛋️" },
    { label: "Beauty & Spa", description: "At-home salon services for men & women.", icon: "💅" },
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
    const location = useLocation();
    const session = useAppSelector((state) => state.auth.session);
    const role = session?.user.role ?? "User";
    const isWorker = role === "Worker";
    const [bookings, setBookings] = useState<BookingRecord[]>([]);
    const [bookingsLoading, setBookingsLoading] = useState(true);
    const [bookingsError, setBookingsError] = useState<string | null>(null);
    const [selectedWorker, setSelectedWorker] = useState<UserProfile | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [categoryWorkers, setCategoryWorkers] = useState<UserProfile[]>([]);
    const [categoryLoading, setCategoryLoading] = useState(false);
    const [categoryError, setCategoryError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("all");

    const queryCategory = new URLSearchParams(location.search).get("category");

    useEffect(() => {
        if (queryCategory) {
            void handleSelectCategory(queryCategory);
        }
    }, [queryCategory]);

    const {
        register,
        handleSubmit,
        setValue,
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


    const handleSelectCategory = async (category: string) => {
        setSelectedCategory(category);
        setSelectedWorker(null);
        setCategoryWorkers([]);
        setCategoryError(null);
        setCategoryLoading(true);
        setValue("service", [category], { shouldValidate: true });

        try {
            const response = await getWorkersByCategoryAPI(category, { signal: new AbortController().signal });
            const workers = response.data.data ?? [];
            setCategoryWorkers(workers);

            if (!workers.length) {
                setCategoryError(`No verified workers available for ${category}.`);
                return;
            }

            const firstWorker = workers[0];
            chooseWorker(firstWorker);
            toast.success(`Ready to book ${category} with ${firstWorker.fullName}`);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unable to fetch workers";
            setCategoryError(message);
        } finally {
            setCategoryLoading(false);
        }
    };

    const chooseWorker = (worker: UserProfile) => {
        setSelectedWorker(worker);
        setValue("workerAuthId", worker.authUserId || worker._id || "");
        setValue("workerPhoneNumber", worker.phone || "");
        toast.success(`Selected ${worker.fullName}`);
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
                                <div className="space-y-6">
                                    <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
                                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Book by category</p>
                                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                            {serviceCategories.map((category) => (
                                                <button
                                                    key={category.label}
                                                    type="button"
                                                    onClick={() => void handleSelectCategory(category.label)}
                                                    className={`group rounded-3xl border px-4 py-4 text-left transition ${selectedCategory === category.label ? "border-black bg-black text-white" : "border-gray-200 bg-white text-gray-900 hover:border-black"}`}
                                                >
                                                    <div className="text-2xl">{category.icon}</div>
                                                    <h3 className="mt-3 text-base font-semibold">{category.label}</h3>
                                                    <p className="mt-2 text-sm leading-6 text-gray-500 group-hover:text-white/85">{category.description}</p>
                                                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
                                                        Book now <span className="text-lg">→</span>
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {selectedCategory ? (
                                        <div className="rounded-3xl border border-gray-200 bg-white p-5">
                                            <div className="flex items-center justify-between gap-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-950">{selectedCategory} workers</h3>
                                                    <p className="mt-1 text-sm text-gray-500">Choose an available professional for this service.</p>
                                                </div>
                                            </div>

                                            <div className="mt-4 space-y-3">
                                                {categoryLoading ? (
                                                    <div className="space-y-3">
                                                        <div className="h-20 animate-pulse rounded-2xl bg-gray-100" />
                                                        <div className="h-20 animate-pulse rounded-2xl bg-gray-100" />
                                                    </div>
                                                ) : categoryError ? (
                                                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{categoryError}</div>
                                                ) : categoryWorkers.length > 0 ? (
                                                    categoryWorkers.map((worker) => (
                                                        <button
                                                            key={worker.authUserId || worker._id}
                                                            type="button"
                                                            onClick={() => chooseWorker(worker)}
                                                            className={`w-full rounded-3xl border p-4 text-left transition ${selectedWorker?.authUserId === worker.authUserId ? "border-black bg-black text-white" : "border-gray-200 bg-white hover:border-black"}`}
                                                        >
                                                            <div className="flex items-center justify-between gap-4">
                                                                <div>
                                                                    <h4 className="text-base font-semibold">{worker.fullName}</h4>
                                                                    <p className="mt-1 text-sm text-gray-500">{worker.serviceCategory?.join(", ") || "No categories"}</p>
                                                                </div>
                                                                <span className="text-sm text-gray-500">{worker.isAvailable ? "Available" : "Offline"}</span>
                                                            </div>
                                                            <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
                                                                {worker.phone && <span className="rounded-full bg-gray-100 px-2.5 py-1">{worker.phone}</span>}
                                                                <span className="rounded-full bg-gray-100 px-2.5 py-1">{worker.averageRating?.toFixed(1) ?? "0.0"} ★</span>
                                                            </div>
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="rounded-2xl border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500">No available workers found for this service yet.</div>
                                                )}
                                            </div>
                                        </div>
                                    ) : null}

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
                                            </div>
                                        </div>
                                    ) : selectedCategory ? (
                                        <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 px-5 py-6 text-sm text-gray-600">
                                            Select a worker from the list above to continue.
                                        </div>
                                    ) : null}

                                    <div className="rounded-3xl border border-gray-200 bg-white p-5">
                                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Booking details</p>
                                        <p className="mt-1 text-sm text-gray-500">Fill in the schedule and contact details below.</p>
                                    </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field label="Booking Date" error={errors.bookingDate?.message}>
                                        <input type="date" {...register("bookingDate")} className="input" />
                                    </Field>
                                    <Field label="Booking Time" error={errors.bookingTime?.message}>
                                        <input type="time" {...register("bookingTime")} className="input" />
                                    </Field>
                                    <Field label="Phone" error={errors.customerPhoneNumber?.message}>
                                        <input placeholder="Enter your phone" {...register("customerPhoneNumber")} className="input" />
                                    </Field>
                                </div>

                                <Field label="Service address" error={errors.customerAddress?.message}>
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
                            </div>
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