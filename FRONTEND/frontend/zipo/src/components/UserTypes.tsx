import { Shield, Building2, CheckSquare } from 'lucide-react';

const userTypes = [
  {
    icon: Shield,
    title: 'Admin',
    description: 'Complete system control with user management, approval workflows, and system configuration.',
    features: ['User Management', 'System Settings', 'Approval Control', 'Analytics Access'],
    gradient: 'from-cyan-500 to-blue-600',
    bgGradient: 'from-cyan-50 to-blue-50'
  },
  {
    icon: Building2,
    title: 'Industry User',
    description: 'Upload reports, view analysis results, and access historical data for your facilities.',
    features: ['Upload Reports', 'View Analysis', 'Historical Data', 'Export Reports'],
    gradient: 'from-blue-500 to-indigo-600',
    bgGradient: 'from-blue-50 to-indigo-50'
  },
  {
    icon: CheckSquare,
    title: 'Validator',
    description: 'Review and validate water quality reports with expert tools and compliance checking.',
    features: ['Validate Reports', 'Compliance Check', 'Expert Review', 'Approve/Reject'],
    gradient: 'from-indigo-500 to-purple-600',
    bgGradient: 'from-indigo-50 to-purple-50'
  }
];

export function UserTypes() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-indigo-100/60 backdrop-blur-sm rounded-full mb-4">
            <span className="text-indigo-700">User Roles</span>
          </div>
          <h2 className="text-4xl lg:text-5xl text-slate-900 mb-4">
            Built for Every
            <span className="block bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Water Quality Professional
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Role-based access designed for your specific needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {userTypes.map((userType, index) => {
            const Icon = userType.icon;
            return (
              <div
                key={index}
                className="group relative"
              >
                {/* Card */}
                <div className={`relative h-full bg-gradient-to-br ${userType.bgGradient} p-8 rounded-3xl border-2 border-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}>
                  {/* Glow Effect on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${userType.gradient} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className={`w-20 h-20 bg-gradient-to-br ${userType.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl text-slate-900 mb-3">
                    {userType.title}
                  </h3>
                  <p className="text-slate-600 mb-6">
                    {userType.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-3">
                    {userType.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className={`w-5 h-5 bg-gradient-to-br ${userType.gradient} rounded-md flex items-center justify-center flex-shrink-0`}>
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Bottom Decoration */}
                  <div className={`absolute -bottom-3 -right-3 w-24 h-24 bg-gradient-to-br ${userType.gradient} rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
