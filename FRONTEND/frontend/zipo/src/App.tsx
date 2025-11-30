import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { DashboardPreview } from './components/DashboardPreview';
import { UserTypes } from './components/UserTypes';
import { WhyChooseUs } from './components/WhyChooseUs';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      <Hero />
      <Features />
      <DashboardPreview />
      <UserTypes />
      <WhyChooseUs />
      <Footer />
    </div>
  );
}
