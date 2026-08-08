import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { format } from "date-fns";
import { createBookingAPICall, getCustomerBookingsAPICall, getWorkerBookingsAPICall } from "../services/booking";
import { createProfileAPI, getProfileDetailsAPI } from "../../../api/user";
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
    assignedWorkerName?: string;
    assignedWorkerEmail?: string;
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

const availableTimeSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

const bookingSchema = z.object({
    service: z.array(z.string()).min(1, "Select at least one service"),
    bookingDate: z.string().min(1, "Booking date is required"),
    bookingTime: z.string().min(1, "Booking time is required"),
    customerAddress: z.string().min(8, "Customer address is required"),
    customerPhoneNumber: z.string().min(7, "Customer phone number is required"),
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
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
    const [confirmationDetails, setConfirmationDetails] = useState<{ bookingId?: string; assignedWorkerName?: string; assignedWorkerEmail?: string } | null>(null);
    const today = new Date().toISOString().split("T")[0];

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
            service: [],
            bookingDate: "",
            bookingTime: "",
            customerAddress: "",
            customerPhoneNumber: "",
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


    const handleSelectCategory = (category: string) => {
        setSelectedCategory(category);
        setValue("service", [category], { shouldValidate: true });
    };

    const submitBooking: SubmitHandler<BookingFormValues> = async (values) => {
        const resolvedCustomerId = session?.user._id ?? session?.user.authUserId;
        if (!resolvedCustomerId) {
            toast.error("Unable to resolve your account identity.");
            return;
        }

        const payload: BookingPayload = {
            customerAuthId: resolvedCustomerId,
            service: values.service,
            bookingDate: values.bookingDate,
            bookingTime: values.bookingTime,
            customerAddress: values.customerAddress,
            customerPhoneNumber: values.customerPhoneNumber,
            problemDescription: values.problemDescription,
            price: values.price,
        };

        const response = await createBookingAPICall(payload);
        if (!response.data?.success) {
            throw new Error(response.data?.message || "Failed to create booking");
        }

        const createdBookingId = response.data.data?._id;
        const assignedWorkerName = response.data?.data?.assignedWorkerName as string | undefined;
        const assignedWorkerEmail = response.data?.data?.assignedWorkerEmail as string | undefined;

        setConfirmationMessage(`Booking request submitted for ${values.bookingDate} at ${values.bookingTime}. We’ll assign the best available professional shortly.`);
        setConfirmationDetails({ bookingId: createdBookingId, assignedWorkerName, assignedWorkerEmail });
        toast.success("Booking created successfully");
        reset();
        setSelectedCategory(null);

        if (createdBookingId) {
            window.setTimeout(() => navigate(`/bookings/${createdBookingId}`), 1400);
        } else {
            navigate("/bookings");
        }
    };

    const pageTitle = isWorker ? "Assigned bookings" : "My bookings";
    const pageDescription = isWorker
        ? "Review assigned jobs, monitor status, and open a booking for details or status updates."
        : "Keep track of your upcoming appointments and recent service history in one place.";

    return (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <section className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-8 text-white sm:px-8 lg:px-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.16),_transparent_35%)]" />
                    <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-300">{isWorker ? "Worker bookings" : "Bookings"}</p>
                            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{pageTitle}</h1>
                            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">{pageDescription}</p>
                        </div>

                        <Link to="/dashboard" className="inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20">
                            Back to dashboard
                        </Link>
                    </div>
                </div>

                <div className="p-6 sm:p-8">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: "Total", value: bookingStats.total },
                        { label: "Pending", value: bookingStats.pending },
                        { label: "Active", value: bookingStats.active },
                        { label: "Completed", value: bookingStats.completed },
                    ].map((stat) => (
                        <div key={stat.label} className="rounded-[1.25rem] border border-gray-200 bg-gradient-to-br from-gray-50 to-white px-4 py-4 shadow-sm">
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">{stat.label}</p>
                            <p className="mt-2 text-2xl font-semibold text-gray-950">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    {!isWorker ? (
                        <section className="rounded-[1.5rem] border border-gray-200 bg-white p-5 sm:p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-950">Book a service</h2>
                                    <p className="mt-1 text-sm text-gray-500">Choose a category, pick a date and time, and let our system assign the right professional.</p>
                                </div>
                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">Customer view</span>
                            </div>

                            <div className="mt-5 overflow-hidden rounded-[1.35rem] border border-gray-200 bg-slate-900 text-white shadow-sm">
                                <img
                                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80"
                                    alt="Professional service at a home"
                                    className="h-40 w-full object-cover"
                                />
                                <div className="p-4 sm:p-5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">Fast booking</span>
                                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">Verified help</span>
                                    </div>
                                    <p className="mt-3 text-sm leading-6 text-slate-300">Your request is matched with the best nearby expert in minutes, with clear pricing and trusted support.</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit(submitBooking)} className="mt-6 space-y-6">
                                <div className="space-y-6">
                                    {confirmationMessage ? (
                                        <div className="rounded-[1.25rem] border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-700">
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                <div>
                                                    <p className="font-semibold text-emerald-800">Booking confirmed</p>
                                                    <p className="mt-1 leading-6">{confirmationMessage}</p>
                                                    {confirmationDetails?.assignedWorkerName ? (
                                                        <p className="mt-2 font-semibold text-emerald-800">Assigned professional: {confirmationDetails.assignedWorkerName}</p>
                                                    ) : (
                                                        <p className="mt-2">The system is matching you with the best available professional.</p>
                                                    )}
                                                    {confirmationDetails?.assignedWorkerEmail ? (
                                                        <p className="mt-1 text-xs">{confirmationDetails.assignedWorkerEmail}</p>
                                                    ) : null}
                                                </div>
                                                {confirmationDetails?.bookingId ? (
                                                    <button type="button" onClick={() => navigate(`/bookings/${confirmationDetails.bookingId}`)} className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">
                                                        View details
                                                    </button>
                                                ) : null}
                                            </div>
                                        </div>
                                    ) : null}

                                    <div className="rounded-[1.25rem] border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-5">
                                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Book by category</p>
                                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                            {serviceCategories.map((category) => (
                                                <button
                                                    key={category.label}
                                                    type="button"
                                                    onClick={() => void handleSelectCategory(category.label)}
                                                    className={`group rounded-[1.25rem] border px-4 py-4 text-left transition duration-300 ${selectedCategory === category.label ? "border-black bg-black text-white shadow-lg" : "border-gray-200 bg-white text-gray-900 hover:-translate-y-1 hover:border-black"}`}
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
                                        <div className="rounded-[1.25rem] border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700">
                                            We’ll automatically assign the best available worker for {selectedCategory} based on your chosen date and time.
                                        </div>
                                    ) : null}

                                    <div className="rounded-[1.25rem] border border-gray-200 bg-white p-5">
                                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Booking details</p>
                                        <p className="mt-1 text-sm text-gray-500">Share your preferred time, address, and contact details.</p>
                                    </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field label="Booking Date" error={errors.bookingDate?.message}>
                                        <input type="date" min={today} {...register("bookingDate")} className="input" />
                                    </Field>
                                    <Field label="Booking Time" error={errors.bookingTime?.message}>
                                        <select {...register("bookingTime")} className="input">
                                            <option value="">Select a time slot</option>
                                            {availableTimeSlots.map((slot) => (
                                                <option key={slot} value={slot}>{slot}</option>
                                            ))}
                                        </select>
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
                                    disabled={isSubmitting || !selectedCategory}
                                    className="w-full rounded-full bg-black px-6 py-3.5 text-base font-semibold text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60 shadow-lg shadow-black/10"
                                >
                                    {isSubmitting ? "Creating booking..." : "Create booking"}
                                </button>
                            </div>
                            </form>
                        </section>
                    ) : (
                        <section className="rounded-[1.5rem] border border-gray-200 bg-white p-5 sm:p-6">
                            <div className="flex items-start justify-between gap-4">
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

                            <div className="mt-6 rounded-[1.25rem] border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-5">
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
                        <section className="rounded-[1.5rem] border border-gray-200 bg-white p-5 sm:p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-950">{isWorker ? "Assigned bookings" : "My bookings"}</h2>
                                    <p className="mt-1 text-sm text-gray-500">Recent requests and service progress from the backend.</p>
                                </div>
                                <div className="rounded-full border border-gray-200 bg-gradient-to-r from-gray-50 to-white px-3 py-2">
                                    <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="bg-transparent text-sm text-gray-700 outline-none">
                                        <option value="all">All</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Accepted">Accepted</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
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
                                        <Link key={booking._id} to={`/bookings/${booking._id}`} className="block rounded-[1.25rem] border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-4 transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-sm">
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
                                    <div className="rounded-[1.25rem] border border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-white px-4 py-8 text-center text-sm text-gray-500">No bookings found yet.</div>
                                )}
                            </div>
                        </section>
                    </aside>
                </div>
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


const DetailPill = ({ label, value }: { label: string; value: string }) => (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">{label}</p>
        <p className="mt-1.5 text-sm font-medium text-gray-900">{value}</p>
    </div>
);

export default Bookings;