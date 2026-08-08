import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { format } from "date-fns";
import {
  getBookingDetailsAPICall,
  updateBookingStatusAPICall,
} from "../services/booking";
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
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Failed to load booking details";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  const timeline = useMemo(() => {
    return [
      { label: "Requested", active: true },
      {
        label: "Accepted",
        active: ["Accepted", "In Progress", "Completed"].includes(
          booking?.bookingStatus ?? "",
        ),
      },
      {
        label: "In Progress",
        active: ["In Progress", "Completed"].includes(
          booking?.bookingStatus ?? "",
        ),
      },
      {
        label: "Completed",
        active: booking?.bookingStatus === "Completed",
      },
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

  const handleAction = async (
    bookingStatus: BookingStatus,
    rejectReason?: string,
  ) => {
    if (!bookingId) return;

    try {
      setActionLoading(true);
      await updateBookingStatusAPICall(bookingId, { bookingStatus, rejectReason });
      toast.success("Booking updated successfully");
      await loadBooking();
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Failed to update booking";
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  /* ── Loading skeleton ──────────────────────────────── */
  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse rounded-[1.25rem] border border-gray-200 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:p-8">
          {/* Header */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="h-4 w-24 rounded-full bg-gray-200" />
              <div className="h-8 w-64 rounded-lg bg-gray-300" />
              <div className="h-4 w-40 rounded-full bg-gray-200" />
            </div>
            <div className="flex gap-3">
              <div className="h-8 w-28 rounded-full bg-gray-200" />
              <div className="h-8 w-20 rounded-full bg-gray-200" />
            </div>
          </div>

          {/* Status message block */}
          <div className="mt-6 h-20 rounded-2xl bg-gray-100" />

          {/* Content grid */}
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <div className="h-32 rounded-2xl bg-gray-100" />
              <div className="h-24 rounded-2xl bg-gray-100" />
              <div className="h-24 rounded-2xl bg-gray-100" />
            </div>
            <div className="space-y-5">
              <div className="h-40 rounded-2xl bg-gray-100" />
              <div className="h-32 rounded-2xl bg-gray-100" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ── Error / not found ─────────────────────────────── */
  if (error || !booking) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[1.25rem] border border-rose-200 bg-rose-50 px-6 py-10 text-center shadow-sm">
          <svg
            className="mx-auto h-12 w-12 text-rose-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <p className="mt-4 text-lg font-semibold text-rose-700">
            {error ?? "Booking not found"}
          </p>
          <p className="mt-1 text-sm text-rose-500">
            We couldn't load this booking. It may have been removed or the link is incorrect.
          </p>
          <button
            onClick={() => navigate("/bookings")}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 active:scale-[0.98]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
            Back to bookings
          </button>
        </div>
      </main>
    );
  }

  /* ── Main content ──────────────────────────────────── */
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <article className="rounded-[1.25rem] border border-gray-200 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] sm:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">
              Booking details
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-black sm:text-3xl">
              {booking.service.join(", ")}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Created{" "}
              {booking.createdAt
                ? format(new Date(booking.createdAt), "dd MMM yyyy, hh:mm a")
                : "recently"}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold ${statusToneMap[booking.bookingStatus]}`}
              role="status"
            >
              <span
                className={`h-2 w-2 rounded-full ${
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
            <span className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700">
              ₹{booking.price}
            </span>
          </div>
        </div>

        {/* Status message */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Booking status
              </p>
              <p className="mt-2 text-sm leading-7 text-gray-600">
                {statusMessage}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              {booking.bookingDate
                ? format(new Date(booking.bookingDate), "dd MMM yyyy")
                : "Scheduled soon"}{" "}
              • {booking.bookingTime}
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left column – Info */}
          <div className="space-y-5">
            {/* Booking info cards */}
            <div className="grid gap-3 sm:grid-cols-2">
              <Info
                label="Booking date"
                value={format(new Date(booking.bookingDate), "dd MMM yyyy")}
                icon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                }
              />
              <Info
                label="Booking time"
                value={booking.bookingTime}
                icon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                }
              />
              <Info
                label="Payment status"
                value={booking.paymentStatus}
                icon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>
                }
              />
              <Info
                label="Payment method"
                value={booking.paymentMethod}
                icon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h14.25c.621 0 1.125.504 1.125 1.125v14.25c0 .621-.504 1.125-1.125 1.125H4.875c-.621 0-1.125-.504-1.125-1.125V4.875z" /></svg>
                }
              />
              <Info
                label="Customer phone"
                value={booking.customerPhoneNumber}
                icon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>
                }
              />
              <Info
                label="Worker phone"
                value={booking.workerPhoneNumber}
                icon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>
                }
              />
            </div>

            {/* Assigned professional */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h2 className="flex items-center gap-2 text-base font-semibold text-black">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                Assigned professional
              </h2>
              {booking.assignedWorkerName ? (
                <div className="mt-3">
                  <p className="text-sm font-semibold text-gray-900">
                    {booking.assignedWorkerName}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {booking.assignedWorkerEmail}
                  </p>
                </div>
              ) : (
                <div className="mt-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center">
                  <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                  <p className="mt-2 text-sm font-medium text-gray-500">
                    Awaiting assignment
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    The system is assigning the best available professional.
                  </p>
                </div>
              )}
            </div>

            {/* Service request */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h2 className="flex items-center gap-2 text-base font-semibold text-black">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
                Service request
              </h2>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                {booking.problemDescription}
              </p>
            </div>

            {/* Address */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h2 className="flex items-center gap-2 text-base font-semibold text-black">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                Address
              </h2>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                {booking.customerAddress}
              </p>
            </div>
          </div>

          {/* Right column – Timeline & Actions */}
          <aside className="space-y-5">
            {/* Timeline */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h2 className="text-base font-semibold text-black">
                Booking timeline
              </h2>
              <div className="mt-5">
                {timeline.map((item, index) => (
                  <div key={item.label} className="flex gap-3">
                    {/* Step indicator + connector */}
                    <div className="flex flex-col items-center">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                          item.active
                            ? "bg-black text-white shadow-sm"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {index + 1}
                      </span>
                      {index < timeline.length - 1 && (
                        <div
                          className={`mt-1 h-6 w-0.5 ${
                            timeline[index + 1].active
                              ? "bg-black"
                              : "bg-gray-200"
                          }`}
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <div className="pb-4">
                      <p
                        className={`text-sm font-medium ${
                          item.active ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {item.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {booking.rejectReason && (
                <div className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  <span className="font-semibold">Cancellation reason:</span>{" "}
                  {booking.rejectReason}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h2 className="text-base font-semibold text-black">Actions</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {canWorkerAct && booking.bookingStatus === "Pending" && (
                  <button
                    disabled={actionLoading}
                    onClick={() => handleAction("Accepted")}
                    className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label="Accept booking"
                  >
                    Accept
                  </button>
                )}
                {canWorkerAct && booking.bookingStatus === "Accepted" && (
                  <button
                    disabled={actionLoading}
                    onClick={() => handleAction("In Progress")}
                    className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label="Start work"
                  >
                    Start work
                  </button>
                )}
                {canWorkerAct && booking.bookingStatus === "In Progress" && (
                  <button
                    disabled={actionLoading}
                    onClick={() => handleAction("Completed")}
                    className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label="Mark as completed"
                  >
                    Mark completed
                  </button>
                )}
                {(canWorkerAct || canCustomerAct) &&
                  booking.bookingStatus !== "Completed" &&
                  booking.bookingStatus !== "Cancelled" && (
                    <button
                      disabled={actionLoading}
                      onClick={() => handleAction("Cancelled")}
                      className="rounded-full border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                      aria-label="Cancel booking"
                    >
                      Cancel
                    </button>
                  )}
                <button
                  onClick={() => navigate("/bookings")}
                  className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 active:scale-[0.98]"
                  aria-label="Back to bookings"
                >
                  Back
                </button>
              </div>
              <p className="mt-4 text-xs leading-6 text-gray-500">
                Customers can only cancel. Workers can move bookings through
                accepted, in progress, and completed states.
              </p>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
};

/* ── Info sub-component ──────────────────────────────── */
const Info = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) => (
  <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5">
    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
      {icon && <span className="shrink-0">{icon}</span>}
      {label}
    </div>
    <p className="mt-1.5 text-sm font-medium text-gray-900">{value}</p>
  </div>
);

export default BookingDetails;