import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import type { APIError } from './types';

// Create axios instance with base configuration
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: import.meta.env.VITE_API_BASE ?? '/api',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor for auth tokens (if needed)
  client.interceptors.request.use(
    (config) => {
      // Add auth token if available
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      // Handle different error types
      if (error.response) {
        // Server responded with error status
        const responseData = error.response.data as any;
        const apiError: APIError = {
          detail: responseData?.detail || error.message,
          code: responseData?.code,
          field_errors: responseData?.field_errors,
        };
        
        // Handle specific status codes
        switch (error.response.status) {
          case 401:
            // Unauthorized - redirect to login or refresh token
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
            break;
          case 403:
            // Forbidden
            break;
          case 404:
            // Not found
            break;
          case 422:
            // Validation errors
            break;
          case 500:
            // Server error
            console.error('Server error:', apiError);
            break;
        }
        
        return Promise.reject(apiError);
      } else if (error.request) {
        // Network error
        const networkError: APIError = {
          detail: 'Network error. Please check your connection.',
          code: 'NETWORK_ERROR',
        };
        return Promise.reject(networkError);
      } else {
        // Other error
        const unknownError: APIError = {
          detail: error.message || 'An unexpected error occurred',
          code: 'UNKNOWN_ERROR',
        };
        return Promise.reject(unknownError);
      }
    }
  );

  return client;
};

// Export the configured client
export const apiClient = createApiClient();

// Utility functions for common API operations
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(key, item.toString()));
      } else {
        searchParams.set(key, value.toString());
      }
    }
  });
  
  return searchParams.toString();
};

// Generic API methods
export const apiGet = async <T>(url: string, params?: Record<string, any>): Promise<T> => {
  const queryString = params ? buildQueryString(params) : '';
  const response = await apiClient.get<T>(`${url}${queryString ? `?${queryString}` : ''}`);
  return response.data;
};

export const apiPost = async <T>(url: string, data?: any): Promise<T> => {
  const response = await apiClient.post<T>(url, data);
  return response.data;
};

export const apiPut = async <T>(url: string, data?: any): Promise<T> => {
  const response = await apiClient.put<T>(url, data);
  return response.data;
};

export const apiPatch = async <T>(url: string, data?: any): Promise<T> => {
  const response = await apiClient.patch<T>(url, data);
  return response.data;
};

export const apiDelete = async <T>(url: string): Promise<T> => {
  const response = await apiClient.delete<T>(url);
  return response.data;
};