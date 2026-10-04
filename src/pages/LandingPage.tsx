import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { EverythingConnected } from '../components/EverythingConnected';
import { CustomerJourney } from '../components/CustomerJourney';
import { AISection } from '../components/AISection';
import { DashboardShowcase } from '../components/DashboardShowcase';
import { Testimonials } from '../components/Testimonials';
import { Stats } from '../components/Stats';
import { CTA } from '../components/CTA';
import { Footer } from '../components/Footer';
import { DemoModal } from '../components/DemoModal';
import { FeatureDetailModal } from '../components/FeatureDetailModal';

import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const handleOpenLogin = () => {
    navigate('/login');
  };

  const handleOpenSignup = () => {
    navigate('/signup');
  };

  const handleOpenDemo = () => {
    setDemoModalOpen(true);
  };

  // Feature mapping directly to workspace routes
  const featureRoutes: Record<string, string> = {
    'Customers': '/customers',
    'Leads': '/leads',
    'Sales Pipeline': '/pipeline',
    'Tasks': '/tasks',
    'Communication': '/communication',
    'Calls': '/calls',
    'Calendar': '/calendar',
    'Support Tickets': '/tickets',
    'Reports & Analytics': '/reports',
    'AI Insights': '/ai-insights',
    'Notifications': '/notifications',
    'Users & Roles': '/users',
  };

  const handleSelectFeature = (featureName: string) => {
    if (isAuthenticated) {
      const route = featureRoutes[featureName];
      if (route) {
        navigate(route);
        return;
      }
    }
    // If not authenticated or feature spec requested, route to registration
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#151A18] font-sans antialiased overflow-x-hidden selection:bg-[#0D2218] selection:text-[#FAF6F0]">
      {/* 1. Navigation */}
      <Navbar
        onOpenLogin={handleOpenLogin}
        onOpenSignup={handleOpenSignup}
        onOpenDemo={handleOpenDemo}
      />

      <main>
        {/* 2. Hero Section */}
        <Hero
          onOpenSignup={handleOpenSignup}
          onOpenDemo={handleOpenDemo}
        />

        {/* 3. Everything Connected */}
        <EverythingConnected
          onSelectFeature={handleSelectFeature}
          onExploreFeatures={() => {
            navigate(isAuthenticated ? '/dashboard' : '/signup');
          }}
        />

        {/* 4. Complete Customer Journey */}
        <CustomerJourney />

        {/* 5. Kairoo Intelligence / AI */}
        <AISection onOpenAIDemo={() => navigate(isAuthenticated ? '/ai-insights' : '/signup')} />

        {/* 6. Everything You Need to Succeed */}
        <DashboardShowcase
          onOpenDashboardPreview={() => {
            navigate(isAuthenticated ? '/dashboard' : '/signup');
          }}
        />

        {/* 7. Real Businesses. Real Results. */}
        <Testimonials onOpenStories={handleOpenDemo} />

        {/* 8. Statistics */}
        <Stats />

        {/* 9. Final CTA */}
        <CTA
          onOpenSignup={handleOpenSignup}
          onOpenDemo={handleOpenDemo}
        />
      </main>

      {/* 10. Footer */}
      <Footer
        onOpenPricing={handleOpenSignup}
        onOpenContact={handleOpenSignup}
        onOpenDocumentation={handleOpenDemo}
      />

      {/* Interactive Modals */}
      <DemoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        onOpenSignup={() => {
          setDemoModalOpen(false);
          handleOpenSignup();
        }}
      />

      <FeatureDetailModal
        featureName={selectedFeature}
        onClose={() => setSelectedFeature(null)}
        onOpenSignup={() => {
          setSelectedFeature(null);
          handleOpenSignup();
        }}
      />
    </div>
  );
};
export default LandingPage;
