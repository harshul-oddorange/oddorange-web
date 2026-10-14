/** Small shared helpers used across modules. */

export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

export const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/** Brand colours for canvas drawing (CSS uses the tokens in styles/tokens.css). */
export const COLORS = {
  orange: '#FF6D1F',
  lemon: '#FFD84A',
  leaf: '#3FCB7E',
  cream: '#FFFAF2',
  ink: '#1A1714',
};

/** ₹5,000 / $50 style price labels. */
export function formatPrice(amount, currency = 'inr') {
  return currency === 'usd' ? '$' + amount.toLocaleString('en-US') : '₹' + amount.toLocaleString('en-IN');
}

/** sessionStorage that never throws (private mode, blocked storage). */
export const session = {
  get(key) {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      sessionStorage.setItem(key, value);
    } catch {
      /* storage unavailable */
    }
  },
};

/** Run `onVisible`/`onHidden` as an element enters and leaves the viewport. */
export function watchVisibility(el, onVisible, onHidden = () => {}, threshold = 0) {
  const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? onVisible() : onHidden()), {
    threshold,
  });
  io.observe(el);
  return io;
}

/** Size a canvas to its CSS box at device pixel ratio; returns { width, height }. */
export function fitCanvas(canvas, ctx) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { width, height };
}
