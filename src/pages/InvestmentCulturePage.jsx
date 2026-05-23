import InvestmentCultureContent from '../components/InvestmentCulture/InvestmentCultureContent';
import AutonomousTeamsSidebar from '../components/Portal/AutonomousTeamsSidebar';
import PortalPageLayout from '../components/Portal/PortalPageLayout';
import { investmentCulturePage } from '../data/investmentCultureData';
import './portal-pages.css';

export default function InvestmentCulturePage() {
  return (
    <PortalPageLayout>
      <div className="main-wrapper right-page-grid">
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
    </PortalPageLayout>
  );
}
