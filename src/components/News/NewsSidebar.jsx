import { motion } from 'framer-motion';

export default function NewsSidebar({ sidebar }) {
  return (
    <>
      <motion.div
        className="aag-container"
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
      >
        <div className="side-content-ataglance">
          <h4>{sidebar.pressInquiries.heading}</h4>
          <div>
            <span className="h5">{sidebar.pressInquiries.name}</span>
            <br />
            {sidebar.pressInquiries.phone}
          </div>
        </div>
      </motion.div>

      <motion.div
        className="aag-container"
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, delay: 0.18 }}
      >
        <div className="side-content-ataglance border-top">
          <h4>{sidebar.artisanCanvas.heading}</h4>
          <div>
            <p>
              {sidebar.artisanCanvas.description}
              <br />
              <a href={sidebar.artisanCanvas.href} target="_blank" rel="noopener noreferrer">
                {sidebar.artisanCanvas.cta}
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
}
