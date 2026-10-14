/** "What we make": one card per service category, split by a vertical dotted separator. */
import { SERVICES } from '../content.js';
import { $, formatPrice } from '../lib/dom.js';
import { crateMark } from '../lib/icons.js';
import { priceAttr } from './pricing.js';

export function renderServices() {
  $('[data-render="services"]').innerHTML = SERVICES.map((service) => {
    const { price } = service.packages[0];
    return `
      <a class="service-card service-card--${service.accent}" href="#pricing">
        <div class="service-card__top">
          <div>
            <p class="label">${service.number}</p>
            <h3 class="service-card__title">${service.title}</h3>
          </div>
          ${crateMark('service-card__mark')}
        </div>
        <div class="service-card__body">
          <p class="service-card__summary">${service.summary}</p>
          <ul class="tag-list">${service.uses.map((use) => `<li class="tag">${use}</li>`).join('')}</ul>
          <div class="service-card__foot">
            <span class="service-card__from">From <span ${priceAttr(price)}>${formatPrice(price.inr)}</span></span>
            <span class="service-card__cta">See prices →</span>
          </div>
        </div>
      </a>`;
  }).join(
    '<div class="crate-line crate-line--vertical" aria-hidden="true"><span class="crate-line__ball"></span></div>',
  );
}
