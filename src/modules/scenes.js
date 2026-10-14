/** Scroll scenes: hero reveal, showreel growth, idea words filling in, headline reveals, monthly card fan. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { $, $$, prefersReducedMotion } from '../lib/dom.js';

function heroReveal() {
  gsap.from('.hero__title .line__in', { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.1 });
  gsap.from('.hero__meta, .hero__foot, .dot-field', {
    y: 20,
    opacity: 0,
    duration: 0.9,
    ease: 'expo.out',
    delay: 0.25,
    stagger: 0.08,
  });
  gsap.from('.odd-badge', { scale: 0, rotate: -90, duration: 1, ease: 'back.out(1.8)', delay: 0.45 });
}

function showreel() {
  const mm = gsap.matchMedia();
  mm.add('(min-width: 601px)', () => {
    gsap
      .timeline({
        scrollTrigger: { trigger: '.showreel', start: 'top top', end: 'bottom bottom', scrub: true },
      })
      .fromTo('.showreel__frame', { scale: 0.42 }, { scale: 1, ease: 'none' }, 0)
      .to('.showreel__word--left', { xPercent: -60, opacity: 0, ease: 'none' }, 0.35)
      .to('.showreel__word--right', { xPercent: 60, opacity: 0, ease: 'none' }, 0.35);
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

function monthlyFan() {
  const stack = $('.monthly__stack');
  stack.innerHTML = ['Reel 04', 'Reel 03', 'Reel 02', 'Reel 01']
    .map((t) => `<div class="monthly__card">${t}</div>`)
    .join('');
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
  heroReveal();
  showreel();
  ideaWords();
  headlineReveals();
}
