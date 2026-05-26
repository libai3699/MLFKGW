import { useEffect } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import OverviewContent from '../components/Overview/OverviewContent';
import OverviewTimeline from '../components/Overview/OverviewTimeline';
import AtAGlance from '../components/Overview/AtAGlance';
import InvestmentCultureContent from '../components/InvestmentCulture/InvestmentCultureContent';
import BusinessModelContent from '../components/BusinessModel/BusinessModelContent';
import InvestmentStrategiesContent from '../components/InvestmentStrategies/InvestmentStrategiesContent';
import ContentSection from '../components/Portal/ContentSection';
import AutonomousTeamsSidebar from '../components/Portal/AutonomousTeamsSidebar';
import InvestorSiteLayout from '../components/InvestorSite/InvestorSiteLayout';
import { InvestorAboutLinkProvider } from '../context/InvestorAboutLinkContext';
import { investmentCulturePage } from '../data/investmentCultureData';
import { getInstitutionalAboutPage } from '../data/investorNavData';
import { getInvestorSite } from '../data/investorSitesData';
import { getInvestorSiteKeyFromPathname } from '../utils/investorSiteRouting';
import { whoWeArePage } from '../data/whoWeAreData';
import './investor-site.css';
import './portal-pages.css';

function OverviewPageContent() {
  return (
    <div className="main-wrapper right-page-grid investor-about-page-grid">
      <div className="right-page-main-col overview-content-col">
        <OverviewContent />
        <OverviewTimeline />
      </div>
      <div className="right-page-sidebar-col overview-sidebar-col">
        <AtAGlance />
      </div>
    </div>
  );
}

function WhoWeArePageContent() {
  const total = whoWeArePage.sections.length;

  return (
    <div className="main-wrapper who-we-are-page investor-about-page-grid">
      {whoWeArePage.sections.map((section, index) => (
        <ContentSection key={section.id} section={{ ...section, total }} index={index} />
      ))}
    </div>
  );
}

function InvestmentCulturePageContent() {
  return (
    <div className="main-wrapper right-page-grid investor-about-page-grid">
      <div className="right-page-main-col">
        <InvestmentCultureContent />
      </div>
      <div className="right-page-sidebar-col">
        <AutonomousTeamsSidebar
          heading={investmentCulturePage.teamsHeading}
          teams={investmentCulturePage.teams}
        />
      </div>
    </div>
  );
}

function BusinessModelPageContent() {
  return (
    <div className="main-wrapper business-model-wrapper investor-about-page-grid">
      <BusinessModelContent />
    </div>
  );
}

function InvestmentStrategiesPageContent() {
  return (
    <div className="main-wrapper investment-strategies-wrapper investor-about-page-grid">
      <InvestmentStrategiesContent />
    </div>
  );
}

const pageContentBySlug = {
  overview: OverviewPageContent,
  'who-we-are': WhoWeArePageContent,
  'investment-culture': InvestmentCulturePageContent,
  'business-model': BusinessModelPageContent,
  'investment-strategies': InvestmentStrategiesPageContent,
};

export default function InvestorAboutUsPage() {
  const { pageSlug } = useParams();
  const location = useLocation();
  const siteKey = getInvestorSiteKeyFromPathname(location.pathname) || 'institutional-investors';
  const site = getInvestorSite(siteKey);
  const page = getInstitutionalAboutPage(pageSlug);
  const aboutBasePath = site?.aboutBasePath || `/${siteKey}/about-us`;

  useEffect(() => {
    if (!page || page.external) {
      return undefined;
    }

    document.title = page.pageTitle;
    return () => {
      document.title = 'Artisan Partners - Global Investment Management Firm';
    };
  }, [page]);

  if (!site) {
    return <Navigate to="/" replace />;
  }

  if (!page || page.external) {
    return <Navigate to={site.homeHref} replace />;
  }

  const PageContent = pageContentBySlug[page.slug];

  if (!PageContent) {
    return <Navigate to={site.homeHref} replace />;
  }

  return (
    <InvestorSiteLayout site={site} pageHeading={page.heading}>
      <InvestorAboutLinkProvider basePath={aboutBasePath}>
        <div id="page-wrapper">
          <div id="page-title" className="investor-page-title">
            <div className="container investor-container">
              <h1>{page.heading}</h1>
            </div>
          </div>
          <div className="section investor-about-section">
            <div className="container investor-container">
              <PageContent />
            </div>
          </div>
        </div>
      </InvestorAboutLinkProvider>
    </InvestorSiteLayout>
  );
}
