// @ts-nocheck
import { useCallback, useEffect, useRef, useState } from 'react';
import { Mesh, Program, Renderer, Texture, Triangle } from 'ogl';
import { gsap } from 'gsap';
import './MorphSlider.css';

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragmentShader = `
precision highp float;
uniform sampler2D tCurrent;
uniform sampler2D tNext;
uniform vec2 uResolution;
uniform vec2 uCurrentSize;
uniform vec2 uNextSize;
uniform float uProgress;
uniform float uIntensity;
uniform float uScale;
uniform float uAberration;
uniform float uDrift;
uniform float uTime;
uniform float uReduce;
varying vec2 vUv;

const float PI = 3.14159265359;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0)), f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

vec2 coverUV(vec2 uv, vec2 resolution, vec2 imageSize) {
  float screenRatio = resolution.x / max(resolution.y, 1.0);
  float imageRatio = imageSize.x / max(imageSize.y, 1.0);
  vec2 scale = vec2(1.0);
  float ratio = screenRatio / max(imageRatio, 0.0001);
  if (ratio > 1.0) scale.y = 1.0 / ratio;
  else scale.x = ratio;
  return (uv - 0.5) * scale + 0.5;
}

void main() {
  float progress = clamp(uProgress, 0.0, 1.0);
  float envelope = sin(progress * PI);
  vec2 uv = vUv;
  uv += vec2(sin(uTime * 0.25 + uv.y * 4.0), cos(uTime * 0.22 + uv.x * 4.0)) * uDrift * 0.008;

  float field = fbm(uv * uScale + uTime * 0.03);
  float warp = fbm(uv * uScale * 1.7 - uTime * 0.02);
  vec2 displacement = vec2(field, warp) - 0.5;
  vec2 currentUv = uv + displacement * uIntensity * 0.5 * progress;
  vec2 nextUv = uv - displacement * uIntensity * 0.5 * (1.0 - progress);
  float mixAmount = uReduce < 0.5
    ? smoothstep(field - 0.15, field + 0.15, progress)
    : progress;

  vec2 currentSample = coverUV(currentUv, uResolution, uCurrentSize);
  vec2 nextSample = coverUV(nextUv, uResolution, uNextSize);
  float chroma = uReduce < 0.5 ? uAberration * envelope * 0.03 : 0.0;
  vec3 currentColor = vec3(
    texture2D(tCurrent, currentSample + vec2(chroma, 0.0)).r,
    texture2D(tCurrent, currentSample).g,
    texture2D(tCurrent, currentSample - vec2(chroma, 0.0)).b
  );
  vec3 nextColor = vec3(
    texture2D(tNext, nextSample + vec2(chroma, 0.0)).r,
    texture2D(tNext, nextSample).g,
    texture2D(tNext, nextSample - vec2(chroma, 0.0)).b
  );
  vec3 color = mix(currentColor, nextColor, mixAmount);
  float vignette = smoothstep(1.25, 0.25, length(uv - 0.5));
  color *= mix(0.7, 1.0, vignette);
  gl_FragColor = vec4(color, 1.0);
}`;

function fallbackTexture(gl) {
  const data = new Uint8Array(4 * 4 * 4).fill(24);
  for (let i = 3; i < data.length; i += 4) data[i] = 255;
  return new Texture(gl, { image: data, width: 4, height: 4, generateMipmaps: false });
}

