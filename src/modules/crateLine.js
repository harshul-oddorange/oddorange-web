/**
 * Separator: the orange ball rolls along the line of dots as the line scrolls past.
 * Works for horizontal lines and for .crate-line--vertical (which turns horizontal on phones).
 */
import { gsap } from 'gsap';
import { $$, prefersReducedMotion } from '../lib/dom.js';

export function initCrateLines() {
  $$('.crate-line').forEach((line) => {
    const ball = line.querySelector('.crate-line__ball');
    const isVertical = () => line.clientHeight > line.clientWidth;
    const travelX = () => (isVertical() ? 0 : line.clientWidth - ball.offsetWidth);
    const travelY = () => (isVertical() ? line.clientHeight - ball.offsetHeight : 0);
    if (prefersReducedMotion) {
      gsap.set(ball, { x: () => travelX() * 0.72, y: () => travelY() * 0.72 });
      return;
    }
    gsap.fromTo(
      ball,
      { x: 0, y: 0 },
      {
        x: travelX,
        y: travelY,
        ease: 'none',
        scrollTrigger: {
          trigger: line,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      },
    );
  });
}
