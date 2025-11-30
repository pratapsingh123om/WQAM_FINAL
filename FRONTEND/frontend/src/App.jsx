// FRONTEND/frontend/src/App.jsx
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/Dashboard";
import Auth from "./pages/auth/Auth";
import UserDashboard from "./pages/user/UserDashboard";
import ValidatorDashboard from "./pages/validator/ValidatorDashboard";
import ProtectedRoute from "./components/ProjectRoute";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* New Beautiful Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Routes */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Protected Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user/dashboard" 
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/validator/dashboard" 
          element={
            <ProtectedRoute role="validator">
              <ValidatorDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;