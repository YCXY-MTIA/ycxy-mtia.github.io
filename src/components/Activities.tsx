import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { ACTIVITIES, WALL_PHOTOS, type WallPhoto } from '../data/content';
import { useReveal } from '../hooks/useReveal';
import MorphSlider from './MorphSlider';
import './Activities.css';

const RADIUS = 5;
const DRAG_STEP = 156;
const DRAG_THRESHOLD = 8;

const VIDEO_ITEMS = [
  {
    title: '协会成员比赛操作',
    caption: '协会成员比赛操作 · 点击播放',
    image: '/images/video-posters/competition-first-frame.webp',
    src: '/videos/activity-competition.mp4',
  },
  {
    title: '逆战',
    caption: '逆战 · 点击播放',
    image: '/images/video-posters/against-the-war-first-frame.webp',
    src: '/videos/against-the-war.mp4',
  },
] as const;

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

function ActivityVideo() {
  const [shouldRender, setShouldRender] = useState(
    () => typeof window === 'undefined' || !('IntersectionObserver' in window)
  );
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const videoBlockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = videoBlockRef.current;
    if (!target || shouldRender) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldRender(true);
        observer.disconnect();
      },
      { rootMargin: '800px 0px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [shouldRender]);

  const activeVideo = VIDEO_ITEMS[activeVideoIndex];

  return (
    <div className="activity-video reveal" ref={videoBlockRef}>
      <div className="activity-video-frame">
        {!shouldRender && <div className="activity-video-placeholder" />}
        {shouldRender && !playing && (
          <MorphSlider
            items={VIDEO_ITEMS}
            intensity={0.55}
            aberration={0.35}
            drift={0.4}
            autoplay
            autoplayDelay={5}
            radius={4}
            onIndexChange={setActiveVideoIndex}
          />
        )}
        {shouldRender && playing && (
          <>
            <video
              key={activeVideo.src}
              className="activity-video-player"
              controls
              autoPlay
              playsInline
              preload="metadata"
              poster={activeVideo.image}
              aria-label={`${activeVideo.title}视频`}
              onEnded={() => setPlaying(false)}
            >
              <source src={activeVideo.src} type="video/mp4" />
              您的浏览器不支持视频播放。
            </video>
            <button
              type="button"
              className="activity-video-back"
              onClick={() => setPlaying(false)}
            >
              返回预览
            </button>
          </>
        )}
      </div>
      {!playing && shouldRender && (
        <button
          type="button"
          className="activity-video-play"
          onClick={() => setPlaying(true)}
        >
          播放《{activeVideo.title}》
        </button>
      )}
      <p>{playing ? `正在播放《${activeVideo.title}》` : '活动现场影像 · 滑动浏览 / 点击播放'}</p>
    </div>
  );
}

export default function Activities() {
  const [openPhoto, setOpenPhoto] = useState<WallPhoto | null>(null);
  const [pos, setPos] = useState(0);
  const [dragging, setDragging] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const dragFrameRef = useRef<number | null>(null);
  const pendingPosRef = useRef(0);
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
      base: pendingPosRef.current,
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
      pendingPosRef.current = pointer.base - dx / DRAG_STEP;
      if (dragFrameRef.current !== null) return;
      dragFrameRef.current = requestAnimationFrame(() => {
        dragFrameRef.current = null;
        setPos(pendingPosRef.current);
      });
    }
  };

  const snapToNearestPhoto = () => {
    if (dragFrameRef.current !== null) {
      cancelAnimationFrame(dragFrameRef.current);
      dragFrameRef.current = null;
    }
    const next = Math.round(pendingPosRef.current);
    pendingPosRef.current = next;
    setPos(next);
  };

  const finishDrag = (event: React.PointerEvent) => {
    const pointer = pointerRef.current;
    if (!pointer || event.pointerId !== pointer.id) return;
    pointerRef.current = null;
    setDragging(false);
    if (pointer.moved) {
      snapToNearestPhoto();
    }
  };

  const onPointerCancel = (event: React.PointerEvent) => {
    const pointer = pointerRef.current;
    if (!pointer || event.pointerId !== pointer.id) return;
    pointerRef.current = null;
    setDragging(false);
    if (pointer.moved) {
      snapToNearestPhoto();
    }
  };

  const openPhotoFromCard = useCallback((photo: WallPhoto) => {
    if (!movedRef.current) setOpenPhoto(photo);
  }, []);

  const stepIndex = useCallback(
    (direction: number) => {
      const next = Math.round(pendingPosRef.current) + direction;
      pendingPosRef.current = next;
      setPos(next);
    },
    []
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

  useEffect(
    () => () => {
      if (dragFrameRef.current !== null) {
        cancelAnimationFrame(dragFrameRef.current);
      }
    },
    []
  );

  const cards = useMemo(() => {
    const list: { photo: WallPhoto; delta: number; key: number }[] = [];
    const base = Math.floor(pos);
    for (let d = -RADIUS; d <= RADIUS; d += 1) {
      const virtualIndex = base + d;
      list.push({
        photo: WALL_PHOTOS[wrap(virtualIndex, total)],
        delta: pos - virtualIndex,
        key: virtualIndex,
      });
    }
    return list;
  }, [pos, total]);

  const activeIndex = wrap(Math.round(pos), total);

  return (
    <section id="activities" className="activities section" ref={revealRef}>
      <div className="wall-head">
        <h2 className="reveal">{ACTIVITIES.title}</h2>
        <p className="reveal" style={{ '--d': '0.18s' } as CSSProperties}>
          {ACTIVITIES.subtitle}
        </p>
      </div>

      <ActivityVideo />

      <div
        className={`wall-stage coverflow ${dragging ? 'is-dragging' : ''}`}
        ref={stageRef}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={onPointerCancel}
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
              onOpen={openPhotoFromCard}
            />
          ))}
        </div>
        <div className="coverflow-counter" aria-live="polite">
          {activeIndex + 1} / {total}
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
