// FRONTEND/frontend/src/pages/admin/AdminLogin.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminLogin.css'

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@wqam.local')
  const [password, setPassword] = useState('admin123')
  const [message, setMessage] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setMessage('Logging in...')
    try {
      const res = await fetch(`${API}/auth/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const json = await res.json();
      
      if (res.ok) {
        // ✅ Store token and role
        localStorage.setItem('wqam_token', json.access_token);
        localStorage.setItem('wqam_role', json.role);
        setMessage('Login successful — redirecting...');
        
        // ✅ Navigate to admin dashboard
        navigate('/admin/dashboard');
      } else {
        setMessage('Login failed: ' + (json.detail || 'Unknown error'));
      }
    } catch (err) {
      setMessage('Network error: ' + err.message);
    }
  }

  return (
    <div className="container-admin">
      <h2>Admin Login</h2>
      <form onSubmit={onSubmit}>
        <div className="form-row">
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="form-row">
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
        </div>
        <div className="button-row">
          <button type="submit" className="btn-primary">Sign in</button>
          <button type="button" className="btn-ghost" onClick={() => navigate('/')}>Back</button>
        </div>
      </form>
      <div className="message">{message}</div>
    </div>
  )
}