import { BarChart3, TrendingUp, Droplets, AlertCircle } from 'lucide-react';

export function DashboardPreview() {
  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-transparent via-cyan-50/50 to-transparent overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-blue-100/60 backdrop-blur-sm rounded-full mb-4">
            <span className="text-blue-700">Dashboard</span>
          </div>
          <h2 className="text-4xl lg:text-5xl text-slate-900 mb-4">
            Visualize Your Water Quality
            <span className="block bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              In Real-Time
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Interactive dashboard with advanced analytics and beautiful data visualizations
          </p>
        </div>

        {/* Dashboard Frame with Glow */}
        <div className="relative">
          {/* Outer Glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-[3rem] blur-3xl opacity-30 animate-pulse"></div>
          
          {/* Dashboard Container */}
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-1 shadow-2xl">
            {/* Inner Container */}
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-[2.3rem] p-8 lg:p-12">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Droplets className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-slate-900">Water Quality Dashboard</div>
                    <div className="text-slate-500">Last updated: 2 minutes ago</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-xl">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-700">All Systems Normal</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'pH Level', value: '7.2', status: 'optimal', icon: TrendingUp, color: 'cyan' },
                  { label: 'Turbidity', value: '1.8 NTU', status: 'good', icon: BarChart3, color: 'blue' },
                  { label: 'Dissolved O₂', value: '8.4 mg/L', status: 'excellent', icon: Droplets, color: 'indigo' },
                  { label: 'Alerts', value: '0', status: 'safe', icon: AlertCircle, color: 'green' }
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={index}
                      className="relative bg-gradient-to-br from-white to-slate-50 p-6 rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br from-${stat.color}-400 to-${stat.color}-600 rounded-xl flex items-center justify-center shadow-md`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="text-slate-600 mb-1">{stat.label}</div>
                      <div className={`text-3xl bg-gradient-to-r from-${stat.color}-600 to-${stat.color}-700 bg-clip-text text-transparent`}>
                        {stat.value}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chart Area */}
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-8 border border-cyan-100 shadow-inner">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-slate-900">24-Hour Trend Analysis</div>
                  <div className="flex gap-2">
                    {['pH', 'Temp', 'DO'].map((label) => (
                      <div key={label} className="px-3 py-1 bg-white rounded-lg text-slate-700 shadow-sm">
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Simplified Chart Visualization */}
                <div className="h-64 relative">
                  <svg className="w-full h-full" viewBox="0 0 800 250" preserveAspectRatio="none">
                    {/* Grid Lines */}
                    {[0, 1, 2, 3, 4].map((i) => (
                      <line
                        key={i}
                        x1="0"
                        y1={i * 62.5}
                        x2="800"
                        y2={i * 62.5}
                        stroke="#cbd5e1"
                        strokeWidth="1"
                        opacity="0.3"
                      />
                    ))}
                    
                    {/* Chart Lines */}
                    <path
                      d="M0,180 Q200,120 400,140 T800,100"
                      fill="none"
                      stroke="url(#chartGradient1)"
                      strokeWidth="3"
                      className="drop-shadow-lg"
                    />
                    <path
                      d="M0,200 Q200,160 400,170 T800,140"
                      fill="none"
                      stroke="url(#chartGradient2)"
                      strokeWidth="3"
                      className="drop-shadow-lg"
                    />
                    
                    {/* Gradient Fill */}
                    <path
                      d="M0,180 Q200,120 400,140 T800,100 L800,250 L0,250 Z"
                      fill="url(#chartFill)"
                      opacity="0.2"
                    />
                    
                    <defs>
                      <linearGradient id="chartGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                      <linearGradient id="chartGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                      <linearGradient id="chartFill" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
