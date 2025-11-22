import { useEffect, useState, useMemo } from "react";

// The API endpoint from your config
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// --- Utility Components for Visuals ---

// 1. Water Quality Index (WQI) Gauge
const WqiGauge = ({ wqi, status, color }) => {
    // Normalizes WQI (0-100) to a degree value for the SVG arc
    const normalizedValue = Math.min(Math.max(wqi, 0), 100);
    const strokeDashoffset = 440 - (440 * normalizedValue) / 100;
    
    return (
        <div className="flex flex-col items-center justify-center p-6 bg-slate-800/30 rounded-2xl shadow-xl backdrop-blur-sm border border-cyan-800/50">
            <h3 className="text-xl font-bold text-gray-200 mb-4">Overall WQI</h3>
            <svg width="160" height="160" viewBox="0 0 160 160" className="transform rotate-180">
                {/* Background Arc (Gray) */}
                <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="#0A192F"
                    strokeWidth="15"
                />
                {/* Foreground Arc (Colored) */}
                <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke={color}
                    strokeWidth="15"
                    strokeDasharray="440"
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-white mt-[-80px]">{wqi}</span>
                <span className={`text-sm font-semibold mt-1 px-3 py-1 rounded-full ${status === 'SAFE' ? 'bg-emerald-600' : status === 'WARNING' ? 'bg-amber-600' : 'bg-red-600'}`}>
                    {status}
                </span>
            </div>
        </div>
    );
};

// 2. Key Performance Indicator (KPI) Data Card
const DataCard = ({ title, value, unit, icon, color = 'text-cyan-400' }) => {
    return (
        <div className="p-4 bg-slate-800/30 rounded-xl shadow-lg transition-all duration-300 hover:bg-slate-700/50 hover:shadow-cyan-500/20 border border-cyan-800/50">
            <div className="flex items-center space-x-3">
                <div className={`text-2xl ${color}`}>{icon}</div>
                <div className="flex flex-col">
                    <span className="text-sm text-gray-400 uppercase">{title}</span>
                    <span className="text-3xl font-extrabold text-white">
                        {value}
                        <span className="text-sm font-normal ml-1 text-gray-400">{unit}</span>
                    </span>
                </div>
            </div>
        </div>
    );
};


// --- Main Dashboard Component ---

export default function UserDashboard({ navigate }) {
  const [me, setMe] = useState(null);
  // Placeholder state for sensor data
  const [data, setData] = useState({
    wqi: 78, // Example WQI value
    ph: 7.2,
    turbidity: 5.5, // NTU
    conductivity: 512, // uS/cm
    dissolvedOxygen: 7.8, // mg/L
    lastUpdated: new Date().toLocaleTimeString(),
  });

  // Fetch user info
  async function loadMe() {
    const token = localStorage.getItem("wqam_token");
    if (!token) { navigate("/"); return; }
    const res = await fetch(`${API_BASE_URL}/me`, { headers: { Authorization: "Bearer " + token } });
    if (res.ok) setMe(await res.json());
    else navigate("/");
  }

  // Determine WQI Status and Color dynamically
  const { status, color } = useMemo(() => {
    if (data.wqi >= 80) return { status: 'SAFE', color: '#28FF8E' }; // Emerald Green
    if (data.wqi >= 50) return { status: 'WARNING', color: '#FFD700' }; // Gold/Yellow
    return { status: 'CRITICAL', color: '#FF3B3B' }; // Red
  }, [data.wqi]);

  useEffect(() => { loadMe(); }, []);

  // Simulate real-time data updates (replace with actual API polling)
  useEffect(() => {
    const interval = setInterval(() => {
        // Simulating minor fluctuation for the live effect
        setData(prev => ({
            ...prev,
            wqi: Math.round(70 + Math.random() * 30),
            lastUpdated: new Date().toLocaleTimeString(),
        }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  function logout() {
    localStorage.removeItem("wqam_token");
    localStorage.removeItem("wqam_role");
    navigate("/");
  }

  if (!me) return <div className="text-center text-cyan-400 mt-20">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen p-6 bg-deep-navy text-gray-50 font-sans">
      <header className="flex justify-between items-center pb-6 border-b border-cyan-800/50 mb-6">
        <h1 className="text-3xl font-extrabold text-vibrant-aqua tracking-wider">
          WQAM User Dashboard
        </h1>
        <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400 hidden sm:inline">Welcome, {me.email}</span>
            <button 
                onClick={logout} 
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-600/80 hover:bg-red-700 transition duration-200"
            >
                Logout
            </button>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* WQI GAUGE (Column 1) */}
        <section className="lg:col-span-1 flex justify-center">
            <WqiGauge wqi={data.wqi} status={status} color={color} />
        </section>

        {/* KPI CARDS (Columns 2 & 3) */}
        <section className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* KPI 1: pH */}
            <DataCard 
                title="pH Level" 
                value={data.ph.toFixed(1)} 
                unit="" 
                icon="💧" 
                color={data.ph > 8.5 || data.ph < 6.5 ? 'text-amber-500' : 'text-emerald-500'}
            />
            {/* KPI 2: Turbidity */}
            <DataCard 
                title="Turbidity" 
                value={data.turbidity.toFixed(1)} 
                unit="NTU" 
                icon="🌫️" 
                color={data.turbidity > 5 ? 'text-amber-500' : 'text-emerald-500'}
            />
            {/* KPI 3: Conductivity */}
            <DataCard 
                title="Conductivity" 
                value={data.conductivity} 
                unit="μS/cm" 
                icon="⚡" 
                color="text-vibrant-aqua"
            />
            {/* KPI 4: Dissolved Oxygen */}
            <DataCard 
                title="Dissolved Oxygen" 
                value={data.dissolvedOxygen.toFixed(1)} 
                unit="mg/L" 
                icon="💨" 
                color={data.dissolvedOxygen < 4 ? 'text-red-500' : 'text-emerald-500'}
            />
        </section>
        
        {/* Timeseries Charts Placeholder (Full Width Row) */}
        <section className="lg:col-span-3">
            <div className="p-6 bg-slate-800/30 rounded-2xl shadow-xl border border-cyan-800/50">
                <h3 className="text-xl font-bold text-gray-200 mb-4 border-b border-cyan-800/50 pb-2">
                    Timeseries Analysis (Past 24 Hours)
                </h3>
                <p className="text-gray-400 italic">
                    [Placeholder for dynamic line charts using a library like Recharts or D3]
                </p>
                <div className="h-64 flex items-center justify-center text-cyan-600/50 text-lg">
                    Line Chart Visualization Goes Here
                </div>
            </div>
        </section>

        {/* Data Upload / Logs Placeholder (Full Width Row) */}
        <section className="lg:col-span-3">
            <div className="p-6 bg-slate-800/30 rounded-2xl shadow-xl border border-cyan-800/50">
                <h3 className="text-xl font-bold text-gray-200 mb-4 border-b border-cyan-800/50 pb-2">
                    Data Operations & Latest Log
                </h3>
                <p className="text-gray-400">
                    Last Data Update: {data.lastUpdated}
                </p>
                <button className="mt-4 px-6 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white font-semibold transition duration-200">
                    Upload New Data (CSV)
                </button>
            </div>
        </section>

      </main>
    </div>
  );
}