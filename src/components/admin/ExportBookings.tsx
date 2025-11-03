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
      
      // Log auth state
      const token = localStorage.getItem('accessToken');
      const user = localStorage.getItem('user');
      console.log('Auth state before export:', {
        hasToken: !!token,
        tokenPreview: token ? `${token.substring(0, 10)}...` : 'none',
        user: user ? JSON.parse(user) : null
      });
      
      await exportBookingHistory({
        startDate: startDate instanceof Date ? startDate.toISOString() : startDate,
        endDate: endDate instanceof Date ? endDate.toISOString() : endDate,
        format: 'pdf'
      });
      onSuccess?.('PDF exported successfully!');
      console.log('PDF export completed successfully');
    } catch (error: any) {
      console.error('Failed to export PDF:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to export PDF';
      onError?.(errorMessage);
      
      // Log detailed error information
      console.error('Export error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportToExcel = async () => {
    try {
      setIsLoading(true);
      console.log('Starting Excel export with params:', {
        startDate: startDate instanceof Date ? startDate.toISOString() : startDate,
        endDate: endDate instanceof Date ? endDate.toISOString() : endDate,
        format: 'excel'
      });
      
      await exportBookingHistory({
        startDate: startDate instanceof Date ? startDate.toISOString() : startDate,
        endDate: endDate instanceof Date ? endDate.toISOString() : endDate,
        format: 'excel'
      });
      onSuccess?.('Excel file exported successfully!');
    } catch (error: any) {
      console.error('Failed to export Excel:', {
        error,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      const errorMessage = error.response?.data?.message || error.message || 'Failed to export Excel file';
      onError?.(`Export failed: ${errorMessage}`);
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