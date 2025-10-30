import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import type { Booking } from '@/hooks/useBookings';

export function exportToPdf(bookings: Booking[]) {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(16);
  doc.text('Booking Report', 14, 15);

  // Add date
  doc.setFontSize(10);
  doc.text(`Generated on: ${format(new Date(), 'PPpp')}`, 14, 25);

  const tableData = bookings.map(booking => [
    booking.id,
    `${booking.user.firstName} ${booking.user.lastName}`,
    booking.user.email,
    booking.court.name,
    format(new Date(booking.date), 'PP'),
    `${booking.startTime}:00 - ${booking.endTime}:00`,
    booking.status,
    format(new Date(booking.createdAt), 'PPp'),
  ]);

  autoTable(doc, {
    head: [['ID', 'User', 'Email', 'Court', 'Date', 'Time', 'Status', 'Booked On']],
    body: tableData,
    startY: 35,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
    alternateRowStyles: { fillColor: [242, 242, 242] },
  });

  // Add summary
  const finalY = (doc as any).lastAutoTable.finalY || 35;
  doc.text(`Total Bookings: ${bookings.length}`, 14, finalY + 10);

  // Save the PDF
  doc.save(`booking-report-${format(new Date(), 'yyyy-MM-dd-HHmm')}.pdf`);
}