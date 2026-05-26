import { Link } from 'react-router-dom';
import { sustainabilityFooter } from '../../data/sustainabilityHomeData';
import { footerLinks } from '../../data/legalPagesData';

export default function SustainabilityFooter() {
  return (
    <footer className="sustainability-footer">
      <div className="sustainability-container">
        <ul>
          {footerLinks.map((link) => (
            <li key={link.label}>
              {link.external ? (
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              ) : (
                <Link to={link.href}>{link.label}</Link>
              )}
            </li>
          ))}
        </ul>
        {sustainabilityFooter.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
        <p>&copy; {new Date().getFullYear()} Artisan Partners. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
