/** Selected work: four video slots; scrolls sideways on desktop, swipes on phones. */
import { gsap } from 'gsap';
import { VIDEOS } from '../content.js';
import { $, $$, prefersReducedMotion } from '../lib/dom.js';
import { mountVideoSlot } from './videoSlot.js';

export function renderWork() {
  mountVideoSlot($('[data-video="showreel"]'), VIDEOS.showreel, 'motion');

  $('[data-render="work"]').innerHTML = VIDEOS.work
    .map(
      (video, i) => `
    <article class="work-card work-card--${video.kind}">
      <div class="work-card__media"><div class="video-slot" data-work="${i}"></div></div>
      <div class="work-card__meta"><b>${video.title}</b><span class="label">${video.tag}</span></div>
    </article>`,
    )
    .join('');

  $$('[data-work]').forEach((el) => {
    const video = VIDEOS.work[Number(el.dataset.work)];
    mountVideoSlot(el, video, video.kind);
  });
}

export function initWorkScroll() {
  if (prefersReducedMotion) return;
  gsap.matchMedia().add('(min-width: 961px)', () => {
    const track = $('.work__track');
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
    gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: '.work',
        pin: '.work__pin',
        start: 'top top',
        end: () => '+=' + distance(),
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
  });
}
