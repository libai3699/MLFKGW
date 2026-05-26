export default function CareersHeroSection({ title, intro, headerImage }) {
  return (
    <section className="careers-hero-section hero-section">
      <div className="careers-hero-grid">
        <div className="careers-hero-copy">
          <h1>{title}</h1>
          {intro.split('\n\n').map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
        {headerImage && (
          <div className="careers-hero-image">
            <img
              className="img-fluid careers-header-graphic"
              src={headerImage.src}
              alt={headerImage.alt}
            />
          </div>
        )}
      </div>
    </section>
  );
}
