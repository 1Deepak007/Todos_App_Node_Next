import axiosClient from './axiosClient';

const authService = {
  signup: async (userData) => {
    try {
      const response = await axiosClient.post('auth/signup', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await axiosClient.post('auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  logout: async () => {
    try {
      // The backend should handle clearing the httpOnly cookie on logout
      const response = await axiosClient.post('auth/logout');
      window.location.href = '/';
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default authService;
