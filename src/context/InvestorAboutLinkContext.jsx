import { createContext, useCallback, useContext, useMemo } from 'react';
import { resolveInvestorAboutHref } from '../utils/investorAboutLinks';

const InvestorAboutLinkContext = createContext(null);

export function InvestorAboutLinkProvider({ basePath, children }) {
  const resolve = useCallback(
    (href) => resolveInvestorAboutHref(href, basePath),
    [basePath],
  );

  const value = useMemo(() => ({ resolve }), [resolve]);

  return (
    <InvestorAboutLinkContext.Provider value={value}>
      {children}
    </InvestorAboutLinkContext.Provider>
  );
}

export function useInvestorAboutLink() {
  return useContext(InvestorAboutLinkContext);
}

export function useResolvedAboutHref(href) {
  const context = useInvestorAboutLink();
  return context ? context.resolve(href) : href;
}
