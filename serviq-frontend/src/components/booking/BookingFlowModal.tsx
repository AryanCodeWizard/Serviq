import { useEffect, useMemo, useState } from "react";
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

const timeSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

const BookingFlowModal = ({ isOpen, onClose, service }: BookingFlowModalProps) => {
  const navigate = useNavigate();
  const session = useAppSelector((state) => state.auth.session);
  const [step, setStep] = useState<"details" | "review" | "loading" | "success">("details");
  const [bookingDate, setBookingDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [bookingTime, setBookingTime] = useState("10:00");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const loadProfile = async () => {
      if (!session?.accessToken) {
        return;
      }

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

  if (!isOpen || !service) {
    return null;
  }

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
      const message = error instanceof Error ? error.message : "Unable to create booking.";
      setStep("details");
      toast.error(message);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/55 px-3 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto flex h-full max-w-2xl flex-col rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Quick booking</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">{service.label}</h2>
          </div>
          <button onClick={handleClose} className="rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">Close</button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {step === "details" && (
            <div className="space-y-5">
              <div className="market-card rounded-[24px] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{service.label}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{service.description}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-right">
                    <p className="text-sm font-semibold text-slate-900">₹{service.price}</p>
                    <p className="text-xs text-slate-500">{service.duration}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">When do you need help?</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[{ label: "Today", value: today }, { label: "Tomorrow", value: new Date(Date.now() + 86400000).toISOString().split("T")[0] }].map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => setBookingDate(option.value)}
                      className={`rounded-full border px-3 py-2 text-sm font-medium ${bookingDate === option.value ? "border-black bg-black text-white" : "border-slate-200 bg-white text-slate-700"}`}
                    >
                      {option.label}
                    </button>
                  ))}
                  <label className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
                    <input type="date" min={today} value={bookingDate} onChange={(event) => setBookingDate(event.target.value)} className="bg-transparent outline-none" />
                  </label>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">Select a time</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setBookingTime(slot)}
                      className={`rounded-2xl border px-3 py-2.5 text-sm font-medium ${bookingTime === slot ? "border-black bg-black text-white" : "border-slate-200 bg-slate-50 text-slate-700"}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-900">
                  Your address
                  <input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Enter your address" className="market-input mt-2" />
                </label>
                <label className="block text-sm font-semibold text-slate-900">
                  Contact number
                  <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Phone number" className="market-input mt-2" />
                </label>
                <label className="block text-sm font-semibold text-slate-900">
                  Notes (optional)
                  <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} placeholder="Add a note for the professional" className="market-input mt-2 min-h-[90px] resize-none" />
                </label>
              </div>
            </div>
          )}

          {step === "review" && (
            <div className="space-y-4">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Booking summary</p>
                <div className="mt-4 space-y-3 text-sm text-slate-700">
                  <div className="flex items-center justify-between">
                    <span>Service</span>
                    <span className="font-semibold text-slate-900">{service.label}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Date</span>
                    <span className="font-semibold text-slate-900">{bookingDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Time</span>
                    <span className="font-semibold text-slate-900">{bookingTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Location</span>
                    <span className="font-semibold text-slate-900">{address}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                    <span>Total</span>
                    <span className="text-lg font-semibold text-slate-900">₹{service.price}</span>
                  </div>
                </div>
              </div>
              <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                We’ll assign the best available professional for this slot automatically.
              </div>
            </div>
          )}

          {step === "loading" && (
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-[24px] border border-slate-200 bg-slate-50 px-6 text-center">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-black" />
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-black [animation-delay:120ms]" />
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-black [animation-delay:240ms]" />
              </div>
              <p className="mt-5 text-lg font-semibold text-slate-900">Finding the best professional for you…</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">We are checking availability and matching your request to the most suitable professional.</p>
            </div>
          )}

          {step === "success" && (
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-[24px] border border-emerald-200 bg-emerald-50 px-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-xl font-semibold text-white">✓</div>
              <p className="mt-4 text-xl font-semibold text-slate-900">Booking confirmed</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Your request has been submitted and our system is preparing the assignment for your selected slot.</p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <button onClick={() => createdBookingId && navigate(`/bookings/${createdBookingId}`)} className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white">Track booking</button>
                <button onClick={handleClose} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Back home</button>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 px-5 py-4 sm:px-6">
          {step === "details" && (
            <div className="flex items-center justify-between gap-3">
              <button onClick={handleClose} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Cancel</button>
              <button onClick={handleContinue} className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white">Continue</button>
            </div>
          )}
          {step === "review" && (
            <div className="flex items-center justify-between gap-3">
              <button onClick={() => setStep("details")} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Edit</button>
              <button onClick={handleConfirm} className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white">Confirm booking</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingFlowModal;
