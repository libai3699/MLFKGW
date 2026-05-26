import { useEffect } from 'react';
import BenefitsContent from '../components/Careers/BenefitsContent';
import PortalPageLayout from '../components/Portal/PortalPageLayout';
import { benefitsPage } from '../data/benefitsData';
import './portal-pages.css';

export default function BenefitsPage() {
  useEffect(() => {
    document.title = benefitsPage.pageTitle;
    return () => {
      document.title = 'Artisan Partners - Global Investment Management Firm';
    };
  }, []);

  return (
    <PortalPageLayout>
      <div className="main-wrapper benefits-page bg-careers-small">
        <BenefitsContent page={benefitsPage} />
      </div>
    </PortalPageLayout>
  );
}
