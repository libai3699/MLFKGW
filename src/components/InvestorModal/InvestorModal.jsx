import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { investorSections } from '../../data/siteData';

function CountryDropdown({ countries, selectedCountry, onSelect }) {
  const [open, setOpen] = useState(false);
  const current = selectedCountry || countries[0];

  return (
    <div className="country-selector">
      <ul
        className={`dropdown selected ${open ? 'active' : ''}`}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setOpen((value) => !value);
          }
        }}
        role="button"
        tabIndex={0}
      >
        <li>
          {!current.noFlag && (
            <img src={`/images/flags/${current.code}.svg`} alt={current.name} />
          )}
          <a href={current.href}>{current.name}</a>
        </li>
      </ul>
      <AnimatePresence>
        {open && (
          <motion.ul
            className="dropdown-list active"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 150 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            {countries.map((country) => (
              <li key={country.name}>
                {!country.noFlag && (
                  <img src={`/images/flags/${country.code}.svg`} alt={country.name} />
                )}
                <a
                  href={country.href}
                  onClick={(event) => {
                    event.preventDefault();
                    onSelect(country);
                    setOpen(false);
                  }}
                >
                  {country.name}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function AccordionItem({ section, isOpen, onToggle }) {
  const [selectedCountry, setSelectedCountry] = useState(section.countries[0]);

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
            <div className="accordion-body">
              <p>{section.description}</p>
              <p>
                <strong>Select your country</strong>
              </p>
              <CountryDropdown
                countries={section.countries}
                selectedCountry={selectedCountry}
                onSelect={setSelectedCountry}
              />
              <motion.a
                className="btn btn-primary"
                href={selectedCountry.href}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue
              </motion.a>
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
