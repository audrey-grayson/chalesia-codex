import { useEffect } from 'react';

/**
 * Preloads a list of image URLs into the browser cache during idle time so
 * they are ready before the user navigates to a page that displays them.
 *
 * Uses requestIdleCallback (with a setTimeout fallback for Safari) so the
 * fetches are deferred until the main thread has nothing urgent to do —
 * they won't compete with the initial render or any user interaction.
 *
 * The Image objects are held in a local array for the duration of loading
 * to prevent the GC from discarding them before the fetches complete.
 */
export function usePreloadImages(urls: string[]): void {
  useEffect(() => {
    if (!urls.length) return;

    let cancelled = false;
    // Hold strong references so GC doesn't drop them mid-fetch.
    const images: HTMLImageElement[] = [];

    const load = () => {
      if (cancelled) return;
      for (const url of urls) {
        const img = new window.Image();
        img.src = url;
        images.push(img);
      }
    };

    if ('requestIdleCallback' in window) {
      // timeout: 3000 — if the browser stays busy for 3 s, force it anyway.
      const id = window.requestIdleCallback(load, { timeout: 3000 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    } else {
      // Safari fallback: small delay so at least the first paint is done.
      const id = setTimeout(load, 300);
      return () => {
        cancelled = true;
        clearTimeout(id);
      };
    }
    // urls is derived from a static constant — stable across renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
