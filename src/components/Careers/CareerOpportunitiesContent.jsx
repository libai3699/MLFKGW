import { useEffect } from 'react';
import CareersHeroSection from './CareersHeroSection';

function GreenhouseJobBoard() {
  useEffect(() => {
    const container = document.getElementById('grnhse_app');
    if (!container || container.dataset.initialized === 'true') {
      return undefined;
    }

    container.dataset.initialized = 'true';

    if (!document.querySelector('script[src*="boards.greenhouse.io"]')) {
      const script = document.createElement('script');
      script.src = 'https://boards.greenhouse.io/embed/job_board/js?for=artisanpartners';
      script.async = true;
      document.body.appendChild(script);
    }

    return undefined;
  }, []);

  return <div id="grnhse_app" className="job-openings" />;
}

export default function CareerOpportunitiesContent({ page }) {
  return (
    <div className="career-opportunities-content">
      <CareersHeroSection
        title={page.title}
        intro={page.intro}
        headerImage={page.headerImage}
      />

      <div className="career-opportunities-copy">
        {page.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
      </div>

      <GreenhouseJobBoard />
    </div>
  );
}
