import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { getBookingDetailsAPICall, updateBookingStatusAPICall } from "../services/booking";
import { useAppSelector } from "../../../app/hooks";
import type { BookingStatus } from "../../../types/booking";

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
    updatedAt?: string;
}

const statusToneMap: Record<BookingStatus, string> = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Accepted: "bg-sky-50 text-sky-700 border-sky-200",
    "In Progress": "bg-violet-50 text-violet-700 border-violet-200",
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

const BookingDetails = () => {
    const { bookingId = "" } = useParams();
    const navigate = useNavigate();
    const session = useAppSelector((state) => state.auth.session);
    const [booking, setBooking] = useState<BookingRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canWorkerAct = session?.user.role === "Worker";
    const canCustomerAct = session?.user.role === "User";

    const loadBooking = async () => {
        if (!bookingId) {
            setError("Booking id is missing.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await getBookingDetailsAPICall(bookingId);
            setBooking(response.data.data ?? null);
        } catch (requestError) {
            const message = requestError instanceof Error ? requestError.message : "Failed to load booking details";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadBooking();
    }, [bookingId]);

    const timeline = useMemo(() => {
        return [
            { label: "Requested", active: true },
            { label: "Accepted", active: ["Accepted", "In Progress", "Completed"].includes(booking?.bookingStatus ?? "") },
            { label: "In Progress", active: ["In Progress", "Completed"].includes(booking?.bookingStatus ?? "") },
            { label: "Completed", active: booking?.bookingStatus === "Completed" },
        ];
    }, [booking?.bookingStatus]);

    const statusMessage = useMemo(() => {
        switch (booking?.bookingStatus) {
            case "Pending":
                return "Your booking is awaiting confirmation from the assigned professional.";
            case "Accepted":
                return "The professional has accepted your request and is preparing for the visit.";
            case "In Progress":
                return "The service is currently underway.";
            case "Completed":
                return "The service has been completed successfully.";
            case "Cancelled":
                return "This booking was cancelled.";
            default:
                return "Your booking request is being processed.";
        }
    }, [booking?.bookingStatus]);

    const handleAction = async (bookingStatus: BookingStatus, rejectReason?: string) => {
        if (!bookingId) {
            return;
        }

        try {
            setActionLoading(true);
            await updateBookingStatusAPICall(bookingId, { bookingStatus, rejectReason });
            toast.success("Booking updated successfully");
            await loadBooking();
        } catch (requestError) {
            const message = requestError instanceof Error ? requestError.message : "Failed to update booking";
            toast.error(message);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="h-72 animate-pulse rounded-[2rem] bg-gray-100" />
            </main>
        );
    }

    if (error || !booking) {
        return (
            <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="rounded-[2rem] border border-rose-200 bg-rose-50 px-6 py-8 text-center text-rose-700">
                    <p className="text-lg font-semibold">{error ?? "Booking not found"}</p>
                    <button onClick={() => navigate("/bookings")} className="mt-5 rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white">
                        Back to bookings
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <section className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gray-500">Booking details</p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950">{booking.service.join(", ")}</h1>
                        <p className="mt-2 text-sm text-gray-500">Created {booking.createdAt ? format(new Date(booking.createdAt), "dd MMM yyyy, hh:mm a") : "recently"}</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <span className={`rounded-full border px-4 py-2 text-sm font-semibold ${statusToneMap[booking.bookingStatus]}`}>{booking.bookingStatus}</span>
                        <span className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700">₹{booking.price}</span>
                    </div>
                </div>

                <div className="mt-6 rounded-3xl border border-gray-200 bg-gray-50 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Booking confirmation</p>
                            <p className="mt-2 text-sm leading-7 text-gray-600">{statusMessage}</p>
                        </div>
                        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700">
                            {booking.bookingDate ? format(new Date(booking.bookingDate), "dd MMM yyyy") : "Scheduled soon"} • {booking.bookingTime}
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <section className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Info label="Booking date" value={format(new Date(booking.bookingDate), "dd MMM yyyy")} />
                            <Info label="Booking time" value={booking.bookingTime} />
                            <Info label="Payment status" value={booking.paymentStatus} />
                            <Info label="Payment method" value={booking.paymentMethod} />
                            <Info label="Customer phone" value={booking.customerPhoneNumber} />
                            <Info label="Worker phone" value={booking.workerPhoneNumber} />
                        </div>

                        <div className="mt-5 rounded-3xl border border-gray-200 bg-white p-5">
                            <h2 className="text-lg font-semibold text-gray-950">Assigned professional</h2>
                            <p className="mt-2 text-sm font-semibold text-gray-950">{booking.assignedWorkerName || "Awaiting assignment"}</p>
                            <p className="mt-1 text-sm text-gray-600">{booking.assignedWorkerEmail || "The system is still assigning the best available professional."}</p>
                        </div>

                        <div className="mt-5 rounded-3xl border border-gray-200 bg-white p-5">
                            <h2 className="text-lg font-semibold text-gray-950">Service request</h2>
                            <p className="mt-2 text-sm leading-7 text-gray-600">{booking.problemDescription}</p>
                        </div>

                        <div className="mt-5 rounded-3xl border border-gray-200 bg-white p-5">
                            <h2 className="text-lg font-semibold text-gray-950">Address</h2>
                            <p className="mt-2 text-sm leading-7 text-gray-600">{booking.customerAddress}</p>
                        </div>
                    </section>

                    <aside className="space-y-6">
                        <section className="rounded-3xl border border-gray-200 bg-white p-5">
                            <h2 className="text-lg font-semibold text-gray-950">Booking timeline</h2>
                            <div className="mt-4 space-y-3">
                                {timeline.map((item, index) => (
                                    <div key={item.label} className="flex items-center gap-3">
                                        <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${item.active ? "bg-black text-white" : "bg-gray-100 text-gray-400"}`}>{index + 1}</span>
                                        <span className={`text-sm font-medium ${item.active ? "text-gray-950" : "text-gray-400"}`}>{item.label}</span>
                                    </div>
                                ))}
                            </div>
                            {booking.rejectReason ? <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">Reason: {booking.rejectReason}</p> : null}
                        </section>

                        <section className="rounded-3xl border border-gray-200 bg-white p-5">
                            <h2 className="text-lg font-semibold text-gray-950">Actions</h2>
                            <div className="mt-4 flex flex-wrap gap-3">
                                {canWorkerAct && booking.bookingStatus === "Pending" && (
                                    <button disabled={actionLoading} onClick={() => handleAction("Accepted")} className="rounded-full bg-black px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">Accept</button>
                                )}
                                {canWorkerAct && booking.bookingStatus === "Accepted" && (
                                    <button disabled={actionLoading} onClick={() => handleAction("In Progress")} className="rounded-full bg-black px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">Start work</button>
                                )}
                                {canWorkerAct && booking.bookingStatus === "In Progress" && (
                                    <button disabled={actionLoading} onClick={() => handleAction("Completed")} className="rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">Mark completed</button>
                                )}
                                {(canWorkerAct || canCustomerAct) && booking.bookingStatus !== "Completed" && booking.bookingStatus !== "Cancelled" && (
                                    <button disabled={actionLoading} onClick={() => handleAction("Cancelled")} className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 disabled:opacity-60">Cancel</button>
                                )}
                                <button onClick={() => navigate("/bookings")} className="rounded-full border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700">Back</button>
                            </div>
                            <p className="mt-4 text-xs leading-6 text-gray-500">
                                Customers can only cancel. Workers can move bookings through accepted, in progress, and completed states.
                            </p>
                        </section>
                    </aside>
                </div>
            </section>
        </main>
    );
};

const Info = ({ label, value }: { label: string; value: string }) => (
    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">{label}</p>
        <p className="mt-1.5 text-sm font-medium text-gray-900">{value}</p>
    </div>
);

export default BookingDetails;