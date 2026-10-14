/** Enquiry form: inline validation, then posts to Netlify Forms. Falls back to email on failure. */
import { SITE } from '../content.js';
import { $, $$ } from '../lib/dom.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function fieldError(input) {
  if (input.type === 'checkbox') return input.checked ? '' : 'Please tick this box so we can reply.';
  if (!input.value.trim()) return 'Please fill this in.';
  if (input.type === 'email' && !EMAIL_PATTERN.test(input.value)) return 'Please enter a valid email.';
  return '';
}

export function initForm() {
  const form = $('.form');
  const status = $('.form__status', form);
  const setStatus = (message, kind = '') => {
    status.textContent = message;
    status.className = `form__status ${kind}`;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    $$('.field__error', form).forEach((el) => el.remove());

    let firstInvalid = null;
    for (const input of $$('[required]', form)) {
      const message = fieldError(input);
      if (message) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
      if (message) {
        const error = document.createElement('span');
        error.className = 'field__error';
        error.textContent = message;
        input.closest('.field').appendChild(error);
        firstInvalid ??= input;
      }
    }
    if (firstInvalid) {
      firstInvalid.focus();
      setStatus('Please check the highlighted fields.', 'is-error');
      return;
    }

    const submit = $('.form__submit', form);
    submit.disabled = true;
    setStatus('Sending…');
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString(),
      });
      if (!response.ok) throw new Error(String(response.status));
      form.reset();
      setStatus("Thanks! Your enquiry is in. We'll get back to you soon.", 'is-ok');
    } catch {
      setStatus(`Couldn't send right now. Please email ${SITE.email} instead.`, 'is-error');
    } finally {
      submit.disabled = false;
    }
  });
}
