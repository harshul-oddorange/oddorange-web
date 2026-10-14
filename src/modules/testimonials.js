/** Testimonials: rendered from content.js; the section stays hidden while the list is empty. */
import { TESTIMONIALS } from '../content.js';
import { $ } from '../lib/dom.js';

const escapeHtml = (text) =>
  String(text).replace(
    /[&<>"']/g,
    (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch],
  );

export function renderTestimonials() {
  const section = $('#testimonials');
  if (!section || TESTIMONIALS.length === 0) return;

  $('[data-render="testimonials"]', section).innerHTML = TESTIMONIALS.map((t) => {
    const who = [t.role, t.company].filter(Boolean).map(escapeHtml).join(', ');
    const photo = t.photo
      ? `<img class="quote-card__photo" src="${t.photo}" alt="" width="56" height="56" loading="lazy">`
      : '';
    const name = t.link
      ? `<a href="${t.link}" target="_blank" rel="noopener">${escapeHtml(t.name)}</a>`
      : escapeHtml(t.name);
    return `
      <figure class="quote-card">
        <blockquote class="quote-card__text">“${escapeHtml(t.quote)}”</blockquote>
        <figcaption class="quote-card__who">${photo}<span><b>${name}</b>${who ? `<span>${who}</span>` : ''}</span></figcaption>
      </figure>`;
  }).join('');
  section.hidden = false;
}
