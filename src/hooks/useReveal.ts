import { useEffect, useRef } from 'react';

/**
 * 观察容器内所有 .reveal 元素，进入视口时添加 .is-visible，
 * 由 CSS 过渡完成缓慢的揭示动画。
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>('.reveal'));
    if (targets.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return ref;
}
