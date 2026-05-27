import { Link } from 'react-router-dom';
import { professionalResourcesNav } from '../../data/investorProfessionalNavData';

export default function InvestorProfessionalResourcesSubnav({ onNavigate, nav: navConfig }) {
  const { items, taxCenter } = navConfig || professionalResourcesNav;

  return (
    <div className="investor-resources-subnav investor-resources-subnav-professional">
      <div className="investor-resources-subnav-col">
        <ul>
          {items.map((item) => (
            <li key={item.slug}>
              {item.external ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" onClick={onNavigate}>
                  {item.label}
                  <span className="investor-external-icon" aria-hidden="true">
                    ↗
                  </span>
                </a>
              ) : (
                <Link to={item.href} onClick={onNavigate}>
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="investor-resources-subnav-col">
        <ul>
          <li>
            <span className="heading">{taxCenter.heading}</span>
            <ul>
              {taxCenter.items.map((item) => (
                <li key={item.slug}>
                  <Link to={item.href} onClick={onNavigate}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
