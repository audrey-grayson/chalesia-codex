import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Manages scroll position on route change.
 *
 * React Router v6 deliberately does NOT restore/reset scroll position by
 * default. We provide two behaviors:
 *
 *  1. **No hash**: scroll to (0, 0) — the standard fix that prevents new
 *     pages from inheriting the previous page's scroll offset.
 *  2. **Hash present** (e.g. `/gods#syltea`): scroll the matching element
 *     into view. This is necessary because the hash router's URL format
 *     `#/gods#syltea` is NOT a real browser fragment — the browser does
 *     nothing with it, so we have to do the scroll ourselves.
 *
 * The hash effect retries up to a couple of frames after route change to
 * accommodate AnimatePresence / framer-motion mount delays. Without retries,
 * deep links to anchors on freshly-mounted pages would silently fail because
 * the element doesn't exist yet at the moment the effect first runs.
 *
 * Both `pathname` and `hash` are in the dep array so navigations that only
 * change the hash (e.g. clicking a second god link from /gods) still trigger
 * a re-scroll.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    // Strip the leading '#'. Browsers tolerate ids with most characters, but
    // getElementById is exact-match so just use the raw slice.
    const id = hash.slice(1);

    // Sticky navbar is h-14 (56px). Leave extra breathing room so the
    // target card has visible padding above it, not flush against the nav.
    const SCROLL_OFFSET_PX = 56 + 24;

    const tryScroll = (): boolean => {
      const el = document.getElementById(id);
      if (!el) return false;
      // Compute target manually instead of scrollIntoView so we can offset
      // for the sticky navbar — block: 'start' would put the card's top
      // edge directly under the nav with no breathing room.
      const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET_PX;
      window.scrollTo({ top, behavior: 'smooth' });
      return true;
    };

    // Most of the time the element is already in the DOM by the time this
    // effect runs. When it isn't (motion-animated page mount), retry on the
    // next two animation frames before giving up. Two frames is enough to
    // cover framer-motion's initial-state → animate transition without
    // making the user wait noticeably.
    if (tryScroll()) return;
    let frame = 0;
    const id1 = requestAnimationFrame(() => {
      if (tryScroll()) return;
      frame = requestAnimationFrame(() => {
        tryScroll();
      });
    });
    return () => {
      cancelAnimationFrame(id1);
      cancelAnimationFrame(frame);
    };
  }, [pathname, hash]);

  return null;
}
