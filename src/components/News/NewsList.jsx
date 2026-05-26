import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function NewsItem({ item }) {
  return (
    <li className="news-item row">
      <span className="news-date col-lg-3">{item.date}</span>
      <span className="news-title col-lg-9">
        <span className="icon-document" aria-hidden="true" />
        <a href={item.href} target="_blank" rel="noopener noreferrer" title={`PDF: ${item.title}`}>
          {item.title}
        </a>
      </span>
    </li>
  );
}

function NewsYearSection({ yearGroup }) {
  const [open, setOpen] = useState(yearGroup.defaultOpen);

  return (
    <div className="accordion-item">
      <h2 className="accordion-header">
        <button
          type="button"
          className={`accordion-button ${open ? '' : 'collapsed'}`}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {yearGroup.year}
        </button>
      </h2>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`flush-${yearGroup.year}`}
            className="accordion-collapse show"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="accordion-body">
              <ul>
                {yearGroup.items.map((item) => (
                  <NewsItem key={`${yearGroup.year}-${item.date}-${item.title}`} item={item} />
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function NewsList({ years }) {
  return (
    <div className="news-list">
      <div className="accordion accordion-flush" id="news-list">
        {years.map((yearGroup) => (
          <NewsYearSection key={yearGroup.year} yearGroup={yearGroup} />
        ))}
      </div>
    </div>
  );
}
