import api from '@/lib/api';

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
  }) {
    const response = await api.put('/profile', data);
    return response.data;
  },

  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
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

