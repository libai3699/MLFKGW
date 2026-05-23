import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { navItems } from '../../data/siteData';

export default function Navigation({ isHome }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1200px)');

    const updateViewport = () => {
      setIsDesktop(media.matches);
      if (media.matches) {
        setMenuOpen(false);
      }
    };

    updateViewport();
    media.addEventListener('change', updateViewport);

    return () => media.removeEventListener('change', updateViewport);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    setOpenDropdown(null);
    setMenuOpen(false);
  }, [location.pathname]);

  const toggleDropdown = (slug, event) => {
    event.stopPropagation();
    setOpenDropdown((current) => (current === slug ? null : slug));
  };

  const isActive = (item) => {
    if (item.slug === 'about-us') {
      return location.pathname.startsWith('/about-us') || location.pathname.startsWith('/sustainability');
    }
    if (item.href && !item.external) {
      return location.pathname === item.href;
    }
    return false;
  };

  const renderLink = (href, label, external = false) => {
    if (external) {
      return (
        <a className="nav-link" href={href} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      );
    }

    return (
      <Link className="nav-link" to={href}>
        {label}
      </Link>
    );
  };

  return (
    <div
      className={`navbar navbar-expand-xl ${isHome ? 'navbar-home' : 'navbar-inner'}`}
      ref={navRef}
    >
      <Link className="navbar-brand" to="/">
        <img
          className="img-fluid logo"
          alt="Artisan Partners logo"
          src="/images/aplp-logo.png"
        />
      </Link>
      <button
        className={`navbar-toggler ${menuOpen ? '' : 'collapsed'}`}
        type="button"
        aria-expanded={menuOpen}
        aria-label="Toggle navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className={`navbar-collapse ${menuOpen || isDesktop ? 'show' : ''}`} id="main-nav">
        <ul className="navbar-nav ms-auto align-items-xl-center">
          {navItems.map((item) => (
            <li
              key={item.slug}
              data-title={item.slug}
              className={`nav-item ${item.children ? 'dropdown' : ''} ${
                openDropdown === item.slug ? 'dropdown-open' : ''
              } ${isActive(item) ? 'active' : ''}`}
            >
              {item.children ? (
                <>
                  <button
                    type="button"
                    className="nav-link dropdown-toggle"
                    aria-expanded={openDropdown === item.slug}
                    onClick={(event) => toggleDropdown(item.slug, event)}
                  >
                    {item.title}
                  </button>
                  <AnimatePresence>
                    {openDropdown === item.slug && (
                      <motion.ul
                        className={`dropdown-menu shadow show ${
                          item.menuAlign === 'right' ? 'dropdown-menu-end' : ''
                        }`}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.children.map((child) => (
                          <li key={child.label}>
                            {child.href.startsWith('http') ? (
                              <a className="dropdown-item" href={child.href}>
                                {child.label}
                              </a>
                            ) : (
                              <Link className="dropdown-item" to={child.href}>
                                {child.label}
                              </Link>
                            )}
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                renderLink(item.href, item.title, item.external)
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
