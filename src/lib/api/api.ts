import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth token
api.interceptors.request.use((config) => {
  // Enhanced request logging
  console.log('Making API Request:', {
    fullUrl: `${config.baseURL || ''}${config.url || ''}`,
    method: config.method,
    headers: config.headers,
    data: config.data instanceof FormData 
      ? 'FormData (see next log)' 
      : config.data
  });

  // Log FormData contents if present
  if (config.data instanceof FormData) {
    const formDataContents: Record<string, any> = {};
    config.data.forEach((value, key) => {
      formDataContents[key] = value instanceof File 
        ? `File: ${value.name} (${value.type}, ${value.size} bytes)`
        : value;
    });
    console.log('FormData contents:', formDataContents);
  }

  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or logout here
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);