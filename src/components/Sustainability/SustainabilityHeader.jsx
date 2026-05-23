import { Link } from 'react-router-dom';
import { useState } from 'react';
import { sustainabilityReportMeta } from '../../data/sustainabilityHomeData';
import SustainabilityOffcanvas from './SustainabilityOffcanvas';

export default function SustainabilityHeader({ activeNavId = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sustainability-header sticky-top" role="banner">
        <div className="branding-wrapper">
          <div className="sustainability-container sustainability-header-inner">
            <Link to="/sustainability/home" className="sustainability-logo-link">
              <img
                id="logo"
                src="/images/sustainability/logo-702x86.png"
                alt="Artisan Partners logo"
              />
            </Link>
            <div className="sustainability-header-right">
              <span className="report-title">{sustainabilityReportMeta.reportLabel}</span>
              <button
                type="button"
                className={`navbar-toggler ${menuOpen ? '' : 'collapsed'}`}
                aria-expanded={menuOpen}
                aria-controls="offcanvas-navigation"
                aria-label="Toggle navigation"
                onClick={() => setMenuOpen(true)}
              >
                <span className="navbar-toggler-icon" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <SustainabilityOffcanvas
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        activeNavId={activeNavId}
      />
    </>
  );
}
