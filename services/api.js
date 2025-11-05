import axios from 'axios';
import { mockAuthService, mockSearchService } from './mockApi';
import * as SecureStore from 'expo-secure-store';

// Configure your backend API URL here
// Use mock API in development for easier testing if backend is not available
const USE_MOCK_API = __DEV__;

const API_BASE_URL = USE_MOCK_API
  ? 'http://mock-api-used' // Placeholder, actual calls will be intercepted
  : 'https://your-production-api.com/api'; // Production URL (replace with your actual URL)

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage
      await SecureStore.deleteItemAsync('authToken');
      await SecureStore.deleteItemAsync('userInfo');
    }
    return Promise.reject(error);
  }
);

export const authService = USE_MOCK_API ? mockAuthService : {
  async login(username, password) {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user } = response.data;
      
      // Store token securely
      await SecureStore.setItemAsync('authToken', token);
      await SecureStore.setItemAsync('userInfo', JSON.stringify(user));
      
      return { success: true, user, token };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed. Please check your credentials.',
      };
    }
  },

  async logout() {
    try {
      await SecureStore.deleteItemAsync('authToken');
      await SecureStore.deleteItemAsync('userInfo');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getCurrentUser() {
    try {
      const userInfo = await SecureStore.getItemAsync('userInfo');
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      return null;
    }
  },
};

export const searchService = USE_MOCK_API ? mockSearchService : {
  async searchPeople(query, searchType) {
    try {
      const response = await api.post('/search/people', {
        query: query.trim(),
        searchType, // 'phone' or 'name'
      });
      return {
        success: true,
        data: response.data.results || [],
        total: response.data.total || 0,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Search failed. Please try again.',
        data: [],
      };
    }
  },

  async searchVehicles(query) {
    try {
      const response = await api.post('/search/vehicles', {
        query: query.trim(),
      });
      return {
        success: true,
        data: response.data.results || [],
        total: response.data.total || 0,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Vehicle search failed. Please try again.',
        data: [],
      };
    }
  },

  async getRecordDetails(recordId, recordType) {
    try {
      const response = await api.get(`/records/${recordId}`, {
        params: { type: recordType },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to load record details.',
      };
    }
  },
};

export default api;
