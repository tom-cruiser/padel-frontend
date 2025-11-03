import api from '@/lib/api';

export const exportService = {
  async exportBookings(format: 'excel' | 'pdf', startDate?: string, endDate?: string) {
    const response = await api.get('/exports/bookings', {
      params: { format, startDate, endDate },
      responseType: 'blob'
    });
    
    // Create download URL
    const blob = new Blob([response.data], {
      type: format === 'excel' 
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : 'application/pdf'
    });
    const url = window.URL.createObjectURL(blob);
    
    // Create and click download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `bookings.${format === 'excel' ? 'xlsx' : 'pdf'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up URL
    window.URL.revokeObjectURL(url);
  }
};

export const bookingService = {
  async getBookings(params?: {
    courtId?: string;
    date?: string;
    userId?: string;
    status?: string;
  }) {
    const response = await api.get('/bookings', { params });
    return response.data.bookings;
  },

  async getMyBookings() {
    const response = await api.get('/bookings/my-bookings');
    return response.data.bookings;
  },

  async getBookingById(id: string) {
    const response = await api.get(`/bookings/${id}`);
    return response.data.booking;
  },

  async createBooking(data: {
    courtId: string;
    date: string;
    startTime: number;
    endTime: number;
    recurrenceType?: string;
    recurrenceEndDate?: string;
    notes?: string;
  }) {
    const response = await api.post('/bookings', data);
    return response.data.booking;
  },

  async cancelBooking(id: string) {
    const response = await api.patch(`/bookings/${id}/cancel`);
    return response.data.booking;
  },

  // Check availability for a specific court, date, and time
  async checkAvailability(courtId: string, date: string, startTime: number) {
    try {
      const bookings = await this.getBookings({ courtId, date });
      const isBooked = bookings.some(
        (booking: any) =>
          booking.startTime === startTime && booking.status !== 'CANCELLED'
      );
      return !isBooked;
    } catch (error) {
      return false;
    }
  },

  // Get all bookings for a specific court and date
  async getCourtAvailability(courtId: string, date: string) {
    try {
      const bookings = await this.getBookings({ courtId, date });
      return bookings.filter((b: any) => b.status !== 'CANCELLED');
    } catch (error) {
      return [];
    }
  },
};

export const courtService = {
  async getCourts() {
    const response = await api.get('/courts');
    return response.data.courts;
  },

  async getCourtById(id: string) {
    const response = await api.get(`/courts/${id}`);
    return response.data.court;
  },

  async createCourt(data: {
    name: string;
    color: string;
    description?: string;
    openingTime?: number;
    closingTime?: number;
  }) {
    const response = await api.post('/courts', data);
    return response.data.court;
  },

  async updateCourt(id: string, data: any) {
    const response = await api.patch(`/courts/${id}`, data);
    return response.data.court;
  },

  async deleteCourt(id: string) {
    const response = await api.delete(`/courts/${id}`);
    return response.data;
  },
};

export const profileService = {
  async getProfile() {
    const response = await api.get('/profile');
    return response.data;
  },

  async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    preferredCourt?: string;
    language?: string;
    avatar?: string;
  }) {
    const response = await api.put('/profile', data);
    return response.data;
  },

  async uploadAvatar(file: File) {
    try {
      console.log('Starting avatar upload...', { 
        fileName: file.name, 
        fileSize: file.size, 
        fileType: file.type,
        fileLastModified: file.lastModified 
      });
      
      // Validate file type
      if (!file.type.match(/^image\/(jpeg|png|jpg|gif)$/i)) {
        throw new Error('File type not supported. Please upload a JPEG, PNG, or GIF image.');
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size too large. Maximum size is 5MB.');
      }

      const formData = new FormData();
      formData.append('avatar', file);
      
      console.log('FormData contents:', {
        hasFile: formData.has('avatar'),
        fileName: formData.get('avatar') instanceof File ? (formData.get('avatar') as File).name : null
      });
      
      const response = await api.post('/profile/avatar', formData, {
        headers: {
          Accept: 'application/json',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      });
      
      console.log('Upload successful:', response.data);
      
      // If the upload is successful, update the profile with the new avatar URL
      if (response.data.url) {
        await this.updateProfile({
          avatar: response.data.url
        });
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Avatar upload failed:', error);
      // More specific error messaging
      console.error('Detailed upload error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });

      if (error.response?.status === 500) {
        throw new Error('Server error while uploading image. Please try again later.');
      } else if (error.response?.status === 413) {
        throw new Error('File size too large. Please upload a smaller image.');
      } else if (error.response?.status === 415) {
        throw new Error('File type not supported. Please upload a valid image file.');
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to upload image. Please try again.');
      }
    }
  },

  async getMembership() {
    const response = await api.get('/profile/membership');
    return response.data;
  },

  async getPayments() {
    const response = await api.get('/profile/payments');
    return response.data;
  },

  async getAchievements() {
    const response = await api.get('/profile/achievements');
    return response.data;
  },

  async getAttendance() {
    const response = await api.get('/profile/attendance');
    return response.data;
  },

  async getPosts() {
    const response = await api.get('/profile/posts');
    return response.data;
  },

  async getFriends() {
    const response = await api.get('/profile/friends');
    return response.data;
  },

  async updatePrivacy(privacy: string) {
    const response = await api.put('/profile/privacy', { privacy });
    return response.data;
  },
};

