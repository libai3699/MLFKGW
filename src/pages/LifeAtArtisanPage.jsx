import { useEffect } from 'react';
import LifeAtArtisanContent from '../components/Careers/LifeAtArtisanContent';
import PortalPageLayout from '../components/Portal/PortalPageLayout';
import { lifeAtArtisanPage } from '../data/lifeAtArtisanData';
import './portal-pages.css';

export default function LifeAtArtisanPage() {
  useEffect(() => {
    document.title = lifeAtArtisanPage.pageTitle;
    return () => {
      document.title = 'Artisan Partners - Global Investment Management Firm';
    };
  }, []);

  return (
    <PortalPageLayout>
      <div className="main-wrapper life-at-artisan-page bg-careers-small">
        <LifeAtArtisanContent page={lifeAtArtisanPage} />
      </div>
    </PortalPageLayout>
  );
}
