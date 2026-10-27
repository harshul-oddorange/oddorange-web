/** Scenes: hero reveal, showreel growth, idea words filling in, headline reveals, monthly card fan. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { $, $$, prefersReducedMotion } from '../lib/dom.js';

/**
 * Hero reveal, built paused before the intro so the hero waits in its start pose under the intro curtain.
 * Play it as the curtain lifts. Returns null with reduced motion (the hero just shows).
 */
export function createHeroReveal() {
  const root = document.documentElement;
  if (prefersReducedMotion) {
    root.classList.add('hero-ready');
    return null;
  }
  const tl = gsap
    .timeline({ paused: true })
    .from('.hero__title .line__in', { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.1 }, 0)
    .from(
      '.hero__meta, .hero__foot, .dot-field',
      { y: 20, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08 },
      0.25,
    )
    .from('.odd-badge', { scale: 0, rotate: -90, duration: 1, ease: 'back.out(1.8)' }, 0.45);
  root.classList.add('hero-ready');
  return tl;
}

function showreel() {
  const mm = gsap.matchMedia();
  mm.add('(min-width: 601px)', () => {
    gsap
      .timeline({
        scrollTrigger: { trigger: '.showreel', start: 'top top', end: 'bottom bottom', scrub: true },
      })
      .fromTo('.showreel__frame', { scale: 0.42 }, { scale: 1, ease: 'none', duration: 1 }, 0)
      // the words clear out before the growing frame reaches them, so they never sit on the footage
      .to('.showreel__word--left', { xPercent: -60, opacity: 0, ease: 'power1.in', duration: 0.22 }, 0)
      .to('.showreel__word--right', { xPercent: 60, opacity: 0, ease: 'power1.in', duration: 0.22 }, 0);
  });
  mm.add('(max-width: 600px)', () => {
    gsap.fromTo(
      '.showreel__frame',
      { scale: 0.7 },
      {
        scale: 1,
        ease: 'none',
        scrollTrigger: { trigger: '.showreel', start: 'top top', end: 'bottom bottom', scrub: true },
      },
    );
  });
}

/** Wrap each word of the idea sentence so words can light up one by one. */
function ideaWords() {
  const text = $('.idea__text');
  text.innerHTML = text.innerHTML.replace(
    /(<em[^>]*>.*?<\/em>)|([^\s<]+)/g,
    (match, em, word) => `<span class="word">${em || word}</span>`,
  );
  const words = $$('.word', text);
  ScrollTrigger.create({
    trigger: text,
    start: 'top 80%',
    end: 'bottom 50%',
    scrub: true,
    onUpdate: (self) => {
      const lit = Math.round(self.progress * words.length);
      words.forEach((w, i) => w.classList.toggle('is-on', i < lit));
    },
  });
}

function headlineReveals() {
  $$('.section-title, .monthly__title, .contact__title').forEach((el) =>
    gsap.from(el, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    }),
  );
  $$('.service-card, .package, .process-col').forEach((el) =>
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 0.9,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
    }),
  );
}

/** Our four latest Instagram Reel covers (marketing/covers), newest on top. */
const MONTHLY_COVERS = ['07-flowpilot', '08-window', '09-breakdown', '10-showreel'];

function monthlyFan() {
  const stack = $('.monthly__stack');
  stack.innerHTML = MONTHLY_COVERS.map(
    (name) =>
      `<div class="monthly__card"><img src="/img/covers/${name}.webp" alt="" width="432" height="768" loading="lazy" decoding="async"></div>`,
  ).join('');
  const cards = $$('.monthly__card', stack);
  gsap.set(cards, { xPercent: -50, yPercent: -50 });
  if (prefersReducedMotion) {
    gsap.set(cards, { rotation: (i) => (i - 1.5) * 12, x: (i) => (i - 1.5) * 60 });
    return;
  }
  gsap
    .timeline({ scrollTrigger: { trigger: '.monthly', start: 'top 75%', end: 'center 45%', scrub: true } })
    .fromTo(
      cards,
      { rotation: 0, x: 0 },
      {
        rotation: (i) => (i - 1.5) * 12,
        x: (i) => (i - 1.5) * 60,
        y: (i) => Math.abs(i - 1.5) * 12,
        ease: 'none',
      },
    );
}

export function initScenes() {
  monthlyFan();
  if (prefersReducedMotion) {
    $$('.word').forEach((w) => w.classList.add('is-on'));
    return;
  }
  showreel();
  ideaWords();
  headlineReveals();
}
