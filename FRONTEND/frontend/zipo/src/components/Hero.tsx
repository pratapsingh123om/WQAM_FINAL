import { Droplets, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Hero() {
  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated Background Waves */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute bottom-0 w-full h-full opacity-30" viewBox="0 0 1440 800" preserveAspectRatio="none">
          <path
            d="M0,400 C360,300 720,500 1440,400 L1440,800 L0,800 Z"
            fill="url(#gradient1)"
            className="animate-[wave_8s_ease-in-out_infinite]"
          />
          <path
            d="M0,500 C360,400 720,600 1440,500 L1440,800 L0,800 Z"
            fill="url(#gradient2)"
            className="animate-[wave_12s_ease-in-out_infinite]"
            style={{ animationDelay: '-2s' }}
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Floating Bubbles */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Text & CTAs */}
        <div className="space-y-8 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md rounded-full border border-cyan-200/50 shadow-lg">
            <Droplets className="w-5 h-5 text-cyan-600" />
            <span className="text-cyan-900">AI-Powered Water Analysis</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl text-slate-900 leading-tight">
            Water Quality
            <span className="block bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Analysis & Management
            </span>
            Dashboard
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl">
            AI-powered analysis, automated reporting, and live water health monitoring.
            Transform your water quality data into actionable insights.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white/80 backdrop-blur-md text-slate-900 rounded-2xl border-2 border-cyan-200 hover:border-cyan-400 hover:bg-white transition-all duration-300 shadow-lg">
              Login
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 pt-8">
            <div>
              <div className="text-3xl bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">99.9%</div>
              <div className="text-slate-600">Accuracy</div>
            </div>
            <div>
              <div className="text-3xl bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">24/7</div>
              <div className="text-slate-600">Monitoring</div>
            </div>
            <div>
              <div className="text-3xl bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">50+</div>
              <div className="text-slate-600">Parameters</div>
            </div>
          </div>
        </div>

        {/* Right Side - Dashboard Preview with Glow */}
        <div className="relative z-10">
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-[2rem] blur-2xl opacity-50 animate-pulse"></div>
            
            {/* Dashboard Mockup */}
            <div className="relative bg-white/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white/50 shadow-2xl">
              <div className="space-y-4">
                {/* Mock Dashboard Elements */}
                <div className="flex items-center justify-between pb-4 border-b border-cyan-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl"></div>
                    <div>
                      <div className="h-3 w-24 bg-slate-300/60 rounded"></div>
                      <div className="h-2 w-16 bg-slate-200/60 rounded mt-2"></div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm p-4 rounded-xl border border-white/60 shadow-lg">
                      <div className="h-2 w-16 bg-cyan-300/60 rounded mb-3"></div>
                      <div className="h-6 w-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded"></div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm p-6 rounded-xl border border-white/60 shadow-lg">
                  <div className="h-32 bg-gradient-to-t from-cyan-200/40 to-blue-200/40 rounded-lg relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-cyan-400/60 to-transparent rounded-b-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-cyan-400/30 rounded-full blur-xl animate-bounce" style={{ animationDuration: '3s' }}></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-400/30 rounded-full blur-xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        </div>
      </div>
    </div>
  );
}