class MorphEngine {
  constructor(container, { items, startIndex, reducedMotion, options, onIndexChange }) {
    this.container = container;
    this.items = items;
    this.options = options;
    this.onIndexChange = onIndexChange;
    this.current = startIndex;
    this.animating = false;

    this.renderer = new Renderer({
      alpha: false,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0.05, 0.05, 0.06, 1);
    this.canvas = this.gl.canvas;
    this.canvas.className = 'morph-slider-canvas';
    container.appendChild(this.canvas);

    this.textures = items.map(() => fallbackTexture(this.gl));
    this.sizes = items.map(() => [1, 1]);
    this.program = new Program(this.gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        tCurrent: { value: this.textures[startIndex] },
        tNext: { value: this.textures[startIndex] },
        uResolution: { value: [1, 1] },
        uCurrentSize: { value: this.sizes[startIndex] },
        uNextSize: { value: this.sizes[startIndex] },
        uProgress: { value: 0 },
        uIntensity: { value: options.intensity },
        uScale: { value: options.scale },
        uAberration: { value: options.aberration },
        uDrift: { value: options.drift },
        uTime: { value: 0 },
        uReduce: { value: reducedMotion ? 1 : 0 },
      },
    });
    this.mesh = new Mesh(this.gl, { geometry: new Triangle(this.gl), program: this.program });
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.resize();
    this.loadTextures();
    this.loop = this.loop.bind(this);
    this.raf = requestAnimationFrame(this.loop);
  }

  loadTextures() {
    this.items.forEach((item, index) => {
      const image = new Image();
      image.src = item.image;
      image.onload = () => {
        const texture = new Texture(this.gl, { image, generateMipmaps: false });
        this.textures[index] = texture;
        this.sizes[index] = [image.naturalWidth || 1, image.naturalHeight || 1];
        if (index === this.current) this.applyCurrent(index);
      };
    });
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    this.renderer.setSize(Math.max(rect.width, 1), Math.max(rect.height, 1));
    this.program.uniforms.uResolution.value = [this.gl.canvas.width, this.gl.canvas.height];
  }

  applyCurrent(index) {
    this.program.uniforms.tCurrent.value = this.textures[index];
    this.program.uniforms.uCurrentSize.value = this.sizes[index];
  }

  next() {
    if (this.animating || this.items.length < 2) return;
    const target = (this.current + 1) % this.items.length;
    this.program.uniforms.tCurrent.value = this.textures[this.current];
    this.program.uniforms.uCurrentSize.value = this.sizes[this.current];
    this.program.uniforms.tNext.value = this.textures[target];
    this.program.uniforms.uNextSize.value = this.sizes[target];
    this.animating = true;
    const commit = () => {
      if (!this.animating) return;
      this.current = target;
      this.applyCurrent(target);
      this.program.uniforms.uProgress.value = 0;
      this.animating = false;
      this.transitionTimer = null;
      this.onIndexChange(target);
    };
    gsap.fromTo(
      this.program.uniforms.uProgress,
      { value: 0 },
      {
        value: 1,
        duration: this.options.duration,
        ease: 'power2.inOut',
        onComplete: commit,
      }
    );
    this.transitionTimer = window.setTimeout(commit, (this.options.duration + 0.15) * 1000);
  }

  loop(time) {
    this.program.uniforms.uTime.value = time * 0.001;
    this.renderer.render({ scene: this.mesh });
    this.raf = requestAnimationFrame(this.loop);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    if (this.transitionTimer) window.clearTimeout(this.transitionTimer);
    this.resizeObserver.disconnect();
    this.textures.forEach((texture) => texture.texture && this.gl.deleteTexture(texture.texture));
    if (this.program.program) this.gl.deleteProgram(this.program.program);
    this.gl.getExtension('WEBGL_lose_context')?.loseContext();
    this.canvas.remove();
  }
}

export default function MorphSlider({
  items,
  startIndex = 0,
  duration = 1.1,
  intensity = 0.55,
  scale = 2.4,
  aberration = 0.35,
  drift = 0.4,
  autoplay = false,
  autoplayDelay = 4,
  radius = 16,
  onIndexChange,
  className = '',
}) {
  const containerRef = useRef(null);
  const engineRef = useRef(null);
  const [index, setIndex] = useState(startIndex);
  const [hovering, setHovering] = useState(false);

  const next = useCallback(() => engineRef.current?.next(), []);

  useEffect(() => {
    if (!containerRef.current) return undefined;
    const engine = new MorphEngine(containerRef.current, {
      items,
      startIndex,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      options: { duration, intensity, scale, aberration, drift },
      onIndexChange: (nextIndex) => {
        setIndex(nextIndex);
        onIndexChange?.(nextIndex);
      },
    });
    engineRef.current = engine;
    return () => engine.destroy();
  }, [aberration, drift, duration, intensity, items, onIndexChange, scale, startIndex]);

  useEffect(() => {
    if (!autoplay || hovering) return undefined;
    const timer = window.setTimeout(next, Math.max(autoplayDelay, 1) * 1000);
    return () => window.clearTimeout(timer);
  }, [autoplay, autoplayDelay, hovering, index, next]);

  return (
    <div
      className={`morph-slider ${className}`.trim()}
      style={{ borderRadius: `${radius}px` }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div ref={containerRef} className="morph-slider-stage" aria-hidden="true" />
      <div className="morph-slider-caption" aria-live="polite">
        <span>{items[index]?.caption}</span>
      </div>
      <button type="button" className="morph-slider-btn morph-slider-next" aria-label="切换下一个视频预览" onClick={next}>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="morph-slider-indicators" aria-label="视频预览进度">
        {items.map((item, itemIndex) => <span key={item.image} className={itemIndex === index ? 'is-active' : ''} />)}
      </div>
    </div>
  );
}
