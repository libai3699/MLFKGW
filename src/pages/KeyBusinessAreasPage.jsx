import { useEffect } from 'react';
import KeyBusinessAreasContent from '../components/Careers/KeyBusinessAreasContent';
import PortalPageLayout from '../components/Portal/PortalPageLayout';
import { keyBusinessAreasPage } from '../data/keyBusinessAreasData';
import './portal-pages.css';

export default function KeyBusinessAreasPage() {
  useEffect(() => {
    document.title = keyBusinessAreasPage.pageTitle;
    return () => {
      document.title = 'Artisan Partners - Global Investment Management Firm';
    };
  }, []);

  return (
    <PortalPageLayout>
      <div className="main-wrapper key-business-areas-page bg-careers-small">
        <KeyBusinessAreasContent page={keyBusinessAreasPage} />
      </div>
    </PortalPageLayout>
  );
}
