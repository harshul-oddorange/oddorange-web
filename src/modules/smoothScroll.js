/** Smooth scrolling (Lenis) wired into GSAP's ScrollTrigger. Disabled for reduced motion. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { $, prefersReducedMotion } from '../lib/dom.js';

let lenis = null;

export function initSmoothScroll() {
  if (!prefersReducedMotion) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  // In-page links glide to their section.
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href');
    if (id.length < 2 || !$(id)) return;
    event.preventDefault();
    scrollToSection(id);
  });
  return lenis;
}

export function scrollToSection(selector) {
  const target = $(selector);
  if (!target) return;
  if (lenis) lenis.scrollTo(target, { offset: selector === '#top' ? 0 : -10 });
  else target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
}

export function pauseScroll(paused) {
  if (!lenis) return;
  if (paused) lenis.stop();
  else lenis.start();
}

export function onScroll(callback) {
  if (lenis) lenis.on('scroll', (e) => callback(e.scroll));
  else window.addEventListener('scroll', () => callback(window.scrollY), { passive: true });
}
