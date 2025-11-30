// FRONTEND/frontend/src/services/adminService.js
import api from '../api/axios';

export const adminService = {
  // Get all pending user registrations
  getPendingUsers: async () => {
    const response = await api.get('/admin/pending');
    return response.data;
  },

  // Approve a user
  approveUser: async (userId) => {
    const response = await api.post(`/admin/approve/${userId}`);
    return response.data;
  },

  // Reject a user
  rejectUser: async (userId) => {
    const response = await api.post(`/admin/reject/${userId}`);
    return response.data;
  },

  // Get all users (if you add this endpoint later)
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  }
};

export default adminService;