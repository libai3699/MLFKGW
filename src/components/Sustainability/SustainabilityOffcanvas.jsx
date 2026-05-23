import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  sustainabilityMainNav,
  sustainabilityNavImages,
} from '../../data/sustainabilityNavigationData';

function NavLink({ href, label, onNavigate }) {
  const hashIndex = href.indexOf('#');
  const pathname = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : '';

  return (
    <Link to={{ pathname, hash }} onClick={onNavigate}>
      {label}
    </Link>
  );
}

export default function SustainabilityOffcanvas({ isOpen, onClose, activeNavId = 0 }) {
  const [previewNavId, setPreviewNavId] = useState(activeNavId);
  const [openAccordionId, setOpenAccordionId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setPreviewNavId(activeNavId || 0);
      if (activeNavId) {
        setOpenAccordionId(activeNavId);
      } else {
        setOpenAccordionId(null);
      }
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }

    document.body.style.overflow = '';
    return undefined;
  }, [isOpen, activeNavId]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const resetPreview = () => {
    setPreviewNavId(activeNavId || 0);
  };

  const handleNavigate = () => {
    onClose();
  };

  const toggleAccordion = (navId) => {
    setOpenAccordionId((current) => (current === navId ? null : navId));
  };

  return (
    <>
      <div
        id="offcanvas-navigation"
        className={`sustainability-offcanvas ${isOpen ? 'open show' : ''}`}
        aria-hidden={!isOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Sustainability report navigation"
      >
        <div className="offcanvas-header">
          <button
            type="button"
            className="btn-close btn-close-white"
            aria-label="Close"
            onClick={onClose}
          />
        </div>

        <div className="offcanvas-body">
          <div id="nav-images" className="nav-images-panel">
            {sustainabilityNavImages.map((item) => (
              <span
                key={item.navId}
                data-nav-id={item.navId}
                className={previewNavId === item.navId ? 'active' : ''}
                style={{ backgroundImage: `url(${item.image})` }}
              />
            ))}
          </div>

          <nav id="main-nav" onMouseLeave={resetPreview}>
            <ul id="main-nav-accordion" className="main-nav-accordion">
              {sustainabilityMainNav.map((item) => {
                if (item.type === 'link') {
                  return (
                    <li
                      key={item.navId}
                      data-nav-id={item.navId}
                      onMouseEnter={() => setPreviewNavId(item.navId)}
                    >
                      <NavLink href={item.href} label={item.label} onNavigate={handleNavigate} />
                    </li>
                  );
                }

                const isOpenSection = openAccordionId === item.navId;

                return (
                  <li
                    key={item.navId}
                    className="accordion-item"
                    data-nav-id={item.navId}
                    onMouseEnter={() => setPreviewNavId(item.navId)}
                  >
                    <div className="accordion-header">
                      <button
                        type="button"
                        className={`accordion-button ${isOpenSection ? '' : 'collapsed'}`}
                        aria-expanded={isOpenSection}
                        onClick={() => toggleAccordion(item.navId)}
                      >
                        {item.label}
                      </button>
                    </div>
                    {isOpenSection && (
                      <div className="accordion-collapse show">
                        <div className="accordion-body">
                          <ul>
                            {item.items.map((subItem) => (
                              <li key={subItem.href}>
                                <NavLink
                                  href={subItem.href}
                                  label={subItem.label}
                                  onNavigate={handleNavigate}
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {isOpen && (
        <button
          type="button"
          className="sustainability-offcanvas-backdrop"
          aria-label="Close menu"
          onClick={onClose}
        />
      )}
    </>
  );
}
