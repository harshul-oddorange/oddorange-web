/**
 * Odd Orange website — entry point.
 * Content lives in content.js; each feature is a module in ./modules.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import './lib/pointer.js';

import { initSmoothScroll } from './modules/smoothScroll.js';
import { initNav } from './modules/nav.js';
import { initCursor } from './modules/cursor.js';
import { playIntro } from './modules/intro.js';
import { initDotField } from './modules/dotField.js';
import { initCrateLines } from './modules/crateLine.js';
import { renderServices } from './modules/services.js';
import { renderWork, initWorkScroll } from './modules/work.js';
import { renderPricing } from './modules/pricing.js';
import { renderTestimonials } from './modules/testimonials.js';
import { renderProcess, initProcessRails } from './modules/process.js';
import { createHeroReveal, initScenes } from './modules/scenes.js';
import { initBallPit } from './modules/ballPit.js';
import { initForm } from './modules/form.js';
import { initMagneticButtons } from './modules/magnetic.js';
import { renderContactLinks } from './modules/contactLinks.js';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// 1. Content
renderContactLinks();
renderServices();
renderWork();
renderTestimonials();
renderPricing();
renderProcess();
initForm();

// 2. Interaction
initSmoothScroll();
initNav();
initCursor();
initDotField();

// 3. Motion: the hero waits under the intro and rises as it lifts; the rest starts once it has gone
const heroReveal = createHeroReveal();
playIntro(() => heroReveal?.play()).then(() => {
  initScenes();
  initCrateLines();
  initWorkScroll();
  initProcessRails();
  initBallPit();
  initMagneticButtons();
  // Measure scroll animations top to bottom, so ones below the pinned Work rail include its extra scroll distance.
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
});
