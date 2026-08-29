import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { ACTIVITIES, WALL_PHOTOS, type WallPhoto } from '../data/content';
import { useReveal } from '../hooks/useReveal';
import './Activities.css';

const RADIUS = 5;
const DRAG_STEP = 128;
const DRAG_THRESHOLD = 8;

function wrap(value: number, length: number) {
  return ((value % length) + length) % length;
}

function CoverflowCard({
  photo,
  delta,
  onOpen,
}: {
  photo: WallPhoto;
  delta: number;
  onOpen: (photo: WallPhoto) => void;
}) {
  const abs = Math.abs(delta);
  const sign = Math.sign(delta);
  const style = {
    '--dx': `${sign * abs * 118}px`,
    '--rot': `${sign * abs * 32}deg`,
    '--z': `${-abs * 150}px`,
    '--scale': Math.max(0.5, 1 - abs * 0.1).toFixed(3),
    '--card-z': 100 - abs,
  } as CSSProperties;

  return (
    <div
      className={`coverflow-card ${
        photo.landscape ? 'size-land' : 'size-port'
      } ${abs === 0 ? 'is-active' : ''}`}
      style={style}
      aria-hidden={abs !== 0}
    >
      <button
        type="button"
        className="cf-card"
        tabIndex={abs === 0 ? 0 : -1}
        onClick={() => onOpen(photo)}
        aria-label={`查看${photo.label}照片`}
      >
        <div className="polaroid-frame">
          <div className="polaroid-img">
            <img
              src={photo.src}
              alt={photo.label}
              loading="lazy"
              decoding="async"
            />
          </div>
          <p className="polaroid-caption">{photo.label}</p>
        </div>
      </button>
    </div>
  );
}

export default function Activities() {
  const [openPhoto, setOpenPhoto] = useState<WallPhoto | null>(null);
  const [index, setIndex] = useState(0);
  const [pos, setPos] = useState(0);
  const [dragging, setDragging] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<{
    id: number;
    startX: number;
    base: number;
    moved: boolean;
  } | null>(null);
  const movedRef = useRef(false);
  const revealRef = useReveal<HTMLElement>();

  const total = WALL_PHOTOS.length;

  const onPointerDown = (event: React.PointerEvent) => {
    if (!event.isPrimary || pointerRef.current) return;
    pointerRef.current = {
      id: event.pointerId,
      startX: event.clientX,
      base: pos,
      moved: false,
    };
    movedRef.current = false;
  };

  const onPointerMove = (event: React.PointerEvent) => {
    const pointer = pointerRef.current;
    if (!pointer || event.pointerId !== pointer.id) return;
    const dx = event.clientX - pointer.startX;
    if (!pointer.moved && Math.abs(dx) > DRAG_THRESHOLD) {
      pointer.moved = true;
      movedRef.current = true;
      setDragging(true);
      try {
        stageRef.current?.setPointerCapture(pointer.id);
      } catch {
        // 忽略捕获失败
      }
    }
    if (pointer.moved) {
      setPos(pointer.base - dx / DRAG_STEP);
    }
  };

  const finishDrag = (event: React.PointerEvent) => {
    const pointer = pointerRef.current;
    if (!pointer || event.pointerId !== pointer.id) return;
    pointerRef.current = null;
    setDragging(false);
    if (pointer.moved) {
      setPos((current) => {
        const next = wrap(Math.round(current), total);
        setIndex(next);
        return next;
      });
    }
  };

  const onPointerCancel = (event: React.PointerEvent) => {
    const pointer = pointerRef.current;
    if (!pointer || event.pointerId !== pointer.id) return;
    pointerRef.current = null;
    setDragging(false);
    if (pointer.moved) {
      setPos((current) => {
        const next = wrap(Math.round(current), total);
        setIndex(next);
        return next;
      });
    }
  };

  const openPhotoFromCard = useCallback(() => {
    setOpenPhoto(WALL_PHOTOS[wrap(Math.round(index), total)]);
  }, [index, total]);

  const onStageClick = (event: React.MouseEvent) => {
    if (movedRef.current) return;
    const active = document.querySelector<HTMLButtonElement>(
      '.coverflow-card.is-active .cf-card'
    );
    if (active && active.contains(event.target as Node)) {
      openPhotoFromCard();
    }
  };

  const stepIndex = useCallback(
    (direction: number) => {
      const next = wrap(index + direction, total);
      setIndex(next);
      setPos(next);
    },
    [index, total]
  );

  const onStageKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      stepIndex(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      stepIndex(1);
    }
  };

  // lightbox 打开时锁定滚动，Esc 关闭
  useEffect(() => {
    if (!openPhoto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenPhoto(null);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [openPhoto]);

  const cards = useMemo(() => {
    const list: { photo: WallPhoto; delta: number; key: number }[] = [];
    for (let d = -RADIUS; d <= RADIUS; d += 1) {
      const i = wrap(Math.round(pos) + d, total);
      list.push({ photo: WALL_PHOTOS[i], delta: pos - i, key: i });
    }
    return list;
  }, [pos, total]);

  return (
    <section id="activities" className="activities section" ref={revealRef}>
      <div className="wall-head">
        <h2 className="reveal">{ACTIVITIES.title}</h2>
        <p className="reveal" style={{ '--d': '0.18s' } as CSSProperties}>
          {ACTIVITIES.subtitle}
        </p>
      </div>

      <div
        className={`wall-stage coverflow ${dragging ? 'is-dragging' : ''}`}
        ref={stageRef}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={onPointerCancel}
        onClick={onStageClick}
        onKeyDown={onStageKeyDown}
        role="region"
        aria-label="活动照片轮转展示"
      >
        <span className="visually-hidden">
          按住鼠标左键左右拖动或使用方向键切换照片
        </span>
        <div className="coverflow-strip">
          {cards.map(({ photo, delta, key }) => (
            <CoverflowCard
              key={key}
              photo={photo}
              delta={delta}
              onOpen={setOpenPhoto}
            />
          ))}
        </div>
        <div className="coverflow-counter" aria-live="polite">
          {wrap(Math.round(pos), total) + 1} / {total}
        </div>
        <p className="coverflow-hint">按住鼠标左键拖动 / 手指左右滑动 · 点击查看大图</p>
      </div>

      <div className="wall-tags">
        <p className="reveal" style={{ '--d': '0.2s' } as CSSProperties}>
          {ACTIVITIES.tagsEn}
        </p>
        <p className="reveal" style={{ '--d': '0.35s' } as CSSProperties}>
          {ACTIVITIES.tagsZh}
        </p>
      </div>

      {openPhoto && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpenPhoto(null)}
        >
          <div
            className={`lightbox-card ${
              openPhoto.landscape ? 'size-land' : 'size-port'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="polaroid-frame">
              <div className="polaroid-img is-large">
                <img src={openPhoto.src} alt={openPhoto.label} />
              </div>
              <p className="polaroid-caption">{openPhoto.label}</p>
              <p className="polaroid-note">{openPhoto.note}</p>
            </div>
            <p className="lightbox-hint">Esc 或点击任意处关闭</p>
          </div>
        </div>
      )}
    </section>
  );
}
