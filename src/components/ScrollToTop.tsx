import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Resets window scroll to top on every route change.
 *
 * React Router v6 deliberately does NOT restore/reset scroll position by
 * default — without this, navigating to a new page from halfway down the
 * previous page leaves the new page rendered at that same scroll offset.
 *
 * Mount once inside the router tree (e.g. inside <Root />).
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
