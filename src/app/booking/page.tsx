"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { courtService, bookingService } from "@/services/api";
import { Court } from "@/types";
import toast from "react-hot-toast";
import { format, addDays } from "date-fns";

interface Coach {
  id: string;
  name: string;
  specialty: string;
}

const TIME_SLOTS = [
  { hour: 7.0, label: "7:00 AM - 8:30 AM" },
  { hour: 8.5, label: "8:30 AM - 10:00 AM" },
  { hour: 10.0, label: "10:00 AM - 11:30 AM" },
  { hour: 11.5, label: "11:30 AM - 1:00 PM" },
  { hour: 13.0, label: "1:00 PM - 2:30 PM" },
  { hour: 14.5, label: "2:30 PM - 4:00 PM" },
  { hour: 16.0, label: "4:00 PM - 5:30 PM" },
  { hour: 17.5, label: "5:30 PM - 7:00 PM" },
  { hour: 19.0, label: "7:00 PM - 8:30 PM" },
  { hour: 20.5, label: "8:30 PM - 10:00 PM" },
];

const COACHES: Coach[] = [
  { id: "c1", name: "Mutika", specialty: "Technique" },
  { id: "c2", name: "Seif", specialty: "Footwork" },
  { id: "c3", name: "Abdullah", specialty: "Tactics" },
  { id: "c4", name: "Malick", specialty: "Fitness" },
];

