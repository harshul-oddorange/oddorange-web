/** Orange-dot cursor (desktop only). Grows over links, shows "Play" over videos, turns ink on orange. */
import { gsap } from 'gsap';
import { $, hasFinePointer } from '../lib/dom.js';

const ORANGE_SURFACES = '.btn--primary, [data-surface="orange"]';

export function initCursor() {
  if (!hasFinePointer) return;
  document.documentElement.classList.add('has-cursor');

  const cursor = $('.cursor');
  const label = $('.cursor__label');
  const moveX = gsap.quickTo(cursor, 'x', { duration: 0.18, ease: 'power3.out' });
  const moveY = gsap.quickTo(cursor, 'y', { duration: 0.18, ease: 'power3.out' });

  window.addEventListener(
    'pointermove',
    (e) => {
      moveX(e.clientX);
      moveY(e.clientY);
    },
    { passive: true },
  );

  document.addEventListener('pointerover', (event) => {
    const target = event.target;
    const isPlay = !!target.closest('[data-cursor="play"]');
    const isLink = !isPlay && !!target.closest('a, button, label, select');
    const isField = !!target.closest('input, textarea, select');
    cursor.classList.toggle('is-play', isPlay);
    cursor.classList.toggle('is-link', isLink);
    cursor.classList.toggle('is-ink', !!target.closest(ORANGE_SURFACES));
    cursor.classList.toggle('is-hidden', isField);
    label.textContent = isPlay ? 'Play' : '';
  });
  document.addEventListener('pointerleave', () => cursor.classList.add('is-hidden'));
  document.addEventListener('pointerenter', () => cursor.classList.remove('is-hidden'));
}
