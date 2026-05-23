import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import PortalPageLayout from '../components/Portal/PortalPageLayout';
import StrategiesManagedSidebar from '../components/TeamProcess/StrategiesManagedSidebar';
import TeamProcessVideo from '../components/TeamProcess/TeamProcessVideo';
import { teamProcessPages } from '../data/teamProcessData';
import './portal-pages.css';

export default function TeamProcessPage() {
  const { teamSlug } = useParams();
  const page = teamProcessPages[teamSlug];

  useEffect(() => {
    if (page) {
      document.title = page.title;
    }

    return () => {
      document.title = 'Artisan Partners - Global Investment Management Firm';
    };
  }, [page]);

  if (!page) {
    return <Navigate to="/about-us/investment-strategies" replace />;
  }

  return (
    <PortalPageLayout>
      <div className="main-wrapper right-page-grid team-process-page">
        <div className="right-page-main-col">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {page.title}
          </motion.h1>
          <TeamProcessVideo
            key={teamSlug}
            teamSlug={teamSlug}
            playlistId={page.playlistId}
            videos={page.videos}
          />
        </div>
        <div className="right-page-sidebar-col">
          <StrategiesManagedSidebar strategies={page.strategies} />
        </div>
      </div>
    </PortalPageLayout>
  );
}
