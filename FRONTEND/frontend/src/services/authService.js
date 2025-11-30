// FRONTEND/frontend/src/services/authService.js
// FRONTEND/frontend/src/services/authService.js
import api from '../api/axios';
import { API_ENDPOINTS } from '../utils/constants';

export const authService = {
  login: (credentials) => api.post(API_ENDPOINTS.LOGIN, credentials),
  adminLogin: (credentials) => api.post(API_ENDPOINTS.ADMIN_LOGIN, credentials),
  register: (data, role) => api.post(`${API_ENDPOINTS.REGISTER}?role=${role}`, data),
  getMe: () => api.get(API_ENDPOINTS.ME),
};

export default authService;

export const adminService = {
  getPending: () => api.get('/admin/pending'),
  approveUser: (id) => api.post(`/admin/approve/${id}`),
  rejectUser: (id) => api.post(`/admin/reject/${id}`),
};