// src/config.js
// Usage: import { API_BASE } from './config'
export const API_BASE = (import.meta?.env?.VITE_API_URL)
  || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:4000'   // dev on your machine
      : '/api');                  // production / container case (adjust if necessary)
