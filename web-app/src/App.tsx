import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';
import Services from '@/pages/Services';

// Service Pages
import LandingPage from '@/pages/services/LandingPage';
import Ecommerce from '@/pages/services/Ecommerce';
import LMS from '@/pages/services/LMS';
import WebApp from '@/pages/services/WebApp';
import Marketing from '@/pages/services/Marketing';
import DataAnalysis from '@/pages/services/DataAnalysis';
import Support from '@/pages/services/Support';
import CRM from '@/pages/services/CRM';
import Chatbot from '@/pages/services/Chatbot';
import StartProject from '@/pages/StartProject';

// Legal Pages
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          {/* All Services */}
          <Route path="servicios" element={<Services />} />

          {/* Development Services */}
          <Route path="services/landing-page" element={<LandingPage />} />
          <Route path="services/ecommerce" element={<Ecommerce />} />
          <Route path="services/lms" element={<LMS />} />
          <Route path="services/web-app" element={<WebApp />} />

          {/* Additional Services */}
          <Route path="services/marketing" element={<Marketing />} />
          <Route path="services/data-analysis" element={<DataAnalysis />} />
          <Route path="services/support" element={<Support />} />
          <Route path="services/crm" element={<CRM />} />
          <Route path="services/chatbot" element={<Chatbot />} />

          {/* Navigator */}
          <Route path="/start-project" element={<StartProject />} />

          {/* Legal Pages */}
          <Route path="/terminos" element={<Terms />} />
          <Route path="/privacidad" element={<Privacy />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
