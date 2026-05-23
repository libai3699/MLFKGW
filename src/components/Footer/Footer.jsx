import { motion } from 'framer-motion';
import { footerContent } from '../../data/siteData';

export default function Footer({ onOpenModal }) {
  return (
    <footer className="footer-section">
      <div id="footer" className="container-md">
        <div className="row">
          <div className="col-xs-12">
            <motion.div
              className="content"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
            >
              {footerContent.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
              <p>
                {footerContent.links.map((link, index) => (
                  <span key={link.label}>
                    {index > 0 && <span> | </span>}
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                    >
                      {link.label}
                    </a>
                  </span>
                ))}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      <button type="button" className="sr-only-trigger" onClick={onOpenModal}>
        Open investor modal
      </button>
    </footer>
  );
}
