import OverviewContent from '../components/Overview/OverviewContent';
import OverviewTimeline from '../components/Overview/OverviewTimeline';
import AtAGlance from '../components/Overview/AtAGlance';
import PortalPageLayout from '../components/Portal/PortalPageLayout';
import './portal-pages.css';

export default function OverviewPage() {
  return (
    <PortalPageLayout>
      <div className="main-wrapper right-page-grid">
        <div className="right-page-main-col overview-content-col">
          <OverviewContent />
          <OverviewTimeline />
        </div>
        <div className="right-page-sidebar-col overview-sidebar-col">
          <AtAGlance />
        </div>
      </div>
    </PortalPageLayout>
  );
}
