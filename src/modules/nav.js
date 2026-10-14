/** Header: hides on scroll down, shows on scroll up; mobile menu toggle. */
import { $, $$ } from '../lib/dom.js';
import { onScroll, pauseScroll, scrollToSection } from './smoothScroll.js';

export function initNav() {
  const nav = $('.site-nav');
  const toggle = $('.site-nav__toggle');
  const menu = $('#mobile-menu');
  let lastY = 0;

  onScroll((y) => {
    nav.classList.toggle('is-scrolled', y > 40);
    nav.classList.toggle('is-hidden', y > lastY && y > 400 && menu.hidden);
    lastY = y;
  });

  const setMenuOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
    pauseScroll(open);
    if (open) $('a', menu).focus();
  };

  toggle.addEventListener('click', () => setMenuOpen(menu.hidden));
  $$('a', menu).forEach((link) =>
    link.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      setMenuOpen(false);
      scrollToSection(link.getAttribute('href'));
    }),
  );
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) {
      setMenuOpen(false);
      toggle.focus();
    }
  });
}
