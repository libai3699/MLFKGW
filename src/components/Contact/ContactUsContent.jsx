export default function ContactUsContent({ page }) {
  return (
    <div className="contact-us-content">
      <h1>{page.title}</h1>
      <div className="contact-regions-grid">
        {page.regions.map((region) => (
          <div className="contact-region" key={region.id}>
            <ul>
              <li>
                <span className="h2">{region.heading}</span>
              </li>
              {region.lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
