/**
 * Intro: the logo sting (S3b). All-black crate, the top-right dot turns orange, pops out,
 * bounces on two top dots and curves into the middle. Plays once per visit.
 * `onReveal` runs as the curtain starts to lift (or at once when the intro is skipped), so the
 * page's first animation plays while it is being uncovered, not after.
 */
import { gsap } from 'gsap';
import { $, COLORS, prefersReducedMotion, session } from '../lib/dom.js';

const NS = 'http://www.w3.org/2000/svg';
const DOT_POSITIONS = [
  [14, 14],
  [40, 14],
  [66, 14],
  [14, 40],
  [66, 40],
  [14, 66],
  [40, 66],
  [66, 66],
];
const TOP_RIGHT = 2;

function circle(svg, cx, cy, r, fill) {
  const c = document.createElementNS(NS, 'circle');
  c.setAttribute('cx', cx);
  c.setAttribute('cy', cy);
  c.setAttribute('r', r);
  c.setAttribute('fill', fill);
  svg.appendChild(c);
  return c;
}

export function playIntro(onReveal = () => {}) {
  const overlay = $('.intro');
  if (prefersReducedMotion || session.get('oo-intro')) {
    document.documentElement.classList.add('no-intro');
    onReveal();
    return Promise.resolve();
  }
  session.set('oo-intro', '1');

  const svg = $('.intro__mark');
  const dots = DOT_POSITIONS.map(([x, y]) => circle(svg, x, y, 8.5, COLORS.ink));
  const refill = circle(svg, 66, 14, 8.5, COLORS.ink);
  const orange = circle(svg, 40, 40, 8.5, COLORS.ink);
  dots[TOP_RIGHT].style.opacity = 0;
  gsap.set([...dots, refill], { scale: 0, transformOrigin: 'center center' });
  gsap.set(orange, { x: 26, y: -26, scale: 0, transformOrigin: 'center center' });

  return new Promise((resolve) => {
    const tl = gsap.timeline({ onComplete: resolve });

    // 1. All black
    tl.to(
      [0, 1, 3, 5, 6, 4, 7].map((i) => dots[i]),
      { scale: 1, duration: 0.38, ease: 'back.out(2.2)', stagger: 0.035 },
      0.05,
    )
      .to(orange, { scale: 1, duration: 0.38, ease: 'back.out(2.2)' }, 0.12)
      // 2. The odd one appears
      .to(orange, { attr: { r: 12, fill: COLORS.orange }, duration: 0.28, ease: 'back.out(3)' }, 0.55)
      // 3. Pop out, the gap refills
      .to(orange, { scaleX: 1.16, scaleY: 0.84, duration: 0.1, transformOrigin: '50% 100%' }, 0.82)
      .to(refill, { scale: 1, duration: 0.36, ease: 'back.out(2.4)' }, 1.0);

    // 4. Bounce on the top-middle and top-left dots
    let t = 0.92;
    let from = { x: 26, y: -26 };
    for (const [cx, cy, index, duration, lift] of [
      [40, 14, 1, 0.3, 20],
      [14, 14, 0, 0.26, 14],
    ]) {
      const to = { x: cx - 40, y: cy - 40 - 20.5 };
      const peak = { x: (from.x + to.x) / 2, y: Math.min(from.y, to.y) - lift };
      tl.to(
        orange,
        {
          duration,
          ease: 'none',
          scaleX: 0.92,
          scaleY: 1.08,
          motionPath: { path: [from, peak, to], curviness: 1.3 },
        },
        t,
      )
        .to(orange, { scaleX: 1.2, scaleY: 0.82, duration: 0.06, transformOrigin: '50% 100%' }, t + duration)
        .to(orange, { scaleX: 1, scaleY: 1, duration: 0.1 }, t + duration + 0.06)
        .to(
          dots[index],
          {
            keyframes: [
              { y: 3.5, duration: 0.08 },
              { y: 0, duration: 0.3, ease: 'back.out(2)' },
            ],
          },
          t + duration,
        );
      from = to;
      t += duration + 0.08;
    }

    // 5. Curve into the middle and land
    tl.to(
      orange,
      {
        duration: 0.65,
        ease: 'power2.inOut',
        scaleX: 0.92,
        scaleY: 1.08,
        motionPath: {
          path: [from, { x: -40, y: -62 }, { x: -52, y: -36 }, { x: -30, y: -6 }, { x: 0, y: 0 }],
          curviness: 1.3,
        },
      },
      t + 0.06,
    );
    const land = t + 0.71;
    tl.to(
      orange,
      { scaleX: 1.26, scaleY: 0.76, duration: 0.09, ease: 'power2.out', transformOrigin: '50% 100%' },
      land,
    )
      .to(orange, { scaleX: 1, scaleY: 1, duration: 0.4, ease: 'back.out(2)' }, land + 0.09)
      .to(
        [...dots.filter((_, i) => i !== TOP_RIGHT), refill],
        {
          keyframes: [
            { scale: 0.86, duration: 0.1 },
            { scale: 1, duration: 0.3, ease: 'back.out(1.8)' },
          ],
          stagger: 0.02,
        },
        land + 0.02,
      )
      // 6. The name wipes in as one piece (no per-letter movement, so no jitter)
      .to('.intro__word', { clipPath: 'inset(0 0% 0 0)', duration: 0.7, ease: 'expo.inOut' }, land + 0.35)
      .to(overlay, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, land + 1.25)
      // the hero rises while the curtain is still moving off it
      .add(onReveal, land + 1.5)
      .add(() => overlay.classList.add('is-done'), land + 1.3);
  });
}
