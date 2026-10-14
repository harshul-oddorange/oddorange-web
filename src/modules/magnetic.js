/** Magnetic buttons (desktop only): buttons lean slightly toward the cursor, then spring back. */
import { gsap } from 'gsap';
import { $$, hasFinePointer, prefersReducedMotion } from '../lib/dom.js';

export function initMagneticButtons() {
  if (!hasFinePointer || prefersReducedMotion) return;
  $$('.btn').forEach((button) => {
    button.classList.add('is-magnetic');
    const moveX = gsap.quickTo(button, 'x', { duration: 0.4, ease: 'power3.out' });
    const moveY = gsap.quickTo(button, 'y', { duration: 0.4, ease: 'power3.out' });
    button.addEventListener('pointermove', (event) => {
      const box = button.getBoundingClientRect();
      moveX((event.clientX - (box.left + box.width / 2)) * 0.22);
      moveY((event.clientY - (box.top + box.height / 2)) * 0.32);
    });
    button.addEventListener('pointerleave', () => {
      gsap.to(button, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    });
  });
}
