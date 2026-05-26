function renderParagraph(paragraph) {
  if (typeof paragraph === 'string') {
    return paragraph;
  }

  return paragraph.parts.map((part, index) => {
    if (typeof part === 'string') {
      return <span key={index}>{part}</span>;
    }

    if (part.em) {
      return <em key={index}>{part.em}</em>;
    }

    if (part.link) {
      return (
        <a
          key={index}
          href={part.link.href}
          target={part.link.external ? '_blank' : undefined}
          rel={part.link.external ? 'noopener noreferrer' : undefined}
        >
          {part.link.label}
        </a>
      );
    }

    return null;
  });
}

export default function OurPeopleContent({ page }) {
  return (
    <div className="our-people-content">
      {page.sections.map((section) => (
        <section key={section.id} className="our-people-section">
          <h2>{section.heading}</h2>
          {section.paragraphs.map((paragraph, index) => (
            <p key={`${section.id}-${index}`}>{renderParagraph(paragraph)}</p>
          ))}
        </section>
      ))}

      <div className="profile-list" id="career-profiles">
        {page.profiles.map((profile, index) => (
          <article
            key={profile.id}
            className={`career-profile ${index % 2 === 0 ? 'career-profile-left' : 'career-profile-right'}`}
          >
            <a href={profile.profileHref} target="_blank" rel="noopener noreferrer">
              <img
                className="img-fluid profile-img"
                src={profile.image}
                alt={`${profile.team} associate`}
              />
            </a>
            <h3>{profile.team}</h3>
            <div className="quote">
              <em>&ldquo;{profile.quote}&rdquo;</em>{' '}
              <a href={profile.profileHref} target="_blank" rel="noopener noreferrer">
                Read More
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
