import { useEffect, useRef, useState } from 'react';

/**
 * Fires `shown = true` once the element scrolls into the viewport.
 * Immediately resolves when the user prefers reduced motion.
 * Use inside client components only — the ref must be attached to a real DOM element.
 */
export function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect the user's motion preference — skip animation entirely.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect(); // fire once, never re-hide
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, shown] as const;
}
