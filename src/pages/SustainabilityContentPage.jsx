import { useEffect, useRef } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import SustainabilityLayout from '../components/Sustainability/SustainabilityLayout';
import { sustainabilityPages } from '../data/sustainabilityPageContent';

function scrollToHash(hash) {
  if (!hash) {
    return;
  }
  const id = hash.replace('#', '');
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export default function SustainabilityContentPage() {
  const { slug } = useParams();
  const page = sustainabilityPages[slug];
  const contentRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    scrollToHash(location.hash);
  }, [location.pathname, location.hash, page]);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) {
      return undefined;
    }

    const handleClick = (event) => {
      const anchor = event.target.closest('a');
      if (!anchor) {
        return;
      }

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('/content') || href.endsWith('.pdf')) {
        return;
      }

      if (href.startsWith('#')) {
        event.preventDefault();
        navigate({ pathname: location.pathname, hash: href.slice(1) });
        scrollToHash(href);
        return;
      }

      if (href.startsWith('/sustainability/')) {
        event.preventDefault();
        const hashIndex = href.indexOf('#');
        const pathname = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
        const hash = hashIndex >= 0 ? href.slice(hashIndex) : '';
        navigate(`${pathname}${hash}`);
      }
    };

    container.addEventListener('click', handleClick);
    return () => container.removeEventListener('click', handleClick);
  }, [location.pathname, navigate, page]);

  if (!page) {
    return <Navigate to="/sustainability/home" replace />;
  }

  return (
    <SustainabilityLayout pageTitle={page.title} activeNavId={page.activeNavId}>
      <div
        ref={contentRef}
        className="sustainability-inner-main"
        dangerouslySetInnerHTML={{ __html: page.contentHtml }}
      />
    </SustainabilityLayout>
  );
}
