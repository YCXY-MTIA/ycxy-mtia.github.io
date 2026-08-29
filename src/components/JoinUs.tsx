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
          <img
            className="stairway-img"
            src="/images/stairway.png"
            alt="向上延伸的阶梯"
            loading="lazy"
          />
        </div>

        <aside className="join-info">
          {JOIN.items.map((item, i) => (
            <div
              className="join-item reveal"
              style={{ '--d': `${0.3 + i * 0.15}s` } as CSSProperties}
              key={item.label}
            >
              <p className="join-item-label">{item.label}</p>
              <p className="join-item-value">{item.value}</p>
            </div>
          ))}
        </aside>
      </div>

      <footer className="site-footer">
        <p>{JOIN.footerEn}</p>
        <p>{JOIN.footerZh}</p>
      </footer>
    </section>
  );
}
