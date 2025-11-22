// src/pages/admin/AdminLogin.jsx
import { useState } from 'react'
import api from '../../api/axios'   // relative path to axios instance
import './AdminLogin.css' // optional styling

export default function AdminLogin({ navigate }) {
  const [email, setEmail] = useState('admin@wqam.local')
  const [password, setPassword] = useState('admin123')
  const [message, setMessage] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setMessage('Logging in...')
    try {
      // IMPORTANT: backend expects JSON fields that match schemas.LoginRequest (email, password)
      const res = await api.post('/auth/admin-login', { email, password })

      if (res?.data) {
        setMessage('Login successful — redirecting...')
        // save token if provided
        if (res.data.access_token) {
          localStorage.setItem('wqam_token', res.data.access_token)
        }
        // navigate to admin dashboard
        navigate('/admin/dashboard')
      } else {
        setMessage('Login succeeded but backend response unexpected.')
      }
    } catch (err) {
      // Best-effort to extract a readable message from FastAPI responses (422, 401, 404, etc)
      if (err.response?.data) {
        const d = err.response.data
        // FastAPI 422 -> { detail: [ ... ] }, other errors -> { detail: "..." } or {"message":...}
        if (Array.isArray(d.detail)) {
          setMessage('Validation error: ' + d.detail.map(it => `${it.loc.join('.')}: ${it.msg}`).join('; '))
        } else if (typeof d.detail === 'string') {
          setMessage('Login failed: ' + d.detail)
        } else {
          setMessage('Login failed: ' + JSON.stringify(d))
        }
      } else {
        setMessage('Network error: ' + (err.message || String(err)))
      }
    }
  }

  return (
    <div style={{maxWidth:520, margin:'2rem auto'}}>
      <h2>Admin Login</h2>
      <form onSubmit={onSubmit}>
        <label>Email</label><br />
        <input value={email} onChange={e=>setEmail(e.target.value)} required style={{width:'100%',padding:8}} />
        <label style={{marginTop:8}}>Password</label><br />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required style={{width:'100%',padding:8}} />
        <div style={{marginTop:12}}>
          <button type="submit" style={{padding:'8px 16px'}}>Sign in</button>
          <button type="button" style={{padding:'8px 16px', marginLeft:8}} onClick={()=>navigate('/')}>Back</button>
        </div>
      </form>
      <p style={{marginTop:12}}>{message}</p>
    </div>
  )
}
