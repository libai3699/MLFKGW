import { motion } from 'framer-motion';
import { channels } from '../../data/siteData';

export default function Channels({ onSelectChannel }) {
  return (
    <ul id="channels" className="list-group">
      {channels.map((channel, index) => (
        <motion.li
          key={channel.id}
          className="list-group-item channel"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.15 + index * 0.12 }}
          whileHover={{ backgroundColor: '#66666a' }}
        >
          <a
            href="#"
            data-value={channel.id}
            onClick={(event) => {
              event.preventDefault();
              onSelectChannel(channel.id);
            }}
          >
            {channel.label}
          </a>
        </motion.li>
      ))}
    </ul>
  );
}
