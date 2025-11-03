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

// Debug log API configuration
const debugApiConfig = () => {
  console.log('API Configuration:', {
    baseURL: api.defaults.baseURL,
    headers: api.defaults.headers,
    withCredentials: api.defaults.withCredentials
  });
};

export async function exportBookingHistory(options?: ExportBookingOptions & { format?: 'excel' | 'pdf' }): Promise<BookingExport[]> {
  debugApiConfig(); // Log API configuration
  try {
    const params = new URLSearchParams();
    if (options?.startDate) params.append('startDate', options.startDate);
    if (options?.endDate) params.append('endDate', options.endDate);
    if (options?.format) params.append('format', options.format);

    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }

    const requestUrl = `/api/exports/bookings?${params.toString()}`;
    console.log('Exporting bookings:', {
      url: requestUrl,
      baseURL: api.defaults.baseURL,
      fullUrl: `${api.defaults.baseURL}${requestUrl}`,
      params: {
        startDate: options?.startDate,
        endDate: options?.endDate,
        format: options?.format
      },
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 10)}...` : 'none'
    });

    const response = await api.get(requestUrl, {
      responseType: options?.format ? 'blob' : 'json',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).catch((error) => {
      console.error('Export request failed:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    });

    if (options?.format) {
      // Handle binary response for excel/pdf
      const blob = new Blob([response.data], {
        type: options.format === 'excel' 
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'application/pdf'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bookings.${options.format === 'excel' ? 'xlsx' : 'pdf'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return [];
    }

    return response.data.bookings;
  } catch (error) {
    console.error('Error exporting bookings:', error);
    throw error;
  }
}