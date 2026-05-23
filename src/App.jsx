import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import InvestorModal from './components/InvestorModal/InvestorModal';
import HomePage from './pages/HomePage';
import OverviewPage from './pages/OverviewPage';
import WhoWeArePage from './pages/WhoWeArePage';
import InvestmentCulturePage from './pages/InvestmentCulturePage';
import BusinessModelPage from './pages/BusinessModelPage';
import InvestmentStrategiesPage from './pages/InvestmentStrategiesPage';
import TeamProcessPage from './pages/TeamProcessPage';
import SustainabilityHomePage from './pages/SustainabilityHomePage';
import './App.css';

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isSustainability = location.pathname.startsWith('/sustainability');

  const openModal = (sectionId = null) => {
    setActiveSection(sectionId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveSection(null);
  };

  return (
    <div
      className={`${isHome ? 'portal-homepage' : isSustainability ? 'sustainability-route' : 'portal-page'} page basicpage`}
    >
      {!isSustainability && <Header onOpenModal={() => openModal()} isHome={isHome} />}

      <Routes>
        <Route path="/" element={<HomePage onSelectChannel={(id) => openModal(id)} />} />
        <Route path="/about-us/overview" element={<OverviewPage />} />
        <Route path="/about-us/who-we-are" element={<WhoWeArePage />} />
        <Route path="/about-us/investment-culture" element={<InvestmentCulturePage />} />
        <Route path="/about-us/business-model" element={<BusinessModelPage />} />
        <Route path="/about-us/investment-strategies" element={<InvestmentStrategiesPage />} />
        <Route
          path="/about-us/investment-strategies/:teamSlug"
          element={<TeamProcessPage />}
        />
        <Route path="/sustainability/home" element={<SustainabilityHomePage />} />
      </Routes>

      {!isSustainability && <Footer />}

      {!isSustainability && (
        <InvestorModal
          isOpen={modalOpen}
          onClose={closeModal}
          activeSection={activeSection}
        />
      )}
    </div>
  );
}

export default App;
