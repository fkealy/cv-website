// Dark and inverted themes. Dark is the default and the brand; the full
// stops in the hero and the topbar logo are the switches. The new theme
// grows out of the clicked full stop as a square (View Transitions), and
// swaps instantly without motion or API support.
import { reduceMotion } from './v2';

const KEY = 'fk-theme';

export const isInverted = () => document.documentElement.dataset.theme === 'inverted';

function apply(inverted: boolean) {
  const root = document.documentElement;
  if (inverted) root.dataset.theme = 'inverted';
  else delete root.dataset.theme;
  try {
    localStorage.setItem(KEY, inverted ? 'inverted' : 'dark');
  } catch {
    // Private mode or blocked storage: the switch still works for this visit.
  }
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', inverted ? '#f5b942' : '#0a0a0e');
  document.dispatchEvent(new CustomEvent('fk:theme'));
}

// The button's box is the whole line height; the portal should open from
// the ink of the full stop itself, which sits on the baseline.
function glyphRect(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  const ctx = document.createElement('canvas').getContext('2d')!;
  ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  const m = ctx.measureText(el.textContent || '.');
  const lineHeight = parseFloat(cs.lineHeight) || r.height;
  const baseline =
    r.top + (lineHeight - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent;
  return {
    top: baseline - m.actualBoundingBoxAscent,
    bottom: baseline + m.actualBoundingBoxDescent,
    left: r.left - m.actualBoundingBoxLeft,
    right: r.left + m.actualBoundingBoxRight,
  };
}

export function initThemeToggle() {
  const buttons = document.querySelectorAll<HTMLElement>('[data-theme-toggle]');
  const label = () =>
    buttons.forEach((b) =>
      b.setAttribute('aria-label', isInverted() ? 'Switch back to the dark colours' : 'Invert the colours'),
    );
  label();

  buttons.forEach((btn) => btn.addEventListener('click', async () => {
    const inverted = !isInverted();
    if (reduceMotion || !document.startViewTransition) {
      apply(inverted);
      label();
      return;
    }
    const g = glyphRect(btn);
    // Rendering is paused inside this callback, so don't wait on a frame;
    // the wave redraws synchronously on 'fk:theme' before the snapshot.
    const transition = document.startViewTransition(() => {
      apply(inverted);
      label();
    });
    await transition.ready;
    const w = window.innerWidth;
    const h = window.innerHeight;
    document.documentElement.animate(
      {
        clipPath: [
          `inset(${g.top}px ${w - g.right}px ${h - g.bottom}px ${g.left}px)`,
          'inset(0px 0px 0px 0px)',
        ],
      },
      {
        duration: 900,
        easing: 'cubic-bezier(0.7, 0, 0.2, 1)',
        pseudoElement: '::view-transition-new(root)',
      },
    );
  }));
}
