/** Email links, booking and LinkedIn links, social icons and the copyright year. */
import { SITE } from '../content.js';
import { $, $$ } from '../lib/dom.js';
import { ICONS } from '../lib/icons.js';

const SOCIALS = [
  ['Instagram', 'instagram'],
  ['LinkedIn', 'linkedin'],
  ['X', 'x'],
  ['YouTube', 'youtube'],
];

const icon = (key) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[key]}"/></svg>`;

export function renderContactLinks() {
  $$('[data-email]').forEach((link) => {
    link.href = `mailto:${SITE.email}`;
    link.textContent = SITE.email;
  });
  $$('[data-booking]').forEach((link) => {
    link.href = SITE.booking;
  });
  $$('[data-founder-linkedin]').forEach((link) => {
    link.href = SITE.founderLinkedin;
  });
  $$('[data-social]').forEach((link) => {
    link.href = SITE.socials[link.dataset.social];
  });
  $$('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  const items = SOCIALS.map(([name, key]) => {
    const url = SITE.socials[key];
    return url
      ? `<li><a href="${url}" target="_blank" rel="noopener">${icon(key)}<span>${name}</span></a></li>`
      : `<li><span class="socials__soon" title="Coming soon">${icon(key)}<span>${name}</span></span></li>`;
  });
  items.push(`<li><a href="mailto:${SITE.email}">${icon('email')}<span>Email</span></a></li>`);
  $('[data-render="socials"]').innerHTML = items.join('');
}
