import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import type { Booking } from '@/hooks/useBookings';

export function exportToExcel(bookings: Booking[]) {
  const data = bookings.map(booking => ({
    'Booking ID': booking.id,
    'User Name': `${booking.user.firstName} ${booking.user.lastName}`,
    'Email': booking.user.email,
    'Court': booking.court.name,
    'Date': format(new Date(booking.date), 'PP'),
    'Time': `${booking.startTime}:00 - ${booking.endTime}:00`,
    'Status': booking.status,
    'Booked On': format(new Date(booking.createdAt), 'PPp'),
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Bookings');

  // Save the file
  XLSX.writeFile(wb, `booking-report-${format(new Date(), 'yyyy-MM-dd-HHmm')}.xlsx`);
}