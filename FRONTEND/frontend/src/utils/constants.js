// FRONTEND/frontend/src/utils/constants.js
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
    TIMEOUT: 10000,
  };
  
  export const STORAGE_KEYS = {
    TOKEN: 'wqam_token',
    ROLE: 'wqam_role',
    USER: 'wqam_user',
  };
  
  export const USER_ROLES = {
    ADMIN: 'admin',
    USER: 'user',
    VALIDATOR: 'validator',
  };
  
  export const ROUTES = {
    HOME: '/',
    AUTH: '/auth',
    ADMIN_LOGIN: '/admin/login',
    ADMIN_DASHBOARD: '/admin/dashboard',
    USER_DASHBOARD: '/user/dashboard',
    VALIDATOR_DASHBOARD: '/validator/dashboard',
  };
  
  export const API_ENDPOINTS = {
    LOGIN: '/auth/login',
    ADMIN_LOGIN: '/auth/admin-login',
    REGISTER: '/register',
    ME: '/me',
    ADMIN_PENDING: '/admin/pending',
    ADMIN_APPROVE: (id) => `/admin/approve/${id}`,
    ADMIN_REJECT: (id) => `/admin/reject/${id}`,
  };
  
  export const INDUSTRY_TYPES = [
    'Industry',
    'STP',
    'WTP',
    'Custom'
  ];
  
  export const VALIDATOR_TYPES = [
    'Govt',
    'Private',
    'AI-enabled'
  ];