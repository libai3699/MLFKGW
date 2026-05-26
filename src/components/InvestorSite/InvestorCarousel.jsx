import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { investorCarouselSlides } from '../../data/investorSitesData';

export default function InvestorCarousel({ slides = investorCarouselSlides }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 8000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <div id="carousel-wrapper" className="carousel slide investor-carousel">
      <div className="carousel-inner investor-carousel-inner">
        {slides.map((slide, index) => (
          <div
            key={slide.title}
            className={`item investor-carousel-item ${index === activeIndex ? 'active' : ''}`}
            style={{
              backgroundColor: slide.bgColor,
              backgroundImage: `url(${slide.image})`,
            }}
          >
            <div className="container investor-container">
              <div className="content investor-carousel-copy">
                {slide.subhead && (
                  <p>
                    <span className="carousel-subhead">{slide.subhead}</span>
                  </p>
                )}
                <h1 className="carousel-h1-large">{slide.title}</h1>
                {slide.subheadLines?.length > 0 && (
                  <p>
                    {slide.subheadLines.map((line) => (
                      <span
                        key={line.text}
                        className="carousel-subhead"
                        style={line.color ? { color: line.color } : undefined}
                      >
                        {line.text}
                      </span>
                    ))}
                  </p>
                )}
                {slide.cta && (
                  <span className="carousel-text">
                    <Link className="btn btn-default" to={slide.cta.href}>
                      {slide.cta.label}
                    </Link>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <ol className="carousel-indicators investor-carousel-indicators">
          {slides.map((slide, index) => (
            <li key={slide.title}>
              <button
                type="button"
                className={index === activeIndex ? 'active' : ''}
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => setActiveIndex(index)}
              />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
