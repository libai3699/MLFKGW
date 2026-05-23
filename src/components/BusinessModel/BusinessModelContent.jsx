import { motion } from 'framer-motion';
import { businessModelPage } from '../../data/businessModelData';

export default function BusinessModelContent() {
  return (
    <div className="business-model-page">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {businessModelPage.title}
      </motion.h1>

      <motion.p
        className="business-model-intro"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.06 }}
      >
        {businessModelPage.intro}
      </motion.p>

      <motion.div
        className="business-model-diagram-wrap d-none d-md-block"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
      >
        <img
          className="business-model-diagram img-fluid"
          src={businessModelPage.diagram.src}
          alt={businessModelPage.diagram.alt}
        />
      </motion.div>

      <div className="business-model-columns">
        {businessModelPage.columns.map((column, index) => (
          <motion.div
            key={column.id}
            className={`business-model-col col-custom-${column.side}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <h2>{column.heading}</h2>
            <p>{column.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
