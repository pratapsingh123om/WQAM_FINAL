// FRONTEND/frontend/src/components/ProjectRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("wqam_token");
  const userRole = localStorage.getItem("wqam_role");

  // Debug logging
  console.log("🔐 Protected Route Check:", { 
    hasToken: !!token, 
    userRole, 
    requiredRole: role 
  });

  // No token - redirect to login
  if (!token) {
    console.log("❌ No token, redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }

  // Role mismatch - redirect to home
  if (userRole !== role) {
    console.log(`❌ Role mismatch: ${userRole} != ${role}, redirecting to /`);
    return <Navigate to="/" replace />;
  }

  console.log("✅ Access granted to:", role);
  return children;
}