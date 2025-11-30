import { Brain, Activity, FileText, UserCheck } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI Report Generation',
    description: 'Intelligent analysis that automatically generates comprehensive water quality reports with actionable insights.',
    gradient: 'from-cyan-400 to-blue-500'
  },
  {
    icon: Activity,
    title: 'Real-time Water Health Dashboard',
    description: 'Monitor all critical parameters live with intuitive visualizations and instant alerts for anomalies.',
    gradient: 'from-blue-400 to-indigo-500'
  },
  {
    icon: FileText,
    title: 'Automated PDF → CSV Extraction',
    description: 'Convert laboratory reports automatically with AI-powered data extraction and validation.',
    gradient: 'from-indigo-400 to-purple-500'
  },
  {
    icon: UserCheck,
    title: 'Admin Approval & User Management',
    description: 'Complete role-based access control with approval workflows and comprehensive audit trails.',
    gradient: 'from-purple-400 to-pink-500'
  }
];

export function Features() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-cyan-100/60 backdrop-blur-sm rounded-full mb-4">
            <span className="text-cyan-700">Features</span>
          </div>
          <h2 className="text-4xl lg:text-5xl text-slate-900 mb-4">
            Everything You Need for
            <span className="block bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Complete Water Quality Control
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Powerful tools designed to streamline your water analysis workflow
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white/80 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Gradient Border Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Icon */}
                <div className={`relative w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>

                {/* Decorative Element */}
                <div className={`absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
