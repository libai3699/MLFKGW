import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { investorSections } from '../../data/siteData';

function CountryFlag({ country }) {
  if (country.noFlag) {
    return null;
  }

  return (
    <img
      src={`https://flagcdn.com/${country.code}.svg`}
      alt=""
      width={20}
      height={15}
    />
  );
}

function CountryOption({ country }) {
  return (
    <span className="country-option-content">
      <CountryFlag country={country} />
      <span className="country-name">{country.name}</span>
    </span>
  );
}

function CountryDropdown({ countries, selectedCountry, onSelect, disabled = false }) {
  const [open, setOpen] = useState(false);
  const current = selectedCountry || countries[0];
  const canToggle = countries.length > 1 && !disabled;
  const listCountries = countries.filter((country) => country.code !== current.code);

  useEffect(() => {
    if (disabled) {
      setOpen(false);
    }
  }, [disabled]);

  const handleToggle = (event) => {
    event.preventDefault();
    if (canToggle) {
      setOpen((value) => !value);
    }
  };

  return (
    <div className="country-selector">
      <button
        type="button"
        className={`dropdown selected ${open ? 'active' : ''} ${canToggle ? '' : 'single-country'}`}
        onClick={handleToggle}
        disabled={!canToggle}
        aria-expanded={canToggle ? open : undefined}
        aria-haspopup={canToggle ? 'listbox' : undefined}
      >
        <CountryOption country={current} />
      </button>
      <AnimatePresence>
        {open && canToggle && (
          <motion.ul
            className="dropdown-list active"
            role="listbox"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {listCountries.map((country) => (
              <li key={country.code}>
                <button
                  type="button"
                  className="country-option-button"
                  onClick={(event) => {
                    event.preventDefault();
                    onSelect(country);
                    setOpen(false);
                  }}
                >
                  <CountryOption country={country} />
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function AccordionItem({ section, isOpen, onToggle, onClose }) {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState(section.countries[0]);
  const [isContinuing, setIsContinuing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsContinuing(false);
    }
  }, [isOpen]);

  const handleContinue = (event) => {
    event.preventDefault();
    if (isContinuing) {
      return;
    }

    setIsContinuing(true);
    window.setTimeout(() => {
      onClose();
      navigate(selectedCountry.href);
    }, 750);
  };

  return (
    <div className="accordion-item">
      <div className="accordion-header">
        <motion.button
          type="button"
          className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
          onClick={() => onToggle(section.id)}
          whileTap={{ scale: 0.995 }}
        >
          <h2>{section.title}</h2>
        </motion.button>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={section.id}
            className="accordion-collapse"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className={`accordion-body ${isContinuing ? 'is-continuing' : ''}`}>
              <p>{section.description}</p>
              <p>
                <strong>Select your country</strong>
              </p>
              <CountryDropdown
                countries={section.countries}
                selectedCountry={selectedCountry}
                onSelect={setSelectedCountry}
                disabled={isContinuing}
              />
              <motion.button
                type="button"
                className={`btn btn-primary ${isContinuing ? 'is-loading' : ''}`}
                onClick={handleContinue}
                disabled={isContinuing}
                aria-busy={isContinuing}
                whileHover={isContinuing ? undefined : { scale: 1.02 }}
                whileTap={isContinuing ? undefined : { scale: 0.98 }}
              >
                {isContinuing ? (
                  <span className="investor-continue-state">
                    <span className="investor-continue-spinner" aria-hidden="true" />
                    <span>Continuing...</span>
                  </span>
                ) : (
                  'Continue'
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function InvestorModal({ isOpen, onClose, activeSection }) {
  const [openSection, setOpenSection] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setOpenSection(activeSection || null);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, activeSection]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', onKeyDown);
    }

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const handleToggle = (sectionId) => {
    setOpenSection((current) => (current === sectionId ? null : sectionId));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="investor-selection-modal"
          className="modal fade show"
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="modal-backdrop"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <div className="modal-dialog modal-dialog-centered">
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="modal-header">
                <span className="modal-title">Select Investor Type</span>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={onClose}
                />
              </div>
              <div className="modal-body">
                <div id="investor-selection-accordion" className="accordion accordion-flush">
                  {investorSections.map((section) => (
                    <AccordionItem
                      key={section.id}
                      section={section}
                      isOpen={openSection === section.id}
                      onToggle={handleToggle}
                      onClose={onClose}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
