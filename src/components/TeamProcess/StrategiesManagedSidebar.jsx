import { motion } from 'framer-motion';

export default function StrategiesManagedSidebar({ strategies }) {
  return (
    <motion.div
      className="aag-container"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: 0.15 }}
    >
      <div className="side-content-ataglance">
        <h4>At A Glance</h4>
        <div>
          <div className="items-list">
            <ul className="side-bar-list">
              <li className="heading">Strategies Managed</li>
              {strategies.map((strategy) => (
                <li key={strategy}>{strategy}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
