import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  value: string;
  duration?: number;
  className?: string;
}

/**
 * Animates a numeric value from 0 to its final number when scrolled into view.
 * Preserves any non-numeric suffix (e.g. "%", "g", "+").
 */
export const CountUp = ({ value, duration = 1600, className }: CountUpProps) => {
  const match = value.match(/^(\d+(?:[.,]\d+)?)(.*)$/);
  const target = match ? parseFloat(match[1].replace(",", ".")) : 0;
  const suffix = match ? match[2] : value;
  const decimals = match && match[1].includes(".") ? match[1].split(".")[1].length : 0;

  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !match) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setDisplay(target);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            const startTime = performance.now();
            const tick = (now: number) => {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // easeOutCubic
              const eased = 1 - Math.pow(1 - progress, 3);
              setDisplay(target * eased);
              if (progress < 1) requestAnimationFrame(tick);
              else setDisplay(target);
            };
            requestAnimationFrame(tick);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, match]);

  if (!match) {
    return <span className={className}>{value}</span>;
  }

  const formatted =
    decimals > 0 ? display.toFixed(decimals) : Math.round(display).toString();

  return (
    <span ref={ref} className={className}>
      {formatted}
      {suffix}
    </span>
  );
};
