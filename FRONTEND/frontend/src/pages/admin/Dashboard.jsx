// FRONTEND/frontend/src/pages/admin/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

function authHeader() {
  const token = localStorage.getItem('wqam_token');
  return token ? { 
    "Authorization": "Bearer " + token,
    "Content-Type": "application/json"
  } : {};
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [pending, setPending] = useState([]);
  const [stats, setStats] = useState({ total: 0, approved: 0, rejected: 0 });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadPending() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/pending`, { 
        headers: authHeader() 
      });
      
      if (res.ok) {
        const data = await res.json();
        setPending(data);
        setStats({
          total: data.length,
          approved: 0, // You might want to fetch these from backend
          rejected: 0
        });
        setMsg("");
      } else {
        setMsg("Failed to load pending users");
      }
    } catch (err) {
      setMsg("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function approve(id) {
    try {
      const res = await fetch(`${API}/admin/approve/${id}`, { 
        method: "POST", 
        headers: authHeader() 
      });
      
      if (res.ok) {
        setMsg("✅ User approved successfully");
        loadPending();
      } else {
        setMsg("❌ Approve failed");
      }
    } catch (err) {
      setMsg("❌ Approve error: " + err.message);
    }
  }

  async function reject(id) {
    try {
      const res = await fetch(`${API}/admin/reject/${id}`, { 
        method: "POST", 
        headers: authHeader() 
      });
      
      if (res.ok) {
        setMsg("✅ User rejected successfully");
        loadPending();
      } else {
        setMsg("❌ Reject failed");
      }
    } catch (err) {
      setMsg("❌ Reject error: " + err.message);
    }
  }

  function logout() {
    localStorage.removeItem("wqam_token");
    localStorage.removeItem("wqam_role");
    navigate("/");
  }

  useEffect(() => { 
    loadPending(); 
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-800/80 to-slate-900/80 backdrop-blur-md border-b border-purple-500/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">👑</span>
              </div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-purple-200">User Management & System Control</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl border border-purple-500/30 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-purple-200 mb-2">Pending Approvals</h3>
            <p className="text-3xl font-black text-white">{stats.total}</p>
          </div>
          <div className="p-6 bg-gradient-to-br from-emerald-600/20 to-green-600/20 rounded-2xl border border-emerald-500/30 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-emerald-200 mb-2">Approved Users</h3>
            <p className="text-3xl font-black text-white">{stats.approved}</p>
          </div>
          <div className="p-6 bg-gradient-to-br from-red-600/20 to-orange-600/20 rounded-2xl border border-red-500/30 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-red-200 mb-2">Rejected Users</h3>
            <p className="text-3xl font-black text-white">{stats.rejected}</p>
          </div>
        </div>

        {/* Pending Users Table */}
        <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 rounded-3xl shadow-xl border border-slate-700/50 backdrop-blur-sm overflow-hidden">
          <div className="p-6 border-b border-slate-700/50">
            <h2 className="text-xl font-bold text-purple-100">Pending User Approvals</h2>
            <p className="text-purple-200 text-sm mt-1">Review and manage user registrations</p>
          </div>
          
          <div className="p-6">
            {msg && (
              <div className={`p-4 rounded-xl mb-6 ${
                msg.includes('✅') ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300' :
                msg.includes('❌') ? 'bg-red-500/20 border border-red-500/30 text-red-300' :
                'bg-blue-500/20 border border-blue-500/30 text-blue-300'
              }`}>
                {msg}
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-purple-300 font-semibold">Loading pending users...</p>
              </div>
            ) : pending.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-semibold text-purple-200 mb-2">All Clear!</h3>
                <p className="text-purple-300">No pending user registrations at the moment.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="text-left py-4 px-4 text-purple-300 font-semibold">User</th>
                      <th className="text-left py-4 px-4 text-purple-300 font-semibold">Role</th>
                      <th className="text-left py-4 px-4 text-purple-300 font-semibold">Organization</th>
                      <th className="text-left py-4 px-4 text-purple-300 font-semibold">Type</th>
                      <th className="text-left py-4 px-4 text-purple-300 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pending.map((user, index) => (
                      <tr 
                        key={user.id} 
                        className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors duration-200"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-semibold text-white">{user.name || 'N/A'}</p>
                            <p className="text-sm text-purple-300">{user.email}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'admin' ? 'bg-purple-500/20 text-purple-300' :
                            user.role === 'validator' ? 'bg-amber-500/20 text-amber-300' :
                            'bg-blue-500/20 text-blue-300'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-purple-200">{user.organisation || 'N/A'}</td>
                        <td className="py-4 px-4 text-purple-200">{user.industry_type || user.validator_type || 'N/A'}</td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => approve(user.id)}
                              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => reject(user.id)}
                              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}