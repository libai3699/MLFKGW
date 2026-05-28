import { lazy, Suspense, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import NewsPage from './pages/NewsPage';
import OurPeoplePage from './pages/OurPeoplePage';
import KeyBusinessAreasPage from './pages/KeyBusinessAreasPage';
import CareerOpportunitiesPage from './pages/CareerOpportunitiesPage';
import BenefitsPage from './pages/BenefitsPage';
import LifeAtArtisanPage from './pages/LifeAtArtisanPage';
import ContactUsPage from './pages/ContactUsPage';
import LegalPage from './pages/LegalPage';
import InvestorSiteHomePage from './pages/InvestorSiteHomePage';
import InvestorAboutUsPage from './pages/InvestorAboutUsPage';
import GlobalInvestorPage from './pages/GlobalInvestorPage';
import SustainabilityHomePage from './pages/SustainabilityHomePage';
import './App.css';

const InvestorInvestmentPage = lazy(() => import('./pages/InvestorInvestmentPage.jsx'));
const InvestorNewsInsightsPage = lazy(() => import('./pages/InvestorNewsInsightsPage.jsx'));
const InvestorProfessionalContentPage = lazy(() => import('./pages/InvestorProfessionalContentPage.jsx'));
const InvestorDefinedContributionPage = lazy(() => import('./pages/InvestorDefinedContributionPage.jsx'));
const InvestorResourcesPage = lazy(() => import('./pages/InvestorResourcesPage.jsx'));
const SustainabilityContentPage = lazy(() => import('./pages/SustainabilityContentPage.jsx'));

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isSustainability = location.pathname.startsWith('/sustainability');
  const isInvestorSite =
    /^\/(institutional-investors|investment-professionals|individual-investors|global)(\/|\.html|$)/.test(
      location.pathname,
    );

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
      className={`${isHome ? 'portal-homepage' : isSustainability ? 'sustainability-route' : isInvestorSite ? 'investor-site-route' : 'portal-page'} page basicpage`}
    >
      {!isSustainability && !isInvestorSite && <Header onOpenModal={() => openModal()} isHome={isHome} />}

      <Suspense fallback={null}>
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
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news.html" element={<NewsPage />} />
        <Route path="/careers/our-people" element={<OurPeoplePage />} />
        <Route path="/careers/our-people.html" element={<OurPeoplePage />} />
        <Route path="/careers/key-business-areas" element={<KeyBusinessAreasPage />} />
        <Route path="/careers/key-business-areas.html" element={<KeyBusinessAreasPage />} />
        <Route path="/careers" element={<Navigate to="/careers/our-people" replace />} />
        <Route path="/careers/career-opportunities" element={<CareerOpportunitiesPage />} />
        <Route path="/careers/career-opportunities.html" element={<CareerOpportunitiesPage />} />
        <Route path="/careers/benefits-and-rewards-at-work" element={<BenefitsPage />} />
        <Route path="/careers/benefits-and-rewards-at-work.html" element={<BenefitsPage />} />
        <Route path="/careers/life-at-artisan-partners" element={<LifeAtArtisanPage />} />
        <Route path="/careers/life-at-artisan-partners.html" element={<LifeAtArtisanPage />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/contact-us.html" element={<ContactUsPage />} />
        <Route path="/legal-information" element={<LegalPage pageKey="legal-information" />} />
        <Route path="/legal-information.html" element={<LegalPage pageKey="legal-information" />} />
        <Route path="/privacy-policy" element={<LegalPage pageKey="privacy-policy" />} />
        <Route path="/privacy-policy.html" element={<LegalPage pageKey="privacy-policy" />} />
        <Route path="/cookies-policy" element={<LegalPage pageKey="cookies-policy" />} />
        <Route path="/cookies-policy.html" element={<LegalPage pageKey="cookies-policy" />} />
        <Route
          path="/institutional-investors/defined-contribution"
          element={<InvestorDefinedContributionPage />}
        />
        <Route
          path="/institutional-investors/defined-contribution.html"
          element={<InvestorDefinedContributionPage />}
        />
        <Route
          path="/institutional-investors/resources"
          element={<InvestorResourcesPage />}
        />
        <Route
          path="/institutional-investors/resources.html"
          element={<InvestorResourcesPage />}
        />
        <Route
          path="/institutional-investors/news-insights/artisan-canvas"
          element={<InvestorNewsInsightsPage />}
        />
        <Route
          path="/institutional-investors/news-insights/artisan-canvas.html"
          element={<InvestorNewsInsightsPage />}
        />
        <Route
          path="/institutional-investors/news-insights/:section/:pageSlug"
          element={<InvestorNewsInsightsPage />}
        />
        <Route
          path="/institutional-investors/news-insights/:section/:pageSlug.html"
          element={<InvestorNewsInsightsPage />}
        />
        <Route
          path="/institutional-investors/investments/:teamSlug/:strategySlug"
          element={<InvestorInvestmentPage />}
        />
        <Route
          path="/institutional-investors/investments/:teamSlug/:strategySlug.html"
          element={<InvestorInvestmentPage />}
        />
        <Route
          path="/institutional-investors/investments/:teamSlug"
          element={<InvestorInvestmentPage />}
        />
        <Route
          path="/institutional-investors/investments/:teamSlug.html"
          element={<InvestorInvestmentPage />}
        />
        <Route
          path="/institutional-investors/about-us/:pageSlug"
          element={<InvestorAboutUsPage />}
        />
        <Route
          path="/institutional-investors/about-us/:pageSlug.html"
          element={<InvestorAboutUsPage />}
        />
        <Route
          path="/institutional-investors"
          element={<InvestorSiteHomePage siteKey="institutional-investors" />}
        />
        <Route
          path="/institutional-investors.html"
          element={<InvestorSiteHomePage siteKey="institutional-investors" />}
        />
        <Route
          path="/investment-professionals"
          element={<InvestorSiteHomePage siteKey="investment-professionals" />}
        />
        <Route
          path="/investment-professionals.html"
          element={<InvestorSiteHomePage siteKey="investment-professionals" />}
        />
        <Route
          path="/investment-professionals/about-us/:pageSlug"
          element={<InvestorAboutUsPage />}
        />
        <Route
          path="/investment-professionals/about-us/:pageSlug.html"
          element={<InvestorAboutUsPage />}
        />
        <Route
          path="/investment-professionals/investments/:teamSlug/:fundSlug"
          element={<InvestorInvestmentPage />}
        />
        <Route
          path="/investment-professionals/investments/:teamSlug/:fundSlug.html"
          element={<InvestorInvestmentPage />}
        />
        <Route
          path="/investment-professionals/investments/:teamSlug"
          element={<InvestorInvestmentPage />}
        />
        <Route
          path="/investment-professionals/investments/:teamSlug.html"
          element={<InvestorInvestmentPage />}
        />
        <Route
          path="/investment-professionals/performance/:pageSlug"
          element={<InvestorProfessionalContentPage />}
        />
        <Route
          path="/investment-professionals/performance/:pageSlug.html"
          element={<InvestorProfessionalContentPage />}
        />
        <Route
          path="/investment-professionals/news-insights/artisan-canvas"
          element={<InvestorNewsInsightsPage />}
        />
        <Route
          path="/investment-professionals/news-insights/artisan-canvas.html"
          element={<InvestorNewsInsightsPage />}
        />
        <Route
          path="/investment-professionals/news-insights/advanced-document-filtering"
          element={<InvestorNewsInsightsPage />}
        />
        <Route
          path="/investment-professionals/news-insights/advanced-document-filtering.html"
          element={<InvestorNewsInsightsPage />}
        />
        <Route
          path="/investment-professionals/news-insights/:section/:pageSlug"
          element={<InvestorNewsInsightsPage />}
        />
        <Route
          path="/investment-professionals/news-insights/:section/:pageSlug.html"
          element={<InvestorNewsInsightsPage />}
        />
        <Route
          path="/investment-professionals/resources/*"
          element={<InvestorProfessionalContentPage />}
        />
        <Route
          path="/individual-investors"
          element={<InvestorSiteHomePage siteKey="individual-investors" />}
        />
        <Route
          path="/individual-investors.html"
          element={<InvestorSiteHomePage siteKey="individual-investors" />}
        />
        <Route
          path="/individual-investors/about-us/:pageSlug"
          element={<InvestorAboutUsPage />}
        />
        <Route
          path="/individual-investors/about-us/:pageSlug.html"
          element={<InvestorAboutUsPage />}
        />
        <Route
          path="/individual-investors/performance/:pageSlug"
          element={<InvestorProfessionalContentPage />}
        />
        <Route
          path="/individual-investors/performance/:pageSlug.html"
          element={<InvestorProfessionalContentPage />}
        />
        <Route
          path="/individual-investors/news-insights/artisan-canvas"
          element={<InvestorNewsInsightsPage />}
        />
        <Route
          path="/individual-investors/news-insights/artisan-canvas.html"
          element={<InvestorNewsInsightsPage />}
        />
        <Route
          path="/individual-investors/news-insights/advanced-document-filtering"
          element={<InvestorNewsInsightsPage />}
        />
        <Route
          path="/individual-investors/news-insights/advanced-document-filtering.html"
          element={<InvestorNewsInsightsPage />}
        />
        <Route
          path="/individual-investors/news-insights/:section/:pageSlug"
          element={<InvestorNewsInsightsPage />}
        />
        <Route
          path="/individual-investors/news-insights/:section/:pageSlug.html"
          element={<InvestorNewsInsightsPage />}
        />
        <Route path="/individual-investors/resources/*" element={<InvestorProfessionalContentPage />} />
        <Route
          path="/individual-investors/investments/:teamSlug/:fundSlug"
          element={<InvestorInvestmentPage />}
        />
        <Route
          path="/individual-investors/investments/:teamSlug/:fundSlug.html"
          element={<InvestorInvestmentPage />}
        />
        <Route path="/individual-investors/investments/:teamSlug" element={<InvestorInvestmentPage />} />
        <Route
          path="/individual-investors/investments/:teamSlug.html"
          element={<InvestorInvestmentPage />}
        />
        <Route path="/individual-investors/terms-conditions" element={<InvestorProfessionalContentPage />} />
        <Route path="/individual-investors/terms-conditions.html" element={<InvestorProfessionalContentPage />} />
        <Route path="/individual-investors/privacy-policy" element={<InvestorProfessionalContentPage />} />
        <Route path="/individual-investors/privacy-policy.html" element={<InvestorProfessionalContentPage />} />
        <Route
          path="/individual-investors/proxy-policies-and-voting-record"
          element={<InvestorProfessionalContentPage />}
        />
        <Route
          path="/individual-investors/proxy-policies-and-voting-record.html"
          element={<InvestorProfessionalContentPage />}
        />
        <Route path="/global/:countrySlug" element={<GlobalInvestorPage />} />
        <Route path="/global/:countrySlug.html" element={<GlobalInvestorPage />} />
        <Route path="/sustainability/home" element={<SustainabilityHomePage />} />
        <Route path="/sustainability/:slug" element={<SustainabilityContentPage />} />
      </Routes>
      </Suspense>

      {!isSustainability && !isInvestorSite && <Footer />}

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
