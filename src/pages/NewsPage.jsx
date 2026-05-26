import { useEffect } from 'react';
import { motion } from 'framer-motion';
import NewsList from '../components/News/NewsList';
import NewsSidebar from '../components/News/NewsSidebar';
import PortalPageLayout from '../components/Portal/PortalPageLayout';
import { newsPage } from '../data/newsData';
import './portal-pages.css';

export default function NewsPage() {
  useEffect(() => {
    document.title = newsPage.title;
    return () => {
      document.title = 'Artisan Partners - Global Investment Management Firm';
    };
  }, []);

  return (
    <PortalPageLayout>
      <div className="main-wrapper right-page-grid news-page">
        <div className="right-page-main-col">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {newsPage.title}
          </motion.h1>
          <NewsList years={newsPage.years} />
        </div>
        <div className="right-page-sidebar-col">
          <NewsSidebar sidebar={newsPage.sidebar} />
        </div>
      </div>
    </PortalPageLayout>
  );
}
