import { Link } from 'react-router-dom';
import { useResolvedAboutHref } from '../../context/InvestorAboutLinkContext';

export default function AboutAwareLink({ to, children, ...props }) {
  const href = useResolvedAboutHref(to);

  return (
    <Link to={href} {...props}>
      {children}
    </Link>
  );
}
