// FRONTEND/frontend/src/pages/user/UserDashboard.jsx
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardAnimation from "../../components/DashboardAnimation";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Enhanced WQI Gauge with Smooth Animations
const WqiGauge = ({ wqi, status, color }) => {
  const normalizedValue = Math.min(Math.max(wqi, 0), 100);
  const strokeDashoffset = 440 - (440 * normalizedValue) / 100;
  
  return (
    <div className="relative flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-800/40 to-slate-900/60 rounded-3xl shadow-2xl backdrop-blur-sm border border-cyan-500/30 transform transition-all duration-500 hover:scale-105 hover:shadow-cyan-500/20">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 rounded-3xl"></div>
      <h3 className="text-xl font-bold text-cyan-100 mb-6 z-10">Water Quality Index</h3>
      <svg width="180" height="180" viewBox="0 0 180 180" className="transform rotate-180 z-10">
        <circle cx="90" cy="90" r="75" fill="none" stroke="#0A192F" strokeWidth="12"/>
        <circle cx="90" cy="90" r="75" fill="none" stroke={color} strokeWidth="12" strokeDasharray="471" 
                strokeDashoffset={strokeDashoffset} strokeLinecap="round" 
                style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}/>
      </svg>
      <div className="absolute flex flex-col items-center justify-center z-10">
        <span className="text-5xl font-black text-white mt-[-90px] bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
          {wqi}
        </span>
        <span className={`text-sm font-bold mt-2 px-4 py-2 rounded-full backdrop-blur-sm border ${
          status === 'SAFE' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 
          status === 'WARNING' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 
          'bg-red-500/20 text-red-300 border-red-500/30'
        }`}>
          {status}
        </span>
      </div>
    </div>
  );
};

// Enhanced Data Card with Hover Effects
const DataCard = ({ title, value, unit, icon, color = 'text-cyan-400', trend, status }) => {
  return (
    <div className="group relative p-6 bg-gradient-to-br from-slate-800/40 to-slate-900/60 rounded-2xl shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-cyan-500/10 border border-slate-700/50 backdrop-blur-sm overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10 flex items-center space-x-4">
        <div className={`text-3xl transform transition-transform duration-300 group-hover:scale-110 ${color}`}>
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-cyan-200 uppercase tracking-wider">{title}</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white">{value}</span>
            <span className="text-sm font-medium text-gray-400">{unit}</span>
          </div>
          {trend && (
            <span className={`text-xs font-semibold mt-1 ${
              trend > 0 ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
            </span>
          )}
        </div>
      </div>
      
      {/* Status indicator */}
      {status && (
        <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
          status === 'good' ? 'bg-emerald-500' : 
          status === 'warning' ? 'bg-amber-500' : 
          'bg-red-500'
        }`}></div>
      )}
    </div>
  );
};

