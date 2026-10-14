/** Process: one column per service, with an orange/green ball rolling down the steps as you scroll. */
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SERVICES } from '../content.js';
import { $, $$, prefersReducedMotion } from '../lib/dom.js';

const ACCENTS = { orange: 'var(--orange)', leaf: 'var(--leaf)' };

export function renderProcess() {
  $('[data-render="process"]').innerHTML = SERVICES.map((service) => {
    const [first, second] = service.payment;
    return `
      <div class="process-col" style="--accent: ${ACCENTS[service.accent]}">
        <h3 class="process-col__title">${service.title}</h3>
        <div class="process-col__body">
          <div class="process-rail" aria-hidden="true"><span class="process-rail__ball"></span></div>
          <ol class="steps">
            ${service.steps
              .map(
                ([title, text], i) => `
              <li class="step">
                <span class="step__num">0${i + 1}</span>
                <div><h4>${title}</h4><p>${text}</p></div>
              </li>`,
              )
              .join('')}
          </ol>
        </div>
        <p class="process-col__pay"><b>Payment:</b> ${first.pct}% ${first.label.toLowerCase()}, then ${second.pct}% ${second.label.toLowerCase()}.${service.changeNote ? ' ' + service.changeNote : ''}</p>
      </div>`;
  }).join('');
}

export function initProcessRails() {
  $$('.process-col').forEach((column) => {
    const body = $('.process-col__body', column);
    const steps = $$('.step', column);
    const setProgress = (progress) => {
      body.style.setProperty('--fill', (progress * 100).toFixed(2) + '%');
      const active = Math.min(steps.length - 1, Math.floor(progress * steps.length * 0.999));
      steps.forEach((step, i) => step.classList.toggle('is-active', i === active));
    };
    if (prefersReducedMotion) {
      setProgress(1);
      return;
    }
    setProgress(0);
    ScrollTrigger.create({
      trigger: body,
      start: 'top 70%',
      end: 'bottom 55%',
      scrub: true,
      onUpdate: (self) => setProgress(self.progress),
    });
  });
}
