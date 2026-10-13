'use client';

import { useEffect } from 'react';

const SCRIPTS = [
  '/js/bootstrap.bundle.min.js',
  '/js/gumshoe.polyfills.min.js',
  '/js/tiny-slider.js',
  '/js/tobii.min.js',
  '/js/feather.min.js',
  '/js/plugins.init.js',
  '/js/app.js',
];

// Module-level, so it survives Strict Mode's double effect.
let injected = false;

export default function ThemeScripts() {
  useEffect(() => {
    if (injected) return;
    injected = true;

    let cancelled = false;

    const loadNext = (i) => {
      if (cancelled) return;

      if (i >= SCRIPTS.length) {
        // The template's own init, which the missed 'load' event skipped.
        try {
          window.activateMenu?.();
        } catch (e) {
          /* app.js guards most of this itself */
        }
        // Turns every <i data-feather="..."> into an inline SVG.
        // Idempotent, so calling it again is harmless.
        try {
          window.feather?.replace();
        } catch (e) {
          /* feather missing -> icons just stay as empty <i> tags */
        }
        return;
      }

      const src = SCRIPTS[i];

      // Don't double-add if something else on the page already loaded it.
      if (document.querySelector('script[src="' + src + '"]')) {
        loadNext(i + 1);
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.onload = () => loadNext(i + 1);
      script.onerror = () => {
        console.error('[fronter] failed to load ' + src);
        loadNext(i + 1); // keep going so one bad file doesn't kill the rest
      };
      document.body.appendChild(script);
    };

    loadNext(0);

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