export default function BookingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<number[]>([]);
  const [courtAvailability, setCourtAvailability] = useState<
    Record<string, number[]>
  >({});

  // Form state
  const [selectedCourt, setSelectedCourt] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [numberOfMembers, setNumberOfMembers] = useState<number>(1);
  const [withCoach, setWithCoach] = useState<boolean>(false);
  const [selectedCoach, setSelectedCoach] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  // Bookings are one-time only in this UI
  const recurrenceType = "NONE";

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    fetchCourts();
  }, []);

  useEffect(() => {
    if (selectedDate && courts.length > 0) {
      // fetch availability for all courts (we'll display two courts side-by-side)
      fetchAllAvailability();
    }
  }, [selectedCourt, selectedDate]);

  const fetchAvailability = async () => {
    if (!selectedCourt || !selectedDate) return;

    try {
      const bookings = await bookingService.getCourtAvailability(
        selectedCourt,
        selectedDate
      );
      const booked = bookings.map((b: any) => Number(b.startTime));
      setBookedSlots(booked);
      setCourtAvailability((prev) => ({ ...prev, [selectedCourt]: booked }));
    } catch (error) {
      console.error("Failed to fetch availability for court", selectedCourt);
    }
  };

  const fetchAllAvailability = async () => {
    if (!selectedDate || courts.length === 0) return;

    try {
      const relevantCourts = courts.filter((c) =>
        ["Blue Padel Court", "Green Padel Court"].includes(c.name)
      );

      const promises = relevantCourts.map((court) =>
        bookingService
          .getCourtAvailability(court.id, selectedDate)
          .then((bookings: any[]) => bookings.map((b) => Number(b.startTime)))
          .catch(() => [])
      );

      const results = await Promise.all(promises);

      const availabilityMap: Record<string, number[]> = {};
      relevantCourts.forEach((court, idx) => {
        availabilityMap[court.id] = results[idx] || [];
      });

      setCourtAvailability((prev) => ({ ...prev, ...availabilityMap }));
    } catch (error) {
      console.error("Failed to fetch availability for courts", error);
    }
  };

  const fetchCourts = async () => {
    try {
      const courtsData = await courtService.getCourts();
      setCourts(courtsData);
      if (courtsData.length > 0) {
        setSelectedCourt(courtsData[0].id);
      }
    } catch (error) {
      toast.error("Failed to load courts");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCourt) {
      toast.error("Please select a court");
      return;
    }

    if (selectedTime === null) {
      toast.error("Please select a time slot");
      return;
    }

    if (withCoach && !selectedCoach) {
      toast.error("Please select a coach");
      return;
    }

    setSubmitting(true);

    try {
      if (selectedTime === null) {
        toast.error("Please select a time slot");
        setSubmitting(false);
        return;
      }
      const bookingData = {
        courtId: selectedCourt,
        date: selectedDate,
        startTime: selectedTime,
        endTime: Number((selectedTime + 1.5).toFixed(2)),
        recurrenceType,
        notes: `Members: ${numberOfMembers}${
          withCoach
            ? `, Coach: ${COACHES.find((c) => c.id === selectedCoach)?.name}`
            : ""
        }${notes ? `, Notes: ${notes}` : ""}`,
      };

      await bookingService.createBooking(bookingData);
      toast.success("Booking created successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      const message = error.response?.data?.error || "Failed to create booking";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-2xl text-primary-600">
          Loading...
        </div>
      </div>
    );
  }

  if (!user) return null;

  const selectedCourtData = courts.find((c) => c.id === selectedCourt);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                📅 Book a Court
              </h1>
              <p className="text-sm text-gray-600">Reserve your padel court</p>
            </div>
            <button
              onClick={() => router.push("/dashboard")}
              className="btn btn-secondary"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Court Selection */}
            <div>
              <label className="label">Select Court *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courts.length === 0 ? (
                  <div className="p-4 border-2 rounded-lg text-center text-gray-500 bg-gray-50">
                    No courts available. Please contact the administrator.
                  </div>
                ) : (
                  ["Blue Padel Court", "Green Padel Court"].map((courtName) => {
                    const court = courts.find((c) => c.name === courtName);
                    if (!court) return null;
                    return (
                      <div
                        key={court.id}
                        onClick={() => setSelectedCourt(court.id)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedCourt === court.id
                            ? "border-primary-500 bg-primary-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {court.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {court.description}
                            </p>
                          </div>
                          <div
                            className="w-8 h-8 rounded-full"
                            style={{ backgroundColor: court.color }}
                          ></div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500 font-semibold uppercase">
                          {courtName.split(" ")[0].toLowerCase()} court
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <label className="label">Select Date *</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={format(new Date(), "yyyy-MM-dd")}
                max={format(addDays(new Date(), 3), "yyyy-MM-dd")}
                className="input"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                You can book up to 3 days in advance
              </p>
            </div>

            {/* Time Slot Selection */}
            <div>
              <label className="label">Select Time Slot *</label>
              {/* Show time slots side-by-side for Blue and Green courts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(["Blue Padel Court", "Green Padel Court"] as string[]).map(
                  (courtName) => {
                    const court = courts.find((c) => c.name === courtName);
                    if (!court)
                      return (
                        <div key={courtName} className="p-4 border rounded">
                          No {courtName} configured
                        </div>
                      );

                    const booked = courtAvailability[court.id] || [];

                    return (
                      <div key={court.id} className="p-3 border rounded-lg">
                        <h4 className="font-semibold mb-2">{court.name}</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {TIME_SLOTS.map((slot) => {
                            const isBooked = booked.includes(slot.hour);
                            const isSelected =
                              selectedTime === slot.hour &&
                              selectedCourt === court.id;

                            return (
                              <button
                                key={`${court.id}-${slot.hour}`}
                                type="button"
                                onClick={() => {
                                  if (!isBooked) {
                                    setSelectedCourt(court.id);
                                    setSelectedTime(slot.hour);
                                  }
                                }}
                                disabled={isBooked}
                                className={`p-2 border rounded text-sm text-left transition-all ${
                                  isBooked
                                    ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : isSelected
                                    ? "border-primary-500 bg-primary-500 text-white"
                                    : "border-gray-300 text-gray-700 hover:border-primary-300 hover:bg-primary-50"
                                }`}
                              >
                                <div className="font-medium">
                                  {slot.label.split(" - ")[0]}
                                </div>
                                <div className="text-xs mt-1">
                                  {isBooked ? (
                                    <span className="text-red-500">
                                      🔴 Booked
                                    </span>
                                  ) : (
                                    <span className="text-green-500">
                                      🟢 Available
                                    </span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                🟢 Available slots are shown in green, 🔴 booked slots in red
              </p>
            </div>

            {/* Number of Members */}
            <div>
              <label className="label">Number of Players *</label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setNumberOfMembers(Math.max(1, numberOfMembers - 1))
                  }
                  className="btn btn-secondary w-12 h-12 text-xl"
                  disabled={numberOfMembers <= 1}
                >
                  -
                </button>
                <div className="flex-1 text-center">
                  <div className="text-3xl font-bold text-primary-600">
                    {numberOfMembers}
                  </div>
                  <div className="text-sm text-gray-600">
                    {numberOfMembers === 1 ? "Player" : "Players"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setNumberOfMembers(Math.min(4, numberOfMembers + 1))
                  }
                  className="btn btn-secondary w-12 h-12 text-xl"
                  disabled={numberOfMembers >= 4}
                >
                  +
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Maximum 4 players per court
              </p>
            </div>

            {/* Coach Selection */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  id="withCoach"
                  checked={withCoach}
                  onChange={(e) => {
                    setWithCoach(e.target.checked);
                    if (!e.target.checked) setSelectedCoach("");
                  }}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label
                  htmlFor="withCoach"
                  className="text-sm font-medium text-gray-700"
                >
                  I want to book with a coach
                </label>
              </div>

              {withCoach && (
                <div className="mt-3">
                  <label className="label">Select Coach *</label>
                  <select
                    value={selectedCoach}
                    onChange={(e) => setSelectedCoach(e.target.value)}
                    className="input"
                    required={withCoach}
                  >
                    <option value="">-- Choose a coach --</option>
                    {COACHES.map((coach) => (
                      <option key={coach.id} value={coach.id}>
                        {coach.name} - {coach.specialty}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Recurrence: one-time bookings only (weekly/monthly removed) */}

            {/* Additional Notes */}
            <div>
              <label className="label">Additional Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="input"
                placeholder="Any special requests or information..."
              ></textarea>
            </div>

            {/* Booking Summary */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-3">
                📋 Booking Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Court:</span>
                  <span className="font-medium text-gray-900">
                    {selectedCourtData?.name || "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium text-gray-900">
                    {format(new Date(selectedDate), "MMMM dd, yyyy")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium text-gray-900">
                    {selectedTime !== null
                      ? TIME_SLOTS.find((s) => s.hour === selectedTime)?.label
                      : "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Players:</span>
                  <span className="font-medium text-gray-900">
                    {numberOfMembers}
                  </span>
                </div>
                {withCoach && selectedCoach && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coach:</span>
                    <span className="font-medium text-gray-900">
                      {COACHES.find((c) => c.id === selectedCoach)?.name}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium text-gray-900">
                    {recurrenceType === "NONE" ? "One-time" : recurrenceType}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="flex-1 btn btn-secondary"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 btn btn-primary"
                disabled={submitting}
              >
                {submitting ? "Creating Booking..." : "Confirm Booking"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
