import { Link } from 'react-router-dom';
import { sustainabilityNavCards } from '../../data/sustainabilityHomeData';

export default function SustainabilityNavCards() {
  return (
    <section id="homepage-nav">
      <div className="sustainability-container">
        <nav className="homepage-nav-grid">
          {sustainabilityNavCards.map((card, index) => (
            <div className="homepage-nav-col" key={card.id}>
              <Link to={card.href} className="homepage-nav-link">
                <div
                  className="card h-100"
                  style={
                    card.backgroundImage
                      ? { backgroundImage: `url(${card.backgroundImage})` }
                      : undefined
                  }
                >
                  <div className={`card-body ${card.gradientClass}`}>
                    {card.label.split('\n').map((line, lineIndex, lines) => (
                      <span key={line}>
                        {line}
                        {lineIndex < lines.length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </nav>
      </div>
    </section>
  );
}
