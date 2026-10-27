/**
 * Video slot for YouTube videos, built for privacy:
 * nothing is requested from YouTube (not even the thumbnail) until the visitor presses play.
 * Before that it shows your own poster image (`poster` in content.js) or a branded placeholder.
 * Playback uses youtube-nocookie.com (YouTube's privacy-enhanced mode).
 * Big slots play in place; small ones (the pricing samples) open a full-size player overlay.
 */
import { COLORS, prefersReducedMotion, watchVisibility } from '../lib/dom.js';
import { ICONS, crateMark } from '../lib/icons.js';
import { pauseScroll } from './smoothScroll.js';

const playIcon = `<svg viewBox="0 0 28 32" aria-hidden="true"><path d="${ICONS.play}" fill="${COLORS.ink}"/></svg>`;

const embed = (video) =>
  `<iframe src="https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1" title="${video.title}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;

/**
 * @param {HTMLElement} el     container (.video-slot)
 * @param {{id: string, title: string, poster?: string}} video
 * @param {'reel'|'motion'} kind  9:16 for Reels, 16:9 for motion graphics
 * @param {{lightbox?: boolean}} [options]  open in the overlay player instead of in place
 */
export function mountVideoSlot(el, video, kind = 'motion', { lightbox = false } = {}) {
  el.style.aspectRatio = kind === 'reel' ? '9 / 16' : '16 / 9';

  if (!video.id) {
    el.innerHTML = `<div class="video-slot__soon">${crateMark()}<p class="label">${video.title} · coming soon</p></div>`;
    return;
  }

  el.dataset.cursor = 'play';
  el.classList.toggle('video-slot--image', !!video.poster);
  const poster = video.poster
    ? `<img class="video-slot__thumb" alt="" loading="lazy" decoding="async" src="${video.poster}">`
    : `<div class="video-slot__poster">${crateMark()}<p class="label">${video.title}</p></div>`;
  el.innerHTML = `
    ${poster}
    <button class="video-slot__play" aria-label="Play ${video.title} (loads YouTube)">${playIcon}</button>
    <p class="video-slot__note">Plays from YouTube</p>`;

  const preview = video.preview && !prefersReducedMotion ? mountPreview(el, video.preview) : null;

  if (lightbox) {
    el.addEventListener('click', () => openPlayer(video, kind));
    return;
  }
  el.addEventListener(
    'click',
    () => {
      preview?.disconnect();
      el.innerHTML = embed(video);
      delete el.dataset.cursor;
    },
    { once: true },
  );
}

/**
 * A silent, self-hosted loop over the poster (no YouTube request). It loads only when the slot
 * nears the screen, plays while visible and fades in once it has frames, so the poster shows until then.
 */
function mountPreview(el, src) {
  const video = document.createElement('video');
  video.className = 'video-slot__preview';
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'none';
  video.setAttribute('aria-hidden', 'true');
  video.addEventListener('playing', () => video.classList.add('is-playing'), { once: true });
  el.querySelector('.video-slot__play').before(video);
  return watchVisibility(
    el,
    () => {
      if (!video.src) video.src = src;
      video.play().catch(() => {});
    },
    () => video.pause(),
  );
}

/* Overlay player: one shared dialog, sized to the video's shape. */
let player = null;
let lastFocus = null;

function openPlayer(video, kind) {
  if (!player) {
    player = document.createElement('div');
    player.className = 'player';
    player.setAttribute('role', 'dialog');
    player.setAttribute('aria-modal', 'true');
    player.innerHTML = `
      <div class="player__frame"></div>
      <button class="player__close" type="button" aria-label="Close video">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>
      </button>`;
    player.addEventListener('click', (event) => {
      if (!event.target.closest('.player__frame')) closePlayer();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && player.classList.contains('is-open')) closePlayer();
    });
    document.body.append(player);
  }
  lastFocus = document.activeElement;
  player.setAttribute('aria-label', video.title);
  player.dataset.kind = kind;
  player.querySelector('.player__frame').innerHTML = embed(video);
  player.classList.add('is-open');
  document.documentElement.classList.add('has-player');
  pauseScroll(true);
  player.querySelector('.player__close').focus();
}

function closePlayer() {
  player.classList.remove('is-open');
  player.querySelector('.player__frame').innerHTML = '';
  document.documentElement.classList.remove('has-player');
  pauseScroll(false);
  lastFocus?.focus?.();
}
