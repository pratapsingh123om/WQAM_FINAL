import { Target, Zap, ShieldCheck, Clock } from 'lucide-react';

const benefits = [
  {
    icon: Target,
    title: 'Accuracy',
    description: '99.9% precision in water quality analysis with AI-powered validation'
  },
  {
    icon: Zap,
    title: 'Automation',
    description: 'Reduce manual work by 80% with intelligent report processing'
  },
  {
    icon: ShieldCheck,
    title: 'Compliance',
    description: 'Stay compliant with all regulatory standards automatically'
  },
  {
    icon: Clock,
    title: 'Speed',
    description: 'Get analysis results in minutes instead of hours'
  }
];

export function WhyChooseUs() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Floating Bubble Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-cyan-300/10 rounded-full blur-xl animate-float"
            style={{
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${Math.random() * 10 + 15}s`
            }}
          ></div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-cyan-100/60 backdrop-blur-sm rounded-full mb-4">
            <span className="text-cyan-700">Why Choose WQAM</span>
          </div>
          <h2 className="text-4xl lg:text-5xl text-slate-900 mb-4">
            The Smart Choice for
            <span className="block bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Water Quality Management
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Industry-leading technology that transforms how you manage water quality
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="group relative bg-white/70 backdrop-blur-xl p-8 rounded-2xl border border-white/80 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                {/* Check Icon Background */}
                <div className="absolute top-6 right-6 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                {/* Icon */}
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl text-slate-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-slate-600">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="relative">
          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-3xl blur-2xl opacity-20"></div>
          
          {/* Card */}
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 text-center shadow-2xl">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-3xl lg:text-4xl text-white mb-4">
                Ready to Transform Your Water Quality Management?
              </h3>
              <p className="text-xl text-slate-300 mb-8">
                Join hundreds of organizations already using WQAM for smarter water analysis
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  Start Free Trial
                </button>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-2xl border-2 border-white/30 hover:bg-white/20 transition-all duration-300">
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
