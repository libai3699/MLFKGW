export default function KeyBusinessAreasContent({ page }) {
  return (
    <div className="key-business-areas-content">
      <section className="careers-hero-section hero-section">
        <div className="careers-hero-grid">
          <div className="careers-hero-copy">
            <h1>{page.title}</h1>
            <p>{page.intro}</p>
          </div>
          <div className="careers-hero-image">
            <img
              className="img-fluid careers-header-graphic"
              src={page.headerImage.src}
              alt={page.headerImage.alt}
            />
          </div>
        </div>
      </section>

      <div className="key-business-areas-sections">
        {page.areas.map((area) => (
          <section key={area.id} className="key-business-area">
            <h2>{area.heading}</h2>
            <p>{area.body}</p>
          </section>
        ))}
      </div>

      <div className="key-business-areas-diagram d-none d-md-block">
        <img
          className="img-fluid business-model-graphic"
          src={page.diagram.src}
          alt={page.diagram.alt}
        />
      </div>
    </div>
  );
}
