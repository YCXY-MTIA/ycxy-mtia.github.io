import type { CSSProperties } from 'react';
import { JOIN } from '../data/content';
import { useReveal } from '../hooks/useReveal';
import './JoinUs.css';

export default function JoinUs() {
  const ref = useReveal<HTMLElement>();

  return (
    <section id="join" className="join section" ref={ref}>
      <div className="join-grid">
        <div className="stairway-caption">
          <span>同学</span>
          <span>加入我们</span>
          <span>探索更多可能</span>
        </div>

        <div
          className="join-visual reveal"
          style={{ '--d': '0.2s' } as CSSProperties}
        >
          <div className="mobile-join-caption">
            <span>一起创造更多可能</span>
            <strong>加入我们</strong>
          </div>
          <a className="mobile-join-door" href="https://qm.qq.com/q/FeoZxdMgJG"
            target="_blank" rel="noopener noreferrer" aria-label="打开 QQ 招新群，群号 1084143228">
            <span>点此处加群</span>
          </a>
          <a
            className="join-image-link"
            href="https://qm.qq.com/q/FeoZxdMgJG"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="打开 QQ 招新群，群号 1084143228"
          >
            <img
              className="stairway-img"
              src="/images/stairway.png"
              alt="向上延伸的阶梯，点击加入 QQ 招新群"
              loading="lazy"
            />
          </a>
        </div>

      </div>

      <footer className="site-footer">
        <p>{JOIN.footerEn}</p>
        <p>{JOIN.footerZh}</p>
      </footer>
    </section>
  );
}
