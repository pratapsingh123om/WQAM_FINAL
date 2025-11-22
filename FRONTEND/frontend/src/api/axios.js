// src/api/axios.js
import axios from 'axios'
import { API_BASE } from '../config'

const baseURL = API_BASE

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

export default api
