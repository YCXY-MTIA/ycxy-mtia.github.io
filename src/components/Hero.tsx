import { useEffect, useRef } from 'react';
import { HERO } from '../data/content';
import { useSectionProgress } from '../hooks/useSectionProgress';
import LightRays from './LightRays';
import './Hero.css';

export default function Hero() {
  const brandRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const mottoRef = useRef<HTMLDivElement>(null);
  const mobileYearsRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const exploreRef = useRef<HTMLAnchorElement>(null);
  const raysRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  // 滚动驱动：首页各元素随滚动进度缓慢收拢、淡出
  const sectionRef = useSectionProgress<HTMLElement>((p) => {
    if (brandRef.current) {
      brandRef.current.style.opacity = String(Math.max(0, 1 - p * 2.4));
      brandRef.current.style.transform =
        `translateY(${-36 * p}px) scale(${1 - 0.06 * p})`;
    }
    if (introRef.current) {
      introRef.current.style.opacity = String(Math.max(0, 1 - p * 3.4));
      introRef.current.style.transform = `translateX(${-26 * p}px)`;
    }
    for (const element of [mottoRef.current, mobileYearsRef.current]) {
      if (!element) continue;
      element.style.opacity = String(Math.max(0, 1 - p * 3.4));
      element.style.transform = `translateX(${26 * p}px)`;
    }
    if (stageRef.current) {
      const opacity = p < 0.72 ? 1 : Math.max(0, (0.95 - p) / 0.23);
      stageRef.current.style.opacity = String(opacity);
      stageRef.current.style.transform =
        `translateY(${-11 * p}vh) scale(${1 - 0.24 * p})`;
    }
    if (exploreRef.current) {
      exploreRef.current.style.opacity = String(Math.max(0, 1 - p * 5));
    }
    if (raysRef.current) {
      raysRef.current.style.opacity = String(Math.max(0, 0.95 - p * 1.1));
    }
  });

  // 鼠标视差：会徽倾斜、环境光与文字轻微位移，带缓动
  useEffect(() => {
    const sticky = stickyRef.current;
    if (!sticky) return;

    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX / window.innerWidth - 0.5;
      targetY = e.clientY / window.innerHeight - 0.5;
      if (!raf) raf = requestAnimationFrame(step);
    };

    const step = () => {
      curX += (targetX - curX) * 0.055;
      curY += (targetY - curY) * 0.055;
      sticky.style.setProperty('--mx', curX.toFixed(4));
      sticky.style.setProperty('--my', curY.toFixed(4));
      raf = 0;
      if (Math.abs(targetX - curX) > 0.0004 || Math.abs(targetY - curY) > 0.0004) {
        raf = requestAnimationFrame(step);
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="home" className="hero section" ref={sectionRef}>
      <div className="hero-sticky" ref={stickyRef}>
        <div className="hero-rays" ref={raysRef} aria-hidden="true">
          <LightRays
            raysOrigin="top-center"
            raysColor="#8fb4ff"
            raysSpeed={1.2}
            lightSpread={0.4}
            rayLength={1.2}
            followMouse
            mouseInfluence={0.3}
            noiseAmount={0.1}
            distortion={0.05}
          />
        </div>
        <div className="hero-dust" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} />
          ))}
        </div>

        <div className="hero-brand" ref={brandRef}>
          <h1>{HERO.title}</h1>
          <p className="hero-en">{HERO.titleEn}</p>
        </div>

        <div className="hero-intro" ref={introRef}>
          <div className="intro-inner">
            <p className="intro-lead">{HERO.introLead}</p>
            <p className="intro-body">{HERO.introBody}</p>
            <p className="intro-years">{HERO.years}</p>
            <p className="intro-note">{HERO.yearsNote}</p>
          </div>
        </div>

        <div className="hero-stage" ref={stageRef}>
          <div className="emblem-tilt">
            <div className="emblem-sway">
              <img
                className="emblem-img"
                src="/images/3d-emblem.png"
                alt="医学科技兴趣协会 3D 会徽"
                draggable={false}
              />
            </div>
          </div>
          <div className="emblem-ground" aria-hidden="true" />
        </div>

        <div className="hero-mobile-years" ref={mobileYearsRef}>
          <p className="intro-years">{HERO.years}</p>
          <p className="intro-note">{HERO.yearsNote}</p>
        </div>

        <div className="hero-motto" ref={mottoRef}>
          <div className="motto-inner">
            {HERO.motto.map((word) => (
              <span className="motto-item" key={word}>
                <i aria-hidden="true" />
                {word}
              </span>
            ))}
          </div>
        </div>

        <a className="hero-explore" href="#about" ref={exploreRef}>
          {HERO.explore}
        </a>
      </div>
    </section>
  );
}
