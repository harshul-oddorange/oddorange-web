/**
 * Pricing: one full-width row per service category. A category with one package shows a single
 * wide card (price, what's included, sample side by side); Standard and Premium sit next to each other.
 * Each package shows its price, comparison meters, what's included and a sample slot.
 * The ₹ / $ switch sits in each row head; either one changes every price on the page
 * (both rows, the "What we make" cards and the enquiry form).
 */
import { gsap } from 'gsap';
import { PRICING_NOTES, SERVICES } from '../content.js';
import { $, $$, formatPrice, prefersReducedMotion } from '../lib/dom.js';
import { mountVideoSlot } from './videoSlot.js';

const meter = (label, score) => `
  <div class="meter">
    <span>${label}</span>
    <span class="meter__dots" role="img" aria-label="${score} out of 3">${[1, 2, 3].map((n) => `<i class="${n <= score ? 'on' : ''}"></i>`).join('')}</span>
  </div>`;

const currencyToggle = () => `
  <div class="toggle" role="group" aria-label="Currency">
    <button type="button" data-currency="inr" aria-pressed="true">₹ INR</button>
    <button type="button" data-currency="usd" aria-pressed="false">$ USD</button>
  </div>`;

/** Any element with data-prices='{"inr":…,"usd":…}' follows the currency switch. */
export const priceAttr = (price) => `data-prices='${JSON.stringify(price)}'`;

const tierKeyOf = (pkg) => pkg.key || pkg.tier.toLowerCase();
const isRange = (price) => Array.isArray(price.inr);

function packageCard(service, pkg) {
  const tierKey = tierKeyOf(pkg);
  // A column with a single package gets the Premium look.
  const premium = tierKey === 'premium' || service.packages.length === 1;
  const orangeSurface = premium && service.accent === 'orange' ? ' data-surface="orange"' : '';
  const range = isRange(pkg.price);
  return `
    <article class="package package--${tierKey}${premium && tierKey !== 'premium' ? ' package--premium' : ''} package--${service.accent} package--${service.key}"${orangeSurface}>
      <div class="package__main">
        <div class="package__top">
          <h4 class="package__tier">${pkg.tier}</h4>
          <span class="tag">${pkg.revisions}</span>
        </div>
        <p class="package__promise">${pkg.promise}</p>
        <div class="package__price">
          <span class="package__from">${range ? 'Depends on the edit' : 'Starting at'}</span>
          <span class="package__amount${range ? ' package__amount--range' : ''}" ${priceAttr(pkg.price)}>${formatPrice(pkg.price.inr)}</span>
          <span class="package__per">${pkg.per} · up to 60 s</span>
        </div>
        ${pkg.meters ? `<div class="meters">${service.meterLabels.map((label, i) => meter(label, pkg.meters[i])).join('')}</div>` : ''}
      </div>
      <div class="package__details">
        <p class="package__list-title">What's included</p>
        <ul>${pkg.includes.map((item) => `<li>${item}</li>`).join('')}</ul>
        <p class="package__best"><b>Good for:</b> ${pkg.bestFor}</p>
      </div>
      <a class="btn btn--ink package__cta" href="#contact" data-service="${service.key}-${tierKey}">Choose ${service.packages.length === 1 ? 'this package' : pkg.tier}</a>
      <div class="package__sample">
        <div class="video-slot video-slot--small" data-sample="${service.key}-${tierKey}"></div>
        <span class="package__sample-label">${pkg.tier} sample</span>
      </div>
    </article>`;
}

function paymentBlock(service) {
  const [first, second] = service.payment;
  return `
    <div class="payment">
      <p class="label payment__label">How payment works</p>
      <div class="payment__steps">
        <div class="payment__step"><span class="payment__pct">${first.pct}%</span><span>${first.label}</span></div>
        <span class="payment__arrow" aria-hidden="true">→</span>
        <div class="payment__step"><span class="payment__pct">${second.pct}%</span><span>${second.label}</span></div>
      </div>
    </div>`;
}

export function renderPricing() {
  $('[data-render="pricing"]').innerHTML = SERVICES.map(
    (service) => `
    <div class="price-col price-col--${service.accent}" data-service-col="${service.key}">
      <div class="price-col__head">
        <h3 class="price-col__title">${service.title}</h3>
        ${currencyToggle()}
        <p class="price-col__note">${service.note}</p>
      </div>
      <div class="price-col__packages price-col__packages--${service.packages.length === 1 ? 'single' : 'pair'}">
        ${service.packages.map((pkg) => packageCard(service, pkg)).join('')}
      </div>
      <div class="price-col__foot">
        ${paymentBlock(service)}
        <p class="price-col__custom">${service.custom}${service.changeNote ? ' ' + service.changeNote : ''}</p>
      </div>
    </div>`,
  ).join('');

  $('[data-render="not-included"]').textContent =
    `${PRICING_NOTES.taxes} ${PRICING_NOTES.notIncluded} ${PRICING_NOTES.revisions}`;

  // sample videos inside each package
  SERVICES.forEach((service) =>
    service.packages.forEach((pkg) => {
      const tierKey = tierKeyOf(pkg);
      mountVideoSlot(
        $(`[data-sample="${service.key}-${tierKey}"]`),
        { id: '', title: `${pkg.tier} sample`, ...pkg.sample },
        service.sampleKind,
        { lightbox: true },
      );
    }),
  );

  renderFormOptions();
  bindCurrencyToggles();
  bindPlanPicker();
}

/** The enquiry form's package options, with prices from content.js. */
function renderFormOptions() {
  const anchor = $('#f-service option[value="monthly"]');
  if (!anchor) return;
  SERVICES.forEach((service) =>
    service.packages.forEach((pkg) => {
      const option = document.createElement('option');
      option.value = `${service.key}-${tierKeyOf(pkg)}`;
      option.dataset.prices = JSON.stringify(pkg.price);
      const name = service.packages.length === 1 ? service.short : `${service.short} · ${pkg.tier}`;
      option.dataset.template = `${name} (${isRange(pkg.price) ? '' : 'from '}{price})`;
      option.textContent = option.dataset.template.replace('{price}', formatPrice(pkg.price.inr));
      anchor.before(option);
    }),
  );
}

function bindCurrencyToggles() {
  $$('[data-currency]').forEach((button) =>
    button.addEventListener('click', () => setCurrency(button.dataset.currency)),
  );
}

function setCurrency(currency) {
  $$('[data-currency]').forEach((b) =>
    b.setAttribute('aria-pressed', String(b.dataset.currency === currency)),
  );
  $$('[data-prices]').forEach((el) => {
    const price = formatPrice(JSON.parse(el.dataset.prices)[currency], currency);
    const text = el.dataset.template ? el.dataset.template.replace('{price}', price) : price;
    if (el.textContent === text) return;
    el.textContent = text;
    if (!prefersReducedMotion && el.classList.contains('package__amount'))
      gsap.fromTo(
        el,
        { yPercent: 30, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.5, ease: 'expo.out' },
      );
  });
}

/** "Choose Standard/Premium" and "Ask for a custom package" pre-select the service in the form. */
function bindPlanPicker() {
  document.addEventListener('click', (event) => {
    const picker = event.target.closest('[data-service]');
    if (!picker) return;
    const select = $('#f-service');
    if (select) select.value = picker.dataset.service;
  });
}
