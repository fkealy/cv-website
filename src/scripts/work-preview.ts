// Selected-work previews: the screenshots are drawn on WebGL planes with a
// signal-tuning shader. Opening a row wipes the shot in through static with
// a burst of slice/RGB glitch, the cursor smears pixels as it crosses the
// image, and the phone shot tilts in 3D. Hovering a closed row peels a strip
// of its screenshot open inside the row, right to left, and it stays put.
//
// The <img> tags stay in the markup as the fallback; when this module takes
// over they are hidden and only used as texture sources.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { reduceMotion, finePointer } from './v2';

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D uTex;
  uniform float uTime;
  uniform float uReveal;   // 0 = static, 1 = clean picture
  uniform float uGlitch;   // burst strength
  uniform float uHover;    // pointer over the plane
  uniform vec2 uMouse;     // pointer in plane uv
  uniform vec2 uVel;       // pointer velocity in uv, smoothed
  uniform float uAspect;   // plane width / height
  uniform float uSeed;
  uniform vec2 uPx;        // one css pixel in uv
  uniform float uAxis;     // 0 = wipe top to bottom, 1 = wipe right to left
  uniform float uFade;     // torn left edge: how far in the tear reaches, in uv
  uniform vec2 uUvScale;   // cover-fit of the texture onto the plane
  uniform vec2 uUvOffset;
  varying vec2 vUv;

  const vec3 ACCENT = vec3(0.961, 0.725, 0.259);

  float hash(float n) { return fract(sin(n) * 43758.5453123); }
  float hash2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

  void main() {
    vec2 uv = vUv;
    float t = uTime;
    float rv = uReveal;
    float revealing = step(0.001, 1.0 - rv);

    // The wipe runs top to bottom (plane uv has y = 1 at the top), or
    // right to left for the row strips.
    float row = mix(1.0 - uv.y, 1.0 - uv.x, uAxis);
    float edge = rv * 1.12 - 0.06;
    float shown = step(row, edge);
    float nearEdge = (1.0 - smoothstep(0.0, 0.16, edge - row)) * revealing;

    // Torn left edge (row strips): each band tears at its own place and
    // jitters, instead of a clean gradient. Heavier glitch just inside it.
    float tearOn = step(0.001, uFade);
    float eb = floor(vUv.y * 22.0);
    float ef = floor(t * 9.0);
    float tear = uFade * (0.25 + 0.75 * hash(eb * 5.3 + ef * 0.37 + uSeed)) * tearOn;
    float edgeMask = step(tear, vUv.x);
    float fringe = (1.0 - smoothstep(tear, tear + 0.06, vUv.x)) * edgeMask * tearOn;

    float g = clamp(uGlitch + nearEdge * 0.7 + fringe * 0.9, 0.0, 1.0);

    // Hover: a gentle push-in and parallax so the shot feels held, not printed.
    vec2 c = vec2(0.5);
    uv = c + (uv - c) * (1.0 - 0.035 * uHover);
    uv += (uMouse - c) * vec2(0.02, 0.014) * uHover;

    // The cursor drags pixels with it; the smear follows its velocity.
    vec2 d = (uv - uMouse) * vec2(uAspect, 1.0);
    float dist = length(d);
    float infl = exp(-dist * dist * 26.0) * uHover;
    uv -= uVel * infl * 1.6;

    // Horizontal slices that jump at a stuttery 14fps.
    float frame = floor(t * 14.0);
    float bands = 16.0 + 32.0 * g;
    float band = floor(uv.y * bands);
    float on = step(1.0 - g * 0.55, hash(band * 3.7 + frame * 0.13 + uSeed));
    uv.x += (hash(band * 9.1 + frame + uSeed) - 0.5) * 0.3 * g * on;

    // Now and then a block of the picture jumps out of place.
    float blockOn = step(0.9, hash(frame * 0.71 + uSeed)) * g;
    vec2 blk = floor(uv * vec2(6.0, 4.0));
    float bj = step(0.72, hash2(blk + frame)) * blockOn;
    uv.x += (hash2(blk * 1.3 + frame) - 0.5) * 0.14 * bj;
    uv.y += (hash2(blk * 2.1 + frame) - 0.5) * 0.06 * bj;

    // RGB split: a whisper on hover, a shout while glitching.
    float split = 0.0025 * uHover + 0.04 * g * g + infl * 0.014;
    vec2 sdir = vec2(1.0, 0.18 * sin(t * 0.7));
    vec2 tuv = clamp(uv, 0.0, 1.0) * uUvScale + uUvOffset;
    vec2 tsplit = sdir * split * uUvScale;
    float r = texture2D(uTex, tuv + tsplit).r;
    float gc = texture2D(uTex, tuv).g;
    float b = texture2D(uTex, tuv - tsplit).b;
    vec3 col = vec3(r, gc, b);

    // Below the scan edge the picture hasn't tuned in yet: dim static.
    float noise = hash2(floor(vUv * vec2(320.0, 200.0)) + frame);
    vec3 stat = vec3(noise) * 0.12 + vec3(0.04, 0.04, 0.06);
    col = mix(stat, col, shown);

    // Amber scan edge.
    float scan = exp(-abs(row - edge) * 80.0) * revealing;
    col += ACCENT * scan * 1.1;

    // Faint scanlines and grain, heavier while glitching.
    col *= 1.0 - 0.045 * (0.5 + 0.5 * sin(vUv.y * 700.0)) * (0.35 + g);
    col += (hash2(vUv * 1000.0 + fract(t)) - 0.5) * (0.025 + 0.12 * g);

    // One-pixel frame in the site's line colour.
    float bx = step(vUv.x, uPx.x) + step(1.0 - uPx.x, vUv.x);
    float by = step(vUv.y, uPx.y) + step(1.0 - uPx.y, vUv.y);
    col = mix(col, vec3(0.93, 0.92, 0.9), 0.22 * clamp(bx + by, 0.0, 1.0));

    gl_FragColor = vec4(col, smoothstep(0.0, 0.06, rv) * edgeMask);
  }
