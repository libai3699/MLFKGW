import { Link } from 'react-router-dom';

function RichPart({ part, index }) {
  if (typeof part === 'string') {
    return <span key={index}>{part}</span>;
  }

  if (part.strong) {
    return <strong key={index}>{part.strong}</strong>;
  }

  if (part.link?.to) {
    return (
      <Link key={index} to={part.link.to} title={part.link.title}>
        {part.link.label}
      </Link>
    );
  }

  if (part.link?.href) {
    return (
      <a
        key={index}
        href={part.link.href}
        target={part.link.external ? '_blank' : undefined}
        rel={part.link.external ? 'noopener noreferrer' : undefined}
        title={part.link.title}
      >
        {part.link.label}
      </a>
    );
  }

  return null;
}

function RichParagraph({ block }) {
  if (block.text) {
    return <p>{block.text}</p>;
  }

  return (
    <p>
      {block.parts.map((part, index) => (
        <RichPart key={index} part={part} index={index} />
      ))}
    </p>
  );
}

function CookiesTable({ rows }) {
  return (
    <table id="cookies">
      <thead>
        <tr>
          <th style={{ width: '15%' }}>Provider</th>
          <th style={{ width: '10%' }}>Cookie Name</th>
          <th style={{ width: '10%' }}>Type</th>
          <th style={{ width: '55%' }}>Uses</th>
          <th style={{ width: '10%' }}>Duration</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            {row.provider && (
              <td rowSpan={row.providerRowSpan || 1}>{row.provider}</td>
            )}
            <td>
              {row.name.split('\n').map((line, lineIndex) => (
                <span key={lineIndex}>
                  {lineIndex > 0 && <br />}
                  {line}
                </span>
              ))}
            </td>
            <td>{row.cookieType}</td>
            <td>{row.uses}</td>
            <td>{row.duration}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function LegalContent({ page }) {
  return (
    <div className="legal-content">
      <h1>{page.title}</h1>
      {page.blocks.map((block, index) => {
        if (block.type === 'h2') {
          return <h2 key={index}>{block.text}</h2>;
        }

        if (block.type === 'cookiesTable') {
          return <CookiesTable key={index} rows={block.rows} />;
        }

        return <RichParagraph key={index} block={block} />;
      })}
    </div>
  );
}
