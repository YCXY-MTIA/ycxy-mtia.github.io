import { useEffect, useRef, type RefObject } from 'react';

/**
 * 返回一个 ref；滚动时计算该元素在视口中的进度（0 → 1），
 * 通过回调交给调用方（用于直接操作 DOM，避免每帧 rerender）。
 */
export function useSectionProgress<T extends HTMLElement>(
  onProgress: (progress: number) => void,
  viewportRef: RefObject<HTMLElement | null>,
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const cbRef = useRef(onProgress);
  useEffect(() => { cbRef.current = onProgress; });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const measure = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const rect = el.getBoundingClientRect();
        // Use the same stable height as the sticky scene, not Safari's changing innerHeight.
        const viewportHeight = window.matchMedia('(max-width: 600px)').matches
          ? (viewportRef.current?.clientHeight ?? window.innerHeight)
          : window.innerHeight;
        const total = rect.height - viewportHeight;
        const progress =
          total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
        cbRef.current(progress);
      });
    };

    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [viewportRef]);

  return ref;
}