// Water Quality Trend Chart
const TrendChart = () => {
  return (
    <div className="col-span-2 p-6 bg-gradient-to-br from-slate-800/40 to-slate-900/60 rounded-3xl shadow-xl border border-slate-700/50 backdrop-blur-sm">
      <h3 className="text-xl font-bold text-cyan-100 mb-6">Water Quality Trends (24h)</h3>
      <div className="h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="text-cyan-500 text-6xl mb-4">📊</div>
          <p className="text-cyan-200 font-semibold">Real-time Analytics</p>
          <p className="text-gray-400 text-sm mt-2">Interactive charts coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default function UserDashboard() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [data, setData] = useState({
    wqi: 78,
    ph: 7.2,
    turbidity: 5.5,
    conductivity: 512,
    dissolvedOxygen: 7.8,
    temperature: 22.5,
    lastUpdated: new Date().toLocaleTimeString(),
  });

  const { status, color } = useMemo(() => {
    if (data.wqi >= 80) return { status: 'SAFE', color: '#28FF8E' };
    if (data.wqi >= 50) return { status: 'WARNING', color: '#FFD700' };
    return { status: 'CRITICAL', color: '#FF3B3B' };
  }, [data.wqi]);

  async function loadMe() {
    const token = localStorage.getItem("wqam_token");
    if (!token) { navigate("/"); return; }
    const res = await fetch(`${API_BASE_URL}/me`, { 
      headers: { Authorization: "Bearer " + token } 
    });
    if (res.ok) setMe(await res.json());
    else navigate("/");
  }

  // Simulate real-time data updates
  useEffect(() => {
    loadMe();
    
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        wqi: Math.round(70 + Math.random() * 30),
        ph: 6.8 + Math.random() * 1.4,
        lastUpdated: new Date().toLocaleTimeString(),
      }));
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  function logout() {
    localStorage.removeItem("wqam_token");
    localStorage.removeItem("wqam_role");
    navigate("/");
  }

  if (!me) return (
    <div className="min-h-screen bg-deep-navy flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-cyan-400 font-semibold">Loading Dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-deep-navy to-slate-900 text-white font-sans">
      {/* Animated Header */}
      <header className="relative bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-md border-b border-cyan-800/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">💧</span>
              </div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  WQAM Dashboard
                </h1>
                <p className="text-sm text-cyan-200">Real-time Water Quality Monitoring</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-cyan-100 font-semibold">{me.email}</p>
                <p className="text-sm text-cyan-300">Industry User</p>
              </div>
              <button 
                onClick={logout}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Animation */}
      <div className="container mx-auto px-6 py-8">
        <DashboardAnimation />
      </div>

      {/* Main Dashboard Grid */}
      <main className="container mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* WQI Gauge */}
          <div className="lg:col-span-1 flex justify-center">
            <WqiGauge wqi={data.wqi} status={status} color={color} />
          </div>

          {/* KPI Cards Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <DataCard 
              title="pH Level" 
              value={data.ph.toFixed(1)} 
              unit="" 
              icon="🧪" 
              color={data.ph > 8.5 || data.ph < 6.5 ? 'text-amber-400' : 'text-emerald-400'}
              status={data.ph > 8.5 || data.ph < 6.5 ? 'warning' : 'good'}
            />
            <DataCard 
              title="Turbidity" 
              value={data.turbidity.toFixed(1)} 
              unit="NTU" 
              icon="🌫️" 
              color={data.turbidity > 5 ? 'text-amber-400' : 'text-emerald-400'}
              status={data.turbidity > 5 ? 'warning' : 'good'}
            />
            <DataCard 
              title="Conductivity" 
              value={data.conductivity} 
              unit="μS/cm" 
              icon="⚡" 
              color="text-blue-400"
              trend={2.3}
            />
            <DataCard 
              title="Dissolved Oxygen" 
              value={data.dissolvedOxygen.toFixed(1)} 
              unit="mg/L" 
              icon="💨" 
              color={data.dissolvedOxygen < 4 ? 'text-red-400' : 'text-emerald-400'}
              status={data.dissolvedOxygen < 4 ? 'critical' : 'good'}
            />
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <TrendChart />
          
          {/* Quick Actions */}
          <div className="p-6 bg-gradient-to-br from-slate-800/40 to-slate-900/60 rounded-3xl shadow-xl border border-slate-700/50 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-cyan-100 mb-6">Quick Actions</h3>
            <div className="space-y-4">
              <button className="w-full px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                📤 Upload Water Data
              </button>
              <button className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                📊 Generate Report
              </button>
              <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                🔔 Set Alerts
              </button>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="p-6 bg-gradient-to-br from-slate-800/40 to-slate-900/60 rounded-3xl shadow-xl border border-slate-700/50 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-cyan-100 mb-6">System Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-slate-800/50 rounded-xl">
              <div className="text-2xl mb-2">🟢</div>
              <p className="text-sm text-cyan-200">Sensors</p>
              <p className="text-lg font-bold text-white">Online</p>
            </div>
            <div className="text-center p-4 bg-slate-800/50 rounded-xl">
              <div className="text-2xl mb-2">🟢</div>
              <p className="text-sm text-cyan-200">Data Stream</p>
              <p className="text-lg font-bold text-white">Active</p>
            </div>
            <div className="text-center p-4 bg-slate-800/50 rounded-xl">
              <div className="text-2xl mb-2">⏱️</div>
              <p className="text-sm text-cyan-200">Last Update</p>
              <p className="text-lg font-bold text-white">{data.lastUpdated}</p>
            </div>
            <div className="text-center p-4 bg-slate-800/50 rounded-xl">
              <div className="text-2xl mb-2">📈</div>
              <p className="text-sm text-cyan-200">WQI Trend</p>
              <p className="text-lg font-bold text-white">Stable</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}