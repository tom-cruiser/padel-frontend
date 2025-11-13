"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { bookingService } from "@/services/api";
import { Booking } from "@/types";
import toast from "react-hot-toast";
import { format } from "date-fns";
import {
  FiClock,
  FiCalendar,
  FiMapPin,
  FiRepeat,
  FiUser,
  FiFileText,
  FiAlertCircle,
} from "react-icons/fi";
import Link from "next/link";

export default function BookingDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && params.id) {
      fetchBookingDetails();
    }
  }, [user, params.id]);

  const fetchBookingDetails = async () => {
    try {
      const data = await bookingService.getBookingById(params.id);
      setBooking(data);
    } catch (error) {
      toast.error("Impossible de charger les détails de la réservation");
      router.push("/bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!booking) return;

    if (!confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
      return;
    }

    try {
      await bookingService.cancelBooking(booking.id);
      toast.success("Réservation annulée avec succès");
      fetchBookingDetails();
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        "Échec de l'annulation de la réservation";
      toast.error(message);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      CONFIRMED: "bg-green-100 text-green-700 border-green-200",
      PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
      CANCELLED: "bg-red-100 text-red-700 border-red-200",
      COMPLETED: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-gray-100 text-gray-700 border-gray-200"
    );
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-2xl text-primary-600">
          Loading...
        </div>
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🎾 Détails de la réservation
              </h1>
              <p className="text-sm text-gray-600">
                Voir les détails de votre réservation de terrain
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/bookings" className="btn btn-secondary">
                ← Retour aux réservations
              </Link>
              {booking.status === "CONFIRMED" &&
                new Date(booking.date) >= new Date() && (
                  <button
                    onClick={handleCancelBooking}
                    className="btn btn-danger"
                  >
                    Annuler la réservation
                  </button>
                )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Booking Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <div className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: booking.court?.color || "#3B82F6",
                    }}
                  ></div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {booking.court?.name}
                  </h2>
                </div>
                <span
                  className={`px-4 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    booking.status
                  )}`}
                >
                  {booking.status}
                </span>
              </div>
            </div>

            {/* Booking Details Card */}
            <div className="card space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Détails de la réservation
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5">
                    <FiCalendar className="text-gray-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Date</div>
                    <div className="font-medium text-gray-900">
                      {format(new Date(booking.date), "MMMM dd, yyyy")}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5">
                    <FiClock className="text-gray-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Time</div>
                    <div className="font-medium text-gray-900">
                      {booking.startTime}:00 - {booking.endTime}:00
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5">
                    <FiMapPin className="text-gray-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Court</div>
                    <div className="font-medium text-gray-900">
                      {booking.court?.name}
                    </div>
                    {booking.court?.description && (
                      <div className="text-sm text-gray-500 mt-1">
                        {booking.court.description}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5">
                    <FiRepeat className="text-gray-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Récurrence</div>
                    <div className="font-medium text-gray-900">
                      {booking.recurrenceType === "NONE"
                        ? "Réservation unique"
                        : booking.recurrenceType}
                    </div>
                    {booking.recurrenceEndDate && (
                      <div className="text-sm text-gray-500 mt-1">
                        Until{" "}
                        {format(
                          new Date(booking.recurrenceEndDate),
                          "MMMM dd, yyyy"
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {booking.notes && (
                <div className="flex items-start gap-3 border-t pt-6">
                  <div className="flex-shrink-0 w-5">
                    <FiFileText className="text-gray-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Notes</div>
                    <div className="text-gray-900 mt-1">{booking.notes}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Booking Meta */}
            <div className="card space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Informations de la réservation
              </h3>

              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Réservé par</div>
                  <div className="font-medium text-gray-900 flex items-center gap-2">
                    <FiUser className="text-gray-400" />
                    {user?.firstName} {user?.lastName}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Réservé le</div>
                  <div className="font-medium text-gray-900">
                    {format(new Date(booking.createdAt), "MMM dd, yyyy HH:mm")}
                  </div>
                </div>

                {booking.updatedAt !== booking.createdAt && (
                  <div>
                    <div className="text-sm text-gray-500">
                      Dernière mise à jour
                    </div>
                    <div className="font-medium text-gray-900">
                      {format(
                        new Date(booking.updatedAt),
                        "MMM dd, yyyy HH:mm"
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Important Notes */}
            <div className="card bg-yellow-50 border border-yellow-100">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <FiAlertCircle className="text-yellow-400 w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-yellow-800">
                    Notes importantes
                  </h4>
                  <ul className="mt-2 text-sm text-yellow-700 space-y-2">
                    <li>
                      • Veuillez arriver 10 minutes avant l'heure de votre
                      réservation
                    </li>
                    <li>
                      • Apportez votre propre équipement ou louez-en un dans
                      notre boutique pro
                    </li>
                    <li>
                      • Les annulations doivent être effectuées au moins 24
                      heures à l'avance
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
