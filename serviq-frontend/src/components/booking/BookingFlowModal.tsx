import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createBookingAPICall } from "../../features/booking/services/booking";
import { getProfileDetailsAPI } from "../../api/user";
import { useAppSelector } from "../../app/hooks";

interface ServiceOption {
  label: string;
  description: string;
  icon: string;
  price: number;
  duration: string;
}

interface BookingFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceOption | null;
}

const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

const BookingFlowModal = ({ isOpen, onClose, service }: BookingFlowModalProps) => {
  const navigate = useNavigate();
  const session = useAppSelector((state) => state.auth.session);

  const [step, setStep] = useState<"details" | "review" | "loading" | "success">("details");
  const [bookingDate, setBookingDate] = useState(() =>
    new Date().toISOString().split("T")[0],
  );
  const [bookingTime, setBookingTime] = useState("10:00");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const addressInputRef = useRef<HTMLInputElement>(null);

  // Auto-fill profile data
  useEffect(() => {
    if (!isOpen) return;

    const loadProfile = async () => {
      if (!session?.accessToken) return;

      try {
        const response = await getProfileDetailsAPI();
        const profile = response?.data?.data ?? null;
        if (profile?.address) setAddress(profile.address);
        if (profile?.phone) setPhone(profile.phone);
      } catch {
        // Leave the form values as they are and continue.
      }
    };

    void loadProfile();
  }, [isOpen, session?.accessToken]);

  // Focus address input when modal opens & step is "details"
  useEffect(() => {
    if (isOpen && step === "details") {
      // Small delay ensures the modal content is rendered and visible
      const timer = setTimeout(() => {
        addressInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, step]);

  // Reset modal when closed
  useEffect(() => {
    if (!isOpen) {
      setStep("details");
      setBookingDate(today);
      setBookingTime("10:00");
      setAddress("");
      setPhone("");
      setNotes("");
      setCreatedBookingId(null);
    }
  }, [isOpen, today]);

  if (!isOpen || !service) return null;

  const handleClose = () => {
    setStep("details");
    onClose();
  };

  const handleContinue = () => {
    if (!bookingDate || !bookingTime || !address.trim() || !phone.trim()) {
      toast.error("Please add a date, time, address, and contact number.");
      return;
    }
    setStep("review");
  };

  const handleConfirm = async () => {
    const resolvedCustomerId = session?.user?._id ?? session?.user?.authUserId;

    if (!resolvedCustomerId) {
      toast.error("Please log in to confirm a booking.");
      navigate("/login");
      handleClose();
      return;
    }

    try {
      setStep("loading");
      const response = await createBookingAPICall({
        customerAuthId: resolvedCustomerId,
        service: [service.label],
        bookingDate,
        bookingTime,
        customerAddress: address,
        customerPhoneNumber: phone,
        problemDescription: notes || `Booking requested for ${service.label}`,
        price: service.price,
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Unable to create booking.");
      }

      const bookingId = response.data.data?._id;
      setCreatedBookingId(bookingId);
      setStep("success");
      toast.success("Booking confirmed");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to create booking.";
      setStep("details");
      toast.error(message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 px-4 py-8 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      aria-describedby="booking-modal-desc"
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
              Quick booking
            </p>
            <h2
              id="booking-modal-title"
              className="mt-1 text-xl font-semibold text-gray-900"
            >
              {service.label}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            aria-label="Close booking modal"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Step indicator */}
        {step === "details" || step === "review" ? (
          <div className="flex items-center justify-center gap-2 border-b border-gray-100 px-6 py-3">
            <span
              className={`h-2 w-2 rounded-full ${
                step === "details" ? "bg-black" : "bg-gray-300"
              }`}
              aria-hidden="true"
            />
            <span
              className={`h-2 w-2 rounded-full ${
                step === "review" ? "bg-black" : "bg-gray-300"
              }`}
              aria-hidden="true"
            />
            <span className="sr-only">
              {step === "details" ? "Step 1 of 2" : "Step 2 of 2"}
            </span>
          </div>
        ) : null}

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-6" id="booking-modal-desc">
          {/* Details step */}
          {step === "details" && (
            <div className="space-y-6">
              {/* Service summary card */}
              <div className="market-card rounded-[1.25rem] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-gray-900">
                      {service.label}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-gray-500">
                      {service.description}
                    </p>
                  </div>
                  <div className="shrink-0 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-right">
                    <p className="text-base font-semibold text-gray-900">
                      ₹{service.price}
                    </p>
                    <p className="text-xs text-gray-500">{service.duration}</p>
                  </div>
                </div>
              </div>

              {/* Date selection */}
              <fieldset>
                <legend className="text-sm font-semibold text-gray-900">
                  When do you need help?
                </legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    { label: "Today", value: today },
                    {
                      label: "Tomorrow",
                      value: new Date(Date.now() + 86400000)
                        .toISOString()
                        .split("T")[0],
                    },
                  ].map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => setBookingDate(option.value)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition active:scale-[0.97] ${
                        bookingDate === option.value
                          ? "border-black bg-black text-white"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                  <label className="flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                      />
                    </svg>
                    <input
                      type="date"
                      min={today}
                      value={bookingDate}
                      onChange={(event) => setBookingDate(event.target.value)}
                      className="bg-transparent text-sm font-medium text-gray-700 outline-none"
                    />
                  </label>
                </div>
              </fieldset>

              {/* Time selection */}
              <fieldset>
                <legend className="text-sm font-semibold text-gray-900">
                  Select a time
                </legend>
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setBookingTime(slot)}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition active:scale-[0.97] ${
                        bookingTime === slot
                          ? "border-black bg-black text-white"
                          : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-white"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Contact details */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-900">
                  Your address
                  <span className="text-red-500 ml-0.5">*</span>
                  <input
                    ref={addressInputRef}
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder="Enter your full address"
                    required
                    aria-required="true"
                    className="market-input mt-2"
                  />
                </label>
                <label className="block text-sm font-semibold text-gray-900">
                  Contact number
                  <span className="text-red-500 ml-0.5">*</span>
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="Phone number"
                    required
                    aria-required="true"
                    className="market-input mt-2"
                  />
                </label>
                <label className="block text-sm font-semibold text-gray-900">
                  Notes (optional)
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    rows={3}
                    placeholder="Add a note for the professional"
                    className="market-input mt-2 min-h-[90px] resize-none"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Review step */}
          {step === "review" && (
            <div className="space-y-5">
              <div className="market-card rounded-[1.25rem] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                  Booking summary
                </p>
                <div className="mt-5 space-y-4 text-sm text-gray-700">
                  <div className="flex items-center gap-3">
                    <svg className="h-5 w-5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                    <span className="flex-1">Service</span>
                    <span className="font-semibold text-gray-900">{service.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="h-5 w-5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    <span className="flex-1">Date</span>
                    <span className="font-semibold text-gray-900">{bookingDate}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="h-5 w-5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="flex-1">Time</span>
                    <span className="font-semibold text-gray-900">{bookingTime}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="h-5 w-5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <span className="flex-1">Location</span>
                    <span className="font-semibold text-gray-900 text-right max-w-[200px] truncate">{address}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <span className="text-base font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">₹{service.price}</span>
                  </div>
                </div>
              </div>
              <div className="rounded-[1.25rem] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 flex items-start gap-2">
                <svg className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                We’ll assign the best available professional for this slot automatically.
              </div>
            </div>
          )}

          {/* Loading step */}
          {step === "loading" && (
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-[1.25rem] border border-gray-200 bg-gray-50 px-6 text-center">
              <div className="relative h-10 w-10">
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
              </div>
              <p className="mt-6 text-lg font-semibold text-gray-900">
                Finding the best professional for you…
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-500 max-w-xs">
                We are checking availability and matching your request to the most suitable professional.
              </p>
            </div>
          )}

          {/* Success step */}
          {step === "success" && (
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-[1.25rem] border border-emerald-200 bg-emerald-50 px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-2xl font-bold text-white shadow-lg">
                ✓
              </div>
              <p className="mt-5 text-xl font-semibold text-gray-900">
                Booking confirmed
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-500 max-w-xs">
                Your request has been submitted and our system is preparing the assignment for your selected slot.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() =>
                    createdBookingId && navigate(`/bookings/${createdBookingId}`)
                  }
                  className="rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 active:scale-[0.98]"
                >
                  Track booking
                </button>
                <button
                  onClick={handleClose}
                  className="rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 active:scale-[0.98]"
                >
                  Back home
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        {(step === "details" || step === "review") && (
          <div className="border-t border-gray-100 px-6 py-4">
            {step === "details" && (
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={handleClose}
                  className="rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleContinue}
                  className="rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 active:scale-[0.98]"
                >
                  Continue
                </button>
              </div>
            )}
            {step === "review" && (
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => setStep("details")}
                  className="rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 active:scale-[0.98]"
                >
                  Edit
                </button>
                <button
                  onClick={handleConfirm}
                  className="rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 active:scale-[0.98]"
                >
                  Confirm booking
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingFlowModal;