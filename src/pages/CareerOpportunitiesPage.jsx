import { useEffect } from 'react';
import CareerOpportunitiesContent from '../components/Careers/CareerOpportunitiesContent';
import PortalPageLayout from '../components/Portal/PortalPageLayout';
import { careerOpportunitiesPage } from '../data/careerOpportunitiesData';
import './portal-pages.css';

export default function CareerOpportunitiesPage() {
  useEffect(() => {
    document.title = careerOpportunitiesPage.pageTitle;
    return () => {
      document.title = 'Artisan Partners - Global Investment Management Firm';
    };
  }, []);

  return (
    <PortalPageLayout>
      <div className="main-wrapper career-opportunities-page bg-careers-small">
        <CareerOpportunitiesContent page={careerOpportunitiesPage} />
      </div>
    </PortalPageLayout>
  );
}
