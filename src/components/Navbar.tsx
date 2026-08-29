import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { NAV_LINKS, SITE } from '../data/content';
import './Navbar.css';

const EASE = 'power2.easeOut';
const SECTION_IDS = NAV_LINKS.map((link) => link.id);

export default function Navbar() {
  const [activeId, setActiveId] = useState(SECTION_IDS[0]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const circleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tlRefs = useRef<(gsap.core.Timeline | null)[]>([]);

  // 悬停圆形扩展动画：按每个胶囊实际尺寸计算圆的直径与缩放原点
  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return;
        const pill = circle.parentElement;
        const w = pill.offsetWidth;
        const h = pill.offsetHeight;
        if (!w || !h) return;

        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        });

        const label = pill.querySelector('.pill-label');
        const hoverLabel = pill.querySelector('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (hoverLabel) gsap.set(hoverLabel, { y: h + 12, opacity: 0 });

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(
          circle,
          { scale: 1.2, xPercent: -50, duration: 0.3, ease: EASE, overwrite: 'auto' },
          0,
        );
        if (label) {
          tl.to(label, { y: -(h + 8), duration: 0.3, ease: EASE, overwrite: 'auto' }, 0);
        }
        if (hoverLabel) {
          gsap.set(hoverLabel, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(
            hoverLabel,
            { y: 0, opacity: 1, duration: 0.3, ease: EASE, overwrite: 'auto' },
            0,
          );
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();
    window.addEventListener('resize', layout);
    if (document.fonts?.ready) {
      document.fonts.ready.then(layout).catch(() => {});
    }
    return () => window.removeEventListener('resize', layout);
  }, []);

  // 初始隐藏移动端弹出菜单
  useEffect(() => {
    const menu = popoverRef.current;
    if (menu) {
      gsap.set(menu, { visibility: 'hidden', opacity: 0, scaleY: 1, y: 0 });
    }
  }, []);

  // 首屏入场动画：Logo 与胶囊项依次浮现
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.nav-brand',
        { opacity: 0, y: -12, scale: 0.94, transformOrigin: 'left center' },
        { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out', delay: 0.05 },
      );
      gsap.fromTo(
        '.pill-nav-items',
        { opacity: 0, scale: 0.96, transformOrigin: 'right top' },
        { opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out', delay: 0.12 },
      );
      gsap.fromTo(
        '.pill',
        { opacity: 0, y: -14 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.07, delay: 0.22 },
      );
    }, headerRef);
    return () => ctx.revert();
  }, []);

  // 滚动监听：高亮当前所在板块
  useEffect(() => {
    const onScroll = () => {
      const probe = window.innerHeight * 0.35;
      let current = SECTION_IDS[0];
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= probe) {
          current = id;
        }
      }
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4
      ) {
        current = SECTION_IDS[SECTION_IDS.length - 1];
      }
      setActiveId(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openMobile = useCallback(() => {
    setMobileOpen(true);
    const menu = popoverRef.current;
    if (!menu) return;
    gsap.killTweensOf(menu);
    gsap.set(menu, { visibility: 'visible' });
    gsap.fromTo(
      menu,
      { opacity: 0, y: -8, scaleY: 0.96, transformOrigin: 'top center' },
      { opacity: 1, y: 0, scaleY: 1, duration: 0.3, ease: 'power3.out', overwrite: 'auto' },
    );
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    const menu = popoverRef.current;
    if (!menu) return;
    gsap.killTweensOf(menu);
    gsap.to(menu, {
      opacity: 0,
      y: -6,
      scaleY: 0.98,
      duration: 0.2,
      ease: 'power2.in',
      overwrite: 'auto',
      onComplete: () => gsap.set(menu, { visibility: 'hidden' }),
    });
  }, []);

  const toggleMobile = () => {
    if (mobileOpen) {
      closeMobile();
    } else {
      openMobile();
    }
  };

  // 点击弹出菜单外部时关闭
  useEffect(() => {
    if (!mobileOpen) return;
    const onDocClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (popoverRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      closeMobile();
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [mobileOpen, closeMobile]);

  // 回到桌面宽度时收起弹出菜单
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 720 && mobileOpen) closeMobile();
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [mobileOpen, closeMobile]);

  const playPill = (index: number) => {
    const tl = tlRefs.current[index];
    if (tl) tl.timeScale(1).play();
  };

  const reversePill = (index: number) => {
    const tl = tlRefs.current[index];
    if (tl) tl.timeScale(2).reverse();
  };

  return (
    <header className="nav" ref={headerRef}>
      <div className="nav-inner">
        <a className="nav-brand" href="#home" aria-label={SITE.nameZh}>
          <img className="nav-logo" src="/images/logo.png" alt="" aria-hidden="true" />
        </a>

        <nav className="pill-nav-items" aria-label="站点导航">
          <ul className="pill-list">
            {NAV_LINKS.map((link, index) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className={`pill${activeId === link.id ? ' is-active' : ''}`}
                  onMouseEnter={() => playPill(index)}
                  onMouseLeave={() => reversePill(index)}
                >
                  <span
                    className="hover-circle"
                    ref={(el) => {
                      circleRefs.current[index] = el;
                    }}
                  />
                  <span className="label-stack">
                    <span className="pill-label">{link.label}</span>
                    <span className="pill-label-hover" aria-hidden="true">
                      {link.label}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={buttonRef}
          type="button"
          className={`mobile-menu-button${mobileOpen ? ' is-open' : ''}`}
          aria-label="打开菜单"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu-popover"
          onClick={toggleMobile}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>

        <div
          id="mobile-menu-popover"
          ref={popoverRef}
          className="mobile-menu-popover"
          role="menu"
        >
          <ul className="mobile-menu-list">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className={`mobile-menu-link${activeId === link.id ? ' is-active' : ''}`}
                  onClick={closeMobile}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
