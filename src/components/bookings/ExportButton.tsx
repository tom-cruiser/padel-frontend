import { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { FileDown } from 'lucide-react';
import { exportService } from '@/services/api';
import { toast } from 'react-hot-toast';

export default function ExportButton() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = async (format: 'excel' | 'pdf') => {
    try {
      setLoading(true);
      // Get the last 30 days as default date range
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      
      await exportService.exportBookings(format, startDate, endDate);
      toast.success(`Bookings exported to ${format.toUpperCase()} successfully`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Failed to export bookings to ${format.toUpperCase()}`);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleClick}
        startIcon={<FileDown />}
        disabled={loading}
      >
        {loading ? 'Exporting...' : 'Export'}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleExport('excel')}>
          Export to Excel
        </MenuItem>
        <MenuItem onClick={() => handleExport('pdf')}>
          Export to PDF
        </MenuItem>
      </Menu>
    </>
  );
}