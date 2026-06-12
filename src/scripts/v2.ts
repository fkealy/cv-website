// Shared behavior for the v2 pages: WebGL backdrop, custom cursor,
// auto-hiding topbar, and text splitting for GSAP reveals.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// ?static skips all animation — used for testing, same path as reduced motion
export const reduceMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
  new URLSearchParams(window.location.search).has('static');
export const isMobile = window.matchMedia('(max-width: 760px)').matches;
export const finePointer = window.matchMedia('(pointer: fine)').matches;

export function initGL({ amp = 1.0, calmOnScroll = '' } = {}) {
  const canvas = document.getElementById('gl') as HTMLCanvasElement | null;
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 4.2, 11);
  camera.lookAt(0, 0, 0);

  const COLS = isMobile ? 80 : 140;
  const ROWS = isMobile ? 50 : 90;
  const SPACING = 0.42;
  const count = COLS * ROWS;
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);

  let i = 0;
  for (let x = 0; x < COLS; x++) {
    for (let z = 0; z < ROWS; z++) {
      positions[i * 3] = (x - COLS / 2) * SPACING;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = (z - ROWS / 2) * SPACING;
      seeds[i] = Math.random();
      i++;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uAmp: { value: amp },
      uPixelRatio: { value: renderer.getPixelRatio() },
    },
    vertexShader: /* glsl */ `
      uniform float uTime;
      uniform float uAmp;
      uniform float uPixelRatio;
      attribute float aSeed;
      varying float vElev;
      varying float vSeed;
      void main() {
        vec3 p = position;
        float wave1 = sin(p.x * 0.55 + uTime * 0.7) * cos(p.z * 0.45 + uTime * 0.55);
        float wave2 = sin(p.x * 0.18 - uTime * 0.35) * 1.6;
        float wave3 = sin((p.x + p.z) * 0.9 + uTime * 1.1) * 0.18;
        p.y = (wave1 * 0.55 + wave2 * 0.35 + wave3) * uAmp;
        vElev = p.y;
        vSeed = aSeed;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = (1.6 + aSeed * 1.8) * uPixelRatio * (8.0 / -mv.z);
      }
    `,
    fragmentShader: /* glsl */ `
      varying float vElev;
      varying float vSeed;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        if (d > 0.5) discard;
        float glow = smoothstep(0.5, 0.0, d);
        vec3 deep = vec3(0.16, 0.20, 0.38);
        vec3 amber = vec3(0.96, 0.73, 0.26);
        vec3 col = mix(deep, amber, smoothstep(-0.4, 1.2, vElev) * (0.35 + vSeed * 0.65));
        gl_FragColor = vec4(col, glow * 0.85);
      }
    `,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // Mouse parallax
  const target = { x: 0, y: 0 };
  if (finePointer) {
    window.addEventListener('pointermove', (e) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  // Calm the wave as you scroll past the given section
  if (calmOnScroll && document.querySelector(calmOnScroll)) {
    ScrollTrigger.create({
      trigger: calmOnScroll,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        material.uniforms.uAmp.value = amp * (1.0 - self.progress * 0.7);
        points.position.y = -self.progress * 2.5;
      },
    });
  }

  const t0 = performance.now();
  let rafId = 0;
  let visible = true;

  function tick() {
    const t = (performance.now() - t0) / 1000;
    material.uniforms.uTime.value = reduceMotion ? 0 : t;
    camera.position.x += (target.x * 0.9 - camera.position.x) * 0.04;
    camera.position.y += (4.2 - target.y * 0.6 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    if (visible && !reduceMotion) rafId = requestAnimationFrame(tick);
  }
  tick();
  if (reduceMotion) renderer.render(scene, camera);

  document.addEventListener('visibilitychange', () => {
    visible = document.visibilityState === 'visible';
    if (visible && !reduceMotion) {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(tick);
    }
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    material.uniforms.uPixelRatio.value = renderer.getPixelRatio();
  });
}

export function splitChars(el: Element) {
  const text = el.textContent ?? '';
  el.textContent = '';
  const frag = document.createDocumentFragment();
  for (const ch of text) {
    const span = document.createElement('span');
    span.textContent = ch;
    span.style.display = 'inline-block';
    span.style.willChange = 'transform';
    frag.appendChild(span);
  }
  el.appendChild(frag);
  return Array.from(el.children);
}

export function initCursor() {
  if (!finePointer || reduceMotion) return;
  const cursor = document.querySelector('.cursor') as HTMLElement | null;
  if (!cursor) return;
  const setX = gsap.quickTo(cursor, 'x', { duration: 0.18, ease: 'power3.out' });
  const setY = gsap.quickTo(cursor, 'y', { duration: 0.18, ease: 'power3.out' });
  window.addEventListener('pointermove', (e) => {
    setX(e.clientX);
    setY(e.clientY);
  }, { passive: true });
  document.querySelectorAll('[data-hover]').forEach((el) => {
    el.addEventListener('pointerenter', () => cursor.classList.add('is-hover'));
    el.addEventListener('pointerleave', () => cursor.classList.remove('is-hover'));
  });

  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const mx = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    const my = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });
    el.addEventListener('pointermove', (e) => {
      const r = (el as HTMLElement).getBoundingClientRect();
      mx(((e as PointerEvent).clientX - r.left - r.width / 2) * 0.18);
      my(((e as PointerEvent).clientY - r.top - r.height / 2) * 0.3);
    });
    el.addEventListener('pointerleave', () => { mx(0); my(0); });
  });
}

// Hide topbar on scroll down, reveal on scroll up, to keep it from
// sitting on top of section text mid-page.
export function initTopbar() {
  const bar = document.querySelector('.topbar');
  if (!bar) return;
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    bar.classList.toggle('is-hidden', y > lastY && y > 120);
    lastY = y;
  }, { passive: true });
}
