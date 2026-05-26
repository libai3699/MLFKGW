import { Link } from 'react-router-dom';
import { institutionalNewsInsightsNav } from '../../data/investorNewsInsightsData';

export default function InvestorNewsInsightsSubnav({ onNavigate }) {
  const { news, thoughtLeadership, promo } = institutionalNewsInsightsNav;

  return (
    <div className="investor-news-insights-subnav">
      <div className="investor-news-insights-subnav-col">
        <ul>
          <li>
            <span className="heading">{news.heading}</span>
            <ul>
              {news.items.map((item) => (
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

      <div className="investor-news-insights-subnav-col">
        <ul>
          <li>
            <span className="heading">{thoughtLeadership.heading}</span>
            <ul>
              {thoughtLeadership.items.map((item) =>
                item.external ? (
                  <li key={item.slug}>
                    <a href={item.href} target="_blank" rel="noopener noreferrer" onClick={onNavigate}>
                      {item.label}
                      <span className="investor-external-icon" aria-hidden="true">
                        ↗
                      </span>
                    </a>
                  </li>
                ) : (
                  <li key={item.slug}>
                    <Link to={item.href} onClick={onNavigate}>
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </li>
        </ul>
      </div>

      <div className="investor-news-insights-subnav-col investor-news-insights-promo">
        <ul className="promo">
          <li className="heading">{promo.heading}</li>
          <li className="content">{promo.description}</li>
          <li className="cta">
            <a href={promo.href} target="_blank" rel="noopener noreferrer" onClick={onNavigate}>
              {promo.ctaLabel}
              <span className="investor-external-icon" aria-hidden="true">
                ↗
              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
