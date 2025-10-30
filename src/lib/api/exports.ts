import { api } from './api';

interface ExportBookingOptions {
  startDate?: string;
  endDate?: string;
}

interface BookingExport {
  id: string;
  playerName: string;
  courtName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
}

export async function exportBookingHistory(options?: ExportBookingOptions): Promise<BookingExport[]> {
  try {
    const params = new URLSearchParams();
    if (options?.startDate) params.append('startDate', options.startDate);
    if (options?.endDate) params.append('endDate', options.endDate);

    const response = await api.get('/exports/bookings?' + params.toString());
    return response.data.bookings;
  } catch (error) {
    console.error('Error exporting bookings:', error);
    throw error;
  }
}