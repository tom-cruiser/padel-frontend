import React, { useState } from 'react';
import { exportBookingHistory } from '@/lib/api/exports';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}
import * as XLSX from 'xlsx';

interface ExportBookingsProps {
  startDate?: Date | string;
  endDate?: Date | string;
  onError?: (message: string) => void;
  onSuccess?: (message: string) => void;
}

const ExportBookings: React.FC<ExportBookingsProps> = ({ startDate, endDate, onError, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const exportToPDF = async () => {
    try {
      setIsLoading(true);
      const bookings = await exportBookingHistory({
        startDate: startDate instanceof Date ? startDate.toISOString() : startDate,
        endDate: endDate instanceof Date ? endDate.toISOString() : endDate,
      });

      const doc = new jsPDF();

      // Add title
      doc.setFontSize(16);
      doc.text('Booking History Report', 14, 15);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 23);

      if (startDate) {
        const startDateStr = startDate instanceof Date ? startDate.toLocaleDateString() : new Date(startDate).toLocaleDateString();
        doc.text(`From: ${startDateStr}`, 14, 30);
      }
      if (endDate) {
        const endDateStr = endDate instanceof Date ? endDate.toLocaleDateString() : new Date(endDate).toLocaleDateString();
        doc.text(`To: ${endDateStr}`, 14, 37);
      }

      // Create table
      doc.autoTable({
        startY: startDate || endDate ? 45 : 30,
        head: [['Player', 'Court', 'Date', 'Time', 'Status']],
        body: bookings.map((booking) => [
          booking.playerName,
          booking.courtName,
          booking.date,
          `${booking.startTime} - ${booking.endTime}`,
          booking.status,
        ]),
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });

      doc.save('booking-history.pdf');
      onSuccess?.('PDF exported successfully!');
    } catch (error) {
      console.error('Failed to export PDF:', error);
      onError?.('Failed to export PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const exportToExcel = async () => {
    try {
      setIsLoading(true);
      const bookings = await exportBookingHistory({
        startDate: startDate instanceof Date ? startDate.toISOString() : startDate,
        endDate: endDate instanceof Date ? endDate.toISOString() : endDate,
      });

      const worksheet = XLSX.utils.json_to_sheet(
        bookings.map((booking) => ({
          'Player Name': booking.playerName,
          'Court': booking.courtName,
          'Date': booking.date,
          'Start Time': booking.startTime,
          'End Time': booking.endTime,
          'Status': booking.status,
          'Created At': booking.createdAt,
        }))
      );

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings');
      XLSX.writeFile(workbook, 'booking-history.xlsx');
      onSuccess?.('Excel file exported successfully!');
    } catch (error) {
      console.error('Failed to export Excel:', error);
      onError?.('Failed to export Excel file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={exportToPDF}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Exporting...' : 'Export to PDF'}
      </button>
      <button
        onClick={exportToExcel}
        disabled={isLoading}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
      >
        {isLoading ? 'Exporting...' : 'Export to Excel'}
      </button>
    </div>
  );
};

export default ExportBookings;