import { Link } from 'react-router-dom';

const institutionalFooterLinks = [
  { label: 'Terms & Conditions', href: '/legal-information', internal: true },
  { label: 'Cookies Policy', href: '/cookies-policy', internal: true },
  {
    label: 'California Privacy Policy',
    href: '/content/dam/documents/legal/privacy-policy/Privacy-Notice-for-California-Residents.pdf',
    external: true,
  },
  {
    label: 'Form CRS',
    href: '/content/dam/documents/legal/APLP-Form-ADV-CRS.pdf',
    external: true,
  },
];

const individualFooterLinks = [
  {
    label: 'Prospectus',
    href: '/individual-investors/resources/prospectus',
    internal: true,
    bold: true,
  },
  { label: 'Terms & Conditions', href: '/individual-investors/terms-conditions', internal: true },
  { label: 'Privacy Policy', href: '/individual-investors/privacy-policy', internal: true },
  {
    label: 'Proxy Policies & Voting Records',
    href: '/individual-investors/proxy-policies-and-voting-record',
    internal: true,
  },
  {
    label: 'California Privacy Policy',
    href: '/content/dam/documents/legal/privacy-policy/Privacy-Notice-for-California-Residents.pdf',
    external: true,
  },
  {
    label: 'Form CRS',
    href: '/content/dam/documents/legal/APLP-Form-ADV-CRS.pdf',
    external: true,
  },
];

function renderFooterLink(link) {
  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" title={link.label}>
        {link.label}
      </a>
    );
  }

  return (
    <Link to={link.href} title={link.label}>
      {link.label}
    </Link>
  );
}

export default function InvestorSiteFooter({ site }) {
  const isIndividual = site?.id === 'individual-investors';
  const footerLinks = isIndividual ? individualFooterLinks : institutionalFooterLinks;

  return (
    <div id="footer-wrapper">
      <footer id="footer" className="investor-site-footer">
        <div className="container investor-container">
          <div className="section">
            <ul className="clearfix investor-footer-links">
              {footerLinks.map((link) => (
                <li key={link.label} className={link.bold ? 'investor-footer-link-bold' : undefined}>
                  {renderFooterLink(link)}
                </li>
              ))}
            </ul>
            {isIndividual ? (
              <>
                <p>
                  <em>
                    This website is intended for persons in the United States only and should not be
                    considered a solicitation or an offering to investors residing outside the United
                    States. The Artisan Partners Funds are offered by prospectus. Carefully consider
                    the Fund&apos;s investment objective, risks and charges and expenses. This and
                    other important information is contained in the Fund&apos;s prospectus and summary
                    prospectus, which can be obtained by calling 800 344 1770. Read carefully before
                    investing.
                  </em>
                </p>
                <p>
                  Artisan Partners Funds offered through Artisan Partners Distributors LLC, member{' '}
                  <a href="http://www.finra.org" target="_blank" rel="noopener noreferrer">
                    FINRA
                  </a>
                  , a wholly owned broker/dealer subsidiary of Artisan Partners Holdings LP. Artisan
                  Partners Limited Partnership, an investment advisory firm and adviser to Artisan
                  Partners Funds, is owned by Artisan Partners Holdings, LP. Artisan Partners Limited
                  Partnership does not provide investment advice directly to shareholders of the Artisan
                  Partners Funds. Materials on this website are informational only and should not be taken
                  as investment recommendation or advice of any kind whatsoever (whether impartial or
                  otherwise).
                </p>
              </>
            ) : (
              <>
                <p>
                  The financial services and products described on this website are intended to be made
                  available only to persons in the United States. This website does not constitute an offer
                  or recommendation by Artisan Partners or any of its affiliated entities (collectively,
                  &quot;Artisan Partners&quot;) of securities or services to, or a solicitation by Artisan
                  Partners of an offer to buy securities or services from, any person residing in a
                  jurisdiction outside the United States in which such an offer or solicitation would be
                  unlawful under the applicable laws and regulations. Materials on this website are
                  informational only and should not be taken as investment recommendation or advice of any
                  kind whatsoever (whether impartial or otherwise).
                </p>
                <p>
                  Investment advisory services for Artisan Partners&apos; institutional separately managed
                  accounts are offered through Artisan Partners Limited Partnership (APLP), an investment
                  adviser registered with the U.S. Securities and Exchange Commission (SEC). Grandview
                  Property Partners, LLC&apos;s (GPP) investments are offered through GPP, a wholly owned
                  subsidiary of Artisan Partners Holdings LP, and a SEC-registered investment adviser. The
                  information contained herein is not intended to constitute, or be construed as, investment
                  advice and any portfolio data or characteristics relating to individual accounts managed
                  to an investment strategy, including pooled investment vehicles, may vary from what is
                  shown for the strategy model portfolio or composite of accounts.
                </p>
                <p>
                  Artisan Partners Funds are distributed through Artisan Partners Distributors LLC, member{' '}
                  <a href="http://www.finra.org" target="_blank" rel="noopener noreferrer">
                    FINRA
                  </a>
                  , a wholly owned broker/dealer subsidiary of Artisan Partners Holdings LP. Artisan Partners
                  Limited Partnership, an investment advisory firm and adviser to Artisan Partners Funds, is
                  owned by Artisan Partners Holdings, LP. Artisan Partners Limited Partnership does not
                  provide investment advice directly to shareholders of the Artisan Partners Funds.
                </p>
              </>
            )}
            <p>&copy; {new Date().getFullYear()} Artisan Partners. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
