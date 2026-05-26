import { Link } from 'react-router-dom';
import CareersHeroSection from './CareersHeroSection';

function LifeHeading({ heading, theme, backgroundImage }) {
  return (
    <div className="life-heading">
      <div className={`row ${theme}`}>
        <div className="cell">
          <h2 className="white">{heading}</h2>
        </div>
        <div
          className="cell life-heading-image d-none d-md-table-cell"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export default function LifeAtArtisanContent({ page }) {
  return (
    <div className="life-at-artisan-content">
      <CareersHeroSection
        title={page.title}
        intro={page.intro}
        headerImage={page.headerImage}
      />

      {page.lifeSections.map((section) => (
        <section key={section.id} className="life-section">
          <LifeHeading
            heading={section.heading}
            theme={section.theme}
            backgroundImage={section.backgroundImage}
          />

          {section.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}

          {section.subheading && <h2>{section.subheading}</h2>}

          {section.bullets && (
            <ul className="bullets">
              {section.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}

          {section.subsections?.map((subsection) => (
            <div key={subsection.heading}>
              <h2>{subsection.heading}</h2>
              <p>{subsection.body}</p>
            </div>
          ))}

          {section.link && (
            <p>
              {section.linkSuffix}
              <Link to={section.link.href}>{section.link.label}</Link>.
            </p>
          )}
        </section>
      ))}
    </div>
  );
}
