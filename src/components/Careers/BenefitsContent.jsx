import CareersHeroSection from './CareersHeroSection';

function BenefitsBlock({ section }) {
  return (
    <div className="career-profile">
      <div className="cb-table header">
        <div className={`cb-table-row ${section.theme}`}>
          <div className="cb-table-cell">
            <h2 className="white">{section.heading}</h2>
          </div>
          <div className="cb-table-cell">
            <img className="img-fluid" src={section.image} alt={section.heading} />
          </div>
        </div>
      </div>
      <div className="cb-table">
        <div className="cb-table-row">
          <div className="cb-table-cell">
            <p>{section.intro}</p>
            {section.secondaryIntro && <p>{section.secondaryIntro}</p>}
            <ul className="bullets">
              {section.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {section.footnote && <p><em>{section.footnote}</em></p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BenefitsContent({ page }) {
  return (
    <div className="benefits-content">
      <CareersHeroSection
        title={page.title}
        intro={page.intro}
        headerImage={page.headerImage}
      />

      <div id="career-profiles">
        {page.sections.map((section) => (
          <BenefitsBlock key={section.id} section={section} />
        ))}
      </div>

      <div className="benefits-disclaimers">
        {page.disclaimers.map((text, index) => (
          <p key={index}>
            {index === 1 ? (
              <>
                {text.split('https://transparency-in-coverage.uhc.com')[0]}
                <a
                  href="https://transparency-in-coverage.uhc.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://transparency-in-coverage.uhc.com
                </a>
                .
              </>
            ) : (
              text
            )}
          </p>
        ))}
      </div>
    </div>
  );
}
