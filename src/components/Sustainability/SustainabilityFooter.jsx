import { sustainabilityFooter } from '../../data/sustainabilityHomeData';

export default function SustainabilityFooter() {
  return (
    <footer className="sustainability-footer">
      <div className="sustainability-container">
        <ul>
          {sustainabilityFooter.links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
              >
                {link.label}
              </a>
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
