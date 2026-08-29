import type { CSSProperties } from 'react';
import { JOURNEY } from '../data/content';
import { useReveal } from '../hooks/useReveal';
import './Journey.css';

function splitEvent(event: string): [string, string] {
  const idx = event.indexOf(' ');
  return [event.slice(0, idx), event.slice(idx + 1)];
}

export default function Journey() {
  const ref = useReveal<HTMLElement>();

  return (
    <section id="about" className="journey section" ref={ref}>
      <div className="journey-head">
        <h2 className="reveal">{JOURNEY.title}</h2>
        <p
          className="journey-span reveal"
          style={{ '--d': '0.15s' } as CSSProperties}
        >
          {JOURNEY.span}
        </p>
        <p
          className="journey-sub reveal"
          style={{ '--d': '0.3s' } as CSSProperties}
        >
          {JOURNEY.subtitle}
        </p>
      </div>

      <div className="era-grid">
        {JOURNEY.eras.map((era, i) => (
          <article
            className="era reveal"
            style={{ '--d': `${0.25 + i * 0.16}s` } as CSSProperties}
            key={era.range}
          >
            <p className="era-range">{era.range}</p>
            <p className="era-theme">{era.theme}</p>
            <figure className="era-photo">
              <img src={era.image} alt={era.photoLabel} loading="lazy" />
            </figure>
            <ul className="era-events">
              {era.events.map((event) => {
                const [year, text] = splitEvent(event);
                return (
                  <li key={event}>
                    <span className="event-year">{year}</span>
                    <span className="event-text">{text}</span>
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