`;

function webglOK() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

// ---------- textures ----------
const loader = new THREE.TextureLoader();
const texCache = new Map<string, Promise<THREE.Texture>>();
function loadTexture(src: string) {
  let p = texCache.get(src);
  if (!p) {
    p = new Promise<THREE.Texture>((resolve, reject) => {
      loader.load(
        src,
        (tex) => {
          tex.minFilter = THREE.LinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.generateMipmaps = false;
          resolve(tex);
        },
        undefined,
        reject,
      );
    });
    texCache.set(src, p);
  }
  return p;
}

// ---------- a screenshot plane ----------
class Shot {
  mesh: THREE.Mesh;
  u: Record<string, THREE.IUniform>;
  w = 1;
  h = 1;
  rect = new DOMRect();
  // pointer state, smoothed in update()
  hoverTarget = 0;
  mouseTarget = new THREE.Vector2(0.5, 0.5);
  lastMouse = new THREE.Vector2(0.5, 0.5);
  vel = new THREE.Vector2();
  rotTarget = new THREE.Vector2();
  rotIdle = 0;

  constructor() {
    this.u = {
      uTex: { value: null },
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uGlitch: { value: 0 },
      uHover: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uVel: { value: new THREE.Vector2() },
      uAspect: { value: 1.6 },
      uSeed: { value: Math.random() * 100 },
      uPx: { value: new THREE.Vector2(0.002, 0.003) },
      uAxis: { value: 0 },
      uFade: { value: 0 },
      uUvScale: { value: new THREE.Vector2(1, 1) },
      uUvOffset: { value: new THREE.Vector2(0, 0) },
    };
    const mat = new THREE.ShaderMaterial({
      uniforms: this.u,
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
    this.mesh.visible = false;
  }

  setTexture(tex: THREE.Texture) {
    this.u.uTex.value = tex;
    this.mesh.visible = true;
  }

  // Size in css pixels; position is the plane's centre in scene units
  // (scene origin = canvas centre, y up).
  layout(x: number, y: number, w: number, h: number) {
    this.w = w;
    this.h = h;
    this.mesh.scale.set(w, h, 1);
    this.mesh.position.set(x, y, 0);
    this.u.uAspect.value = w / h;
    (this.u.uPx.value as THREE.Vector2).set(1 / w, 1 / h);
  }

  // Cover-fit the texture on the plane, anchored to the top of the picture
  // so a short strip shows the top of the site rather than its middle.
  cover(texAspect: number) {
    const planeAspect = this.w / this.h;
    const sc = this.u.uUvScale.value as THREE.Vector2;
    const off = this.u.uUvOffset.value as THREE.Vector2;
    if (planeAspect > texAspect) {
      sc.set(1, texAspect / planeAspect);
      off.set(0, 1 - sc.y);
    } else {
      sc.set(planeAspect / texAspect, 1);
      off.set((1 - sc.x) / 2, 0);
    }
  }

  pointer(clientX: number, clientY: number) {
    const r = this.rect;
    this.mouseTarget.set((clientX - r.left) / r.width, 1 - (clientY - r.top) / r.height);
  }

  burst(amount = 0.8, duration = 0.7) {
    gsap.killTweensOf(this.u.uGlitch);
    this.u.uGlitch.value = amount;
    gsap.to(this.u.uGlitch, { value: 0, duration, ease: 'expo.out' });
  }

  update(t: number) {
    const u = this.u;
    u.uTime.value = t;
    u.uHover.value += (this.hoverTarget - u.uHover.value) * 0.08;
    const m = u.uMouse.value as THREE.Vector2;
    m.lerp(this.mouseTarget, 0.22);
    // velocity of the smoothed pointer, decays when it stops
    const v = u.uVel.value as THREE.Vector2;
    this.vel.set(m.x - this.lastMouse.x, m.y - this.lastMouse.y);
    this.lastMouse.copy(m);
    v.lerp(this.vel, 0.35);
    v.multiplyScalar(0.94);
  }
}

// ---------- a canvas with a pixel-true perspective camera ----------
class Stage {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera;
  canvas: HTMLCanvasElement;
  w = 1;
  h = 1;
  fov = 26;
  active = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.camera = new THREE.PerspectiveCamera(this.fov, 1, 1, 6000);
  }

  resize(w: number, h: number) {
    if (w < 1 || h < 1) return;
    this.w = w;
    this.h = h;
    this.renderer.setSize(w, h, false);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.camera.aspect = w / h;
    // Distance at which one scene unit is one css pixel on the z=0 plane.
    this.camera.position.z = h / 2 / Math.tan(THREE.MathUtils.degToRad(this.fov / 2));
    this.camera.updateProjectionMatrix();
  }

  // DOM rect -> scene centre, relative to the canvas rect
  toScene(r: DOMRect) {
    const cr = this.canvas.getBoundingClientRect();
    return {
      x: r.left - cr.left + r.width / 2 - cr.width / 2,
      y: cr.height / 2 - (r.top - cr.top + r.height / 2),
    };
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}

// ---------- the open-panel preview ----------
function initPanel(rows: HTMLElement[]) {
  const canvas = document.createElement('canvas');
  canvas.className = 'work-gl';
  canvas.setAttribute('aria-hidden', 'true');
  const stage = new Stage(canvas);
  const desk = new Shot();
  const mob = new Shot();
  stage.scene.add(desk.mesh, mob.mesh);

  let current: HTMLElement | null = null;
  let flickerTimer = 0;
  const ro = new ResizeObserver(() => layout());

  function shotEls(row: HTMLElement) {
    return {
      host: row.querySelector<HTMLElement>('.work-shots')!,
      d: row.querySelector<HTMLElement>('.shot-desktop')!,
      m: row.querySelector<HTMLElement>('.shot-mobile')!,
    };
  }

  function layout() {
    if (!current) return;
    const { host, d, m } = shotEls(current);
    const hr = host.getBoundingClientRect();
    const bleed = parseFloat(getComputedStyle(host).getPropertyValue('--bleed')) || 16;
    stage.resize(Math.round(hr.width + bleed * 2), Math.round(hr.height + bleed * 2));
    const dr = d.getBoundingClientRect();
    desk.rect = dr;
    const dp = stage.toScene(dr);
    desk.layout(dp.x, dp.y, dr.width, dr.height);
    const mr = m.getBoundingClientRect();
    mob.rect = mr;
    const mp = stage.toScene(mr);
    mob.layout(mp.x, mp.y, mr.width, mr.height);
    mob.mesh.visible = mr.width > 0 && !!mob.u.uTex.value;
  }

  function scheduleFlicker() {
    clearTimeout(flickerTimer);
    flickerTimer = window.setTimeout(() => {
      if (!current) return;
      desk.burst(0.5, 0.3);
      if (Math.random() > 0.5) mob.burst(0.35, 0.25);
      scheduleFlicker();
    }, 3500 + Math.random() * 4000);
  }

  async function open(row: HTMLElement) {
    current = row;
    const { host, d, m } = shotEls(row);
    host.appendChild(canvas);
    ro.disconnect();
    ro.observe(host);
    desk.u.uReveal.value = 0;
    mob.u.uReveal.value = 0;
    desk.mesh.visible = false;
    mob.mesh.visible = false;
    stage.active = true;
    layout();

    const [dt, mt] = await Promise.all([
      loadTexture(d.dataset.src!),
      loadTexture(m.dataset.src!),
    ]);
    if (current !== row) return;
    desk.setTexture(dt);
    mob.setTexture(mt);
    layout();

    gsap.killTweensOf([desk.u.uReveal, mob.u.uReveal, mob.mesh.position, mob.mesh.rotation]);
    desk.burst(0.9, 1.1);
    gsap.to(desk.u.uReveal, { value: 1, duration: 1.15, ease: 'power2.inOut', delay: 0.05 });
    mob.burst(0.7, 1.0);
    gsap.to(mob.u.uReveal, { value: 1, duration: 1.0, ease: 'power2.inOut', delay: 0.32 });
    gsap.fromTo(mob.mesh.position, { y: mob.mesh.position.y - 36 }, { y: mob.mesh.position.y, duration: 1.3, ease: 'expo.out', delay: 0.3 });
    mob.rotTarget.set(0, 0);
    gsap.fromTo(mob.mesh.rotation, { y: 0.55, x: 0.12 }, { y: 0, x: 0, duration: 1.4, ease: 'expo.out', delay: 0.3 });
    scheduleFlicker();
  }

  function close(row: HTMLElement) {
    if (current !== row) return;
    clearTimeout(flickerTimer);
    desk.burst(1, 0.4);
    mob.burst(1, 0.4);
    gsap.to([desk.u.uReveal, mob.u.uReveal], { value: 0, duration: 0.32, ease: 'power2.in' });
    const closing = row;
    setTimeout(() => {
      if (current === closing) {
        current = null;
        stage.active = false;
        ro.disconnect();
      }
    }, 380);
  }

  // Pointer over the shots: smear + tilt.
  function bind(row: HTMLElement) {
    const { host, d, m } = shotEls(row);
    const inside = (r: DOMRect, x: number, y: number, pad = 0) =>
      x > r.left - pad && x < r.right + pad && y > r.top - pad && y < r.bottom + pad;
    host.addEventListener('pointermove', (e) => {
      if (current !== row) return;
      const { clientX: x, clientY: y } = e;
      desk.rect = d.getBoundingClientRect();
      mob.rect = m.getBoundingClientRect();
      desk.pointer(x, y);
      mob.pointer(x, y);
      const touch = e.pointerType === 'touch';
      desk.hoverTarget = inside(desk.rect, x, y) && (!touch || e.buttons > 0) ? 1 : 0;
      mob.hoverTarget = inside(mob.rect, x, y) ? 1 : 0;
      // the phone leans towards the cursor anywhere over the shots
      const hr = host.getBoundingClientRect();
      const nx = (x - hr.left) / hr.width - 0.5;
      const ny = (y - hr.top) / hr.height - 0.5;
      mob.rotTarget.set(nx * 0.55, -ny * 0.3);
    }, { passive: true });
    host.addEventListener('pointerleave', () => {
      desk.hoverTarget = 0;
      mob.hoverTarget = 0;
      mob.rotTarget.set(0, 0);
    });
    host.addEventListener('pointerup', () => { desk.hoverTarget = 0; });
    host.addEventListener('pointercancel', () => { desk.hoverTarget = 0; });
  }
  rows.forEach(bind);

  function tick(t: number) {
    if (!stage.active) return;
    desk.update(t);
    mob.update(t);
    // 3D lean on the phone: pointer target plus a slow idle sway
    if (!gsap.isTweening(mob.mesh.rotation)) {
      const r = mob.mesh.rotation;
      r.y += (mob.rotTarget.x + Math.sin(t * 0.7) * 0.05 - r.y) * 0.06;
      r.x += (mob.rotTarget.y + Math.cos(t * 0.5) * 0.02 - r.x) * 0.06;
    }
    stage.render();
  }

  // Warm the textures on hover so the open is instant.
  function preload(row: HTMLElement) {
    const { d, m } = shotEls(row);
    loadTexture(d.dataset.src!);
    loadTexture(m.dataset.src!);
  }

  return { open, close, tick, preload };
}

// ---------- the strip that peels open inside a hovered row ----------
// Two stages alternate so the row you're leaving can fade while the next
// one opens.
function initStrips(rows: HTMLElement[], isOpen: (row: HTMLElement) => boolean) {
  const BLEED = 8;
  const make = () => {
    const canvas = document.createElement('canvas');
    canvas.className = 'work-strip';
    canvas.setAttribute('aria-hidden', 'true');
    const stage = new Stage(canvas);
    const shot = new Shot();
    shot.u.uAxis.value = 1;
    shot.u.uFade.value = 0.3;
    stage.scene.add(shot.mesh);
    return { canvas, stage, shot, row: null as HTMLElement | null };
  };
  const slots = [make(), make()];
  let next = 0;
  let current: ReturnType<typeof make> | null = null;

  // The strip runs from just after the title and blurb to the row's right
  // edge, so it reads as coming in from the edge of the page.
  function box(row: HTMLElement) {
    const link = row.querySelector<HTMLElement>('.work-link')!;
    const lr = link.getBoundingClientRect();
    const textRight = Math.max(
      ...Array.from(row.querySelectorAll<HTMLElement>('.work-title, .work-blurb'), (el) => {
        // the spans are block-level, so measure the text itself
        const range = document.createRange();
        range.selectNodeContents(el);
        return range.getBoundingClientRect().right;
      }),
    );
    const left = Math.max(lr.left + lr.width * 0.42, textRight + 28);
    return new DOMRect(left, lr.top, Math.max(0, lr.right - left), lr.height);
  }

  function layout(slot: ReturnType<typeof make>) {
    if (!slot.row) return;
    const b = box(slot.row);
    const rr = slot.row.getBoundingClientRect();
    slot.canvas.style.left = `${b.left - rr.left - BLEED}px`;
    slot.canvas.style.top = `${b.top - rr.top - BLEED}px`;
    slot.stage.resize(Math.round(b.width + BLEED * 2), Math.round(b.height + BLEED * 2));
    slot.shot.layout(0, 0, b.width, b.height);
    slot.shot.rect = b;
    const tex = slot.shot.u.uTex.value as THREE.Texture | null;
    if (tex?.image) slot.shot.cover(tex.image.width / tex.image.height);
  }

  async function show(row: HTMLElement) {
    if (isOpen(row)) return;
    if (current?.row === row) return;
    if (current) hide(current);
    const slot = slots[next];
    next = 1 - next;
    slot.row = row;
    row.appendChild(slot.canvas);
    current = slot;
    const src = row.querySelector<HTMLElement>('.shot-desktop')!.dataset.src!;
    slot.shot.mesh.visible = false;
    slot.shot.u.uReveal.value = 0;
    slot.stage.active = true;
    layout(slot);
    const tex = await loadTexture(src);
    if (slot.row !== row || current !== slot) return;
    slot.shot.setTexture(tex);
    layout(slot);
    gsap.killTweensOf(slot.shot.u.uReveal);
    slot.shot.burst(0.7, 0.55);
    gsap.to(slot.shot.u.uReveal, { value: 1, duration: 0.65, ease: 'power3.out' });
  }

  function hide(slot: ReturnType<typeof make>) {
    const row = slot.row;
    if (!row) return;
    if (current === slot) current = null;
    gsap.killTweensOf(slot.shot.u.uReveal);
    slot.shot.burst(0.5, 0.3);
    gsap.to(slot.shot.u.uReveal, {
      value: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        if (slot.row !== row || current === slot) return;
        slot.stage.active = false;
        slot.stage.renderer.clear();
        slot.canvas.remove();
        slot.row = null;
      },
    });
  }

  rows.forEach((row) => {
    const link = row.querySelector<HTMLElement>('.work-link')!;
    link.addEventListener('pointerenter', () => show(row));
    link.addEventListener('pointerleave', () => { if (current?.row === row) hide(current); });
    link.addEventListener('pointermove', (e) => {
      if (current?.row !== row) return;
      const s = current.shot;
      s.pointer(e.clientX, e.clientY);
      const r = s.rect;
      s.hoverTarget = e.clientX > r.left && e.clientX < r.right ? 0.5 : 0;
    }, { passive: true });
  });
  window.addEventListener('resize', () => slots.forEach(layout));

  function tick(t: number) {
    for (const slot of slots) {
      if (!slot.stage.active) continue;
      slot.shot.update(t);
      slot.stage.render();
    }
  }

  function hideRow(row: HTMLElement) {
    if (current?.row === row) hide(current);
  }

  return { tick, hideRow };
}

export function initWorkList() {
  const list = document.querySelector<HTMLElement>('.work-list');
  if (!list) return;
  const rows = Array.from(list.querySelectorAll<HTMLElement>('.work-row'));
  const gl = !reduceMotion && webglOK();
  document.documentElement.classList.toggle('no-motion', reduceMotion);
  document.documentElement.classList.toggle('has-work-gl', gl);

  const panel = gl ? initPanel(rows) : null;
  const strips = gl && finePointer ? initStrips(rows, (row) => row.classList.contains('is-open')) : null;

  const isOpen = (row: HTMLElement) => row.classList.contains('is-open');
  const setOpen = (row: HTMLElement, open: boolean) => {
    row.classList.toggle('is-open', open);
    row.querySelector('.work-toggle')?.setAttribute('aria-expanded', String(open));
    if (open) panel?.open(row);
    else panel?.close(row);
  };

  rows.forEach((row) => {
    const btn = row.querySelector<HTMLElement>('.work-toggle')!;
    btn.addEventListener('pointerenter', () => panel?.preload(row));
    btn.addEventListener('click', () => {
      const wasOpen = isOpen(row);
      rows.forEach((r) => { if (isOpen(r)) setOpen(r, false); });
      if (!wasOpen) {
        setOpen(row, true);
        strips?.hideRow(row);
      }
      // The page height changes under the scroll triggers.
      setTimeout(() => ScrollTrigger.refresh(), 600);
    });
  });

  if (gl) {
    const t0 = performance.now();
    gsap.ticker.add(() => {
      const t = (performance.now() - t0) / 1000;
      panel?.tick(t);
      strips?.tick(t);
    });
  }
}
