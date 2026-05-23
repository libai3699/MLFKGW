import { motion } from 'framer-motion';

export default function TopBar({ onOpenModal }) {
  return (
    <div className="top-wrapper">
      <div className="container-md">
        <motion.a
          id="investor-type-selection"
          href="#"
          onClick={(event) => {
            event.preventDefault();
            onOpenModal();
          }}
          whileHover={{ opacity: 0.85 }}
          transition={{ duration: 0.2 }}
        >
          Select Investor Type
        </motion.a>
      </div>
    </div>
  );
}
