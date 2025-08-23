import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { API_CONFIG, ERROR_MESSAGES } from '@/config/constants';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create admin axios instance
const adminApi: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Admin request interceptor to add admin token
adminApi.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      toast.error(ERROR_MESSAGES.NETWORK_ERROR);
      return Promise.reject(new Error('Network error'));
    }

    const { status, data } = error.response;

    // Handle authentication errors
    if (status === 401) {
      Cookies.remove('auth_token');
      
      // Only redirect to login if not already on auth pages
      if (!window.location.pathname.includes('/auth') && 
          !window.location.pathname.includes('/admin')) {
        window.location.href = '/auth/login';
      }
      return Promise.reject(new Error('Authentication failed'));
    }

    // Handle authorization errors
    if (status === 403) {
      toast.error(ERROR_MESSAGES.AUTHORIZATION_FAILED);
      return Promise.reject(new Error('Authorization failed'));
    }

    // Handle validation errors
    if (status === 400) {
      const message = data?.error || data?.message || ERROR_MESSAGES.VALIDATION_FAILED;
      toast.error(message);
      return Promise.reject(new Error(message));
    }

    // Handle not found errors
    if (status === 404) {
      const message = data?.error || ERROR_MESSAGES.NOT_FOUND;
      return Promise.reject(new Error(message));
    }

    // Handle server errors
    if (status >= 500) {
      toast.error(ERROR_MESSAGES.SERVER_ERROR);
      return Promise.reject(new Error('Server error'));
    }

    // Handle other errors
    const message = data?.error || data?.message || ERROR_MESSAGES.GENERIC_ERROR;
    toast.error(message);
    return Promise.reject(new Error(message));
  }
);

// API methods
export const apiClient = {
  // Generic methods
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    api.get(url, config).then((response) => response.data),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    api.post(url, data, config).then((response) => response.data),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    api.put(url, data, config).then((response) => response.data),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    api.patch(url, data, config).then((response) => response.data),

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    api.delete(url, config).then((response) => response.data),

  // File upload method
  upload: <T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> =>
    api.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    }).then((response) => response.data),
};

// Admin API methods
export const adminApiClient = {
  // Generic methods
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    adminApi.get(url, config).then((response) => response.data),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    adminApi.post(url, data, config).then((response) => response.data),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    adminApi.put(url, data, config).then((response) => response.data),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    adminApi.patch(url, data, config).then((response) => response.data),

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    adminApi.delete(url, config).then((response) => response.data),
};

// Authentication API
export const authAPI = {
  getProfile: () => apiClient.get('/auth/me'),
  updateProfile: (data: any) => apiClient.put('/auth/profile', data),
  adminLogin: (credentials: { email: string; password: string }) =>
    apiClient.post('/auth/admin/login', credentials),
  logout: () => apiClient.post('/auth/logout'),
  validateToken: () => apiClient.get('/auth/validate'),
};

// Products API
export const productsAPI = {
  getAll: (params?: any) => apiClient.get('/products', { params }),
  getFeatured: () => apiClient.get('/products/featured'),
  getById: (id: string) => apiClient.get(`/products/${id}`),
  getCategories: () => apiClient.get('/products/categories/all'),
  create: (data: any) => adminApiClient.post('/products', data),
  update: (id: string, data: any) => adminApiClient.put(`/products/${id}`, data),
  delete: (id: string) => adminApiClient.delete(`/products/${id}`),
  createCategory: (data: any) => adminApiClient.post('/products/categories', data),
};

// Orders API
export const ordersAPI = {
  create: (data: any) => apiClient.post('/orders', data),
  verifyPayment: (data: any) => apiClient.post('/orders/verify-payment', data),
  getUserOrders: (params?: any) => apiClient.get('/orders/my-orders', { params }),
  getById: (id: string) => apiClient.get(`/orders/${id}`),
  getAllAdmin: (params?: any) => adminApiClient.get('/orders/admin/all', { params }),
  updateStatus: (id: string, data: any) => adminApiClient.put(`/orders/${id}/status`, data),
};

// Sessions API
export const sessionsAPI = {
  book: (data: any) => apiClient.post('/sessions/book', data),
  verifyPayment: (data: any) => apiClient.post('/sessions/verify-payment', data),
  getUserSessions: (params?: any) => apiClient.get('/sessions/my-sessions', { params }),
  getById: (id: string) => apiClient.get(`/sessions/${id}`),
  getAllAdmin: (params?: any) => adminApiClient.get('/sessions/admin/all', { params }),
  updateStatus: (id: string, data: any) => adminApiClient.put(`/sessions/${id}/status`, data),
  getStats: () => adminApiClient.get('/sessions/admin/stats'),
};

// Partners API
export const partnersAPI = {
  apply: (data: any) => apiClient.post('/partners/apply', data),
  getApplicationStatus: (id: string, email: string) =>
    apiClient.get(`/partners/application/${id}/status`, { params: { email } }),
  getAllAdmin: (params?: any) => adminApiClient.get('/partners/admin/all', { params }),
  getByIdAdmin: (id: string) => adminApiClient.get(`/partners/admin/${id}`),
  review: (id: string, data: any) => adminApiClient.put(`/partners/admin/${id}/review`, data),
  getStats: () => adminApiClient.get('/partners/admin/stats'),
  bulkUpdate: (data: any) => adminApiClient.put('/partners/admin/bulk-update', data),
};

// Testimonials API
export const testimonialsAPI = {
  getAll: (params?: any) => apiClient.get('/testimonials', { params }),
  getFeatured: () => apiClient.get('/testimonials/featured'),
  getById: (id: string) => apiClient.get(`/testimonials/${id}`),
  getByIdAdmin: (id: string) => adminApiClient.get(`/testimonials/admin/${id}`),
  getAllAdmin: (params?: any) => adminApiClient.get('/testimonials/admin/all', { params }),
  create: (data: any) => adminApiClient.post('/testimonials', data),
  update: (id: string, data: any) => adminApiClient.put(`/testimonials/${id}`, data),
  delete: (id: string) => adminApiClient.delete(`/testimonials/${id}`),
  toggleFeatured: (id: string, is_featured: boolean) =>
    adminApiClient.patch(`/testimonials/${id}/featured`, { is_featured }),
  toggleActive: (id: string, is_active: boolean) =>
    adminApiClient.patch(`/testimonials/${id}/active`, { is_active }),
  getStats: () => adminApiClient.get('/testimonials/admin/stats'),
  bulkUpdate: (data: any) => adminApiClient.put('/testimonials/admin/bulk-update', data),
};

// Admin API
export const adminAPI = {
  getDashboard: () => adminApiClient.get('/admin/dashboard'),
  getRecentActivities: (params?: any) => adminApiClient.get('/admin/recent-activities', { params }),
  getSystemHealth: () => adminApiClient.get('/admin/system-health'),
  getUsers: (params?: any) => adminApiClient.get('/admin/users', { params }),
  updateUserAdmin: (id: string, is_admin: boolean) =>
    adminApiClient.put(`/admin/users/${id}/admin`, { is_admin }),
  getLogs: (params?: any) => adminApiClient.get('/admin/logs', { params }),
};

// Utility functions
export const createQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
};

export const handleApiError = (error: any): string => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const formatApiDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export default api;