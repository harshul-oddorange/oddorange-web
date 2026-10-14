/**
 * Hero dot pattern: a faint grid behind the headline, right under the navigation.
 * Dots ripple away from the cursor; one orange "odd one" sits near the top right.
 */
import { $, COLORS, fitCanvas, prefersReducedMotion, watchVisibility } from '../lib/dom.js';
import { pointer } from '../lib/pointer.js';

const FAINT_INK = 'rgba(26, 23, 20, 0.17)';

export function initDotField() {
  const canvas = $('.dot-field');
  const ctx = canvas.getContext('2d');
  let size = { width: 0, height: 0 };
  let dots = [];
  let running = false;
  const start = performance.now();

  function layout() {
    size = fitCanvas(canvas, ctx);
    const gap = size.width < 600 ? 26 : 34;
    const radius = size.width < 600 ? 3 : 3.5;
    const cols = Math.floor(size.width / gap);
    const rows = Math.max(3, Math.floor(size.height / gap));
    const offsetX = (size.width - (cols - 1) * gap) / 2;
    const offsetY = (size.height - (rows - 1) * gap) / 2;
    const oddCol = Math.round(cols * 0.62);
    const oddRow = Math.min(2, rows - 1);
    dots = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const isOdd = c === oddCol && r === oddRow;
        const hx = offsetX + c * gap;
        const hy = offsetY + r * gap;
        dots.push({ hx, hy, x: hx, y: hy, vx: 0, vy: 0, r: isOdd ? radius * 2.4 : radius, isOdd });
      }
    }
    if (!running) draw(performance.now(), true);
  }

  function draw(now, once = false) {
    ctx.clearRect(0, 0, size.width, size.height);
    const rect = canvas.getBoundingClientRect();
    const mx = pointer.x - rect.left;
    const my = pointer.y - rect.top;
    const reach = size.width < 600 ? 80 : 130;
    const t = (now - start) / 1000;

    for (const d of dots) {
      let fx = (d.hx - d.x) * 0.06;
      let fy = (d.hy - d.y) * 0.06;
      if (!prefersReducedMotion) {
        const dx = d.x - mx;
        const dy = d.y - my;
        const dist = Math.hypot(dx, dy);
        if (dist < reach && dist > 0.01) {
          const push = (1 - dist / reach) * 6;
          fx += (dx / dist) * push;
          fy += (dy / dist) * push;
        }
        // a gentle idle wave so the field feels alive on touch screens
        fy += Math.sin(t * 1.6 - d.hx * 0.015) * 0.06;
      }
      d.vx = (d.vx + fx) * 0.78;
      d.vy = (d.vy + fy) * 0.78;
      d.x += d.vx;
      d.y += d.vy;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = d.isOdd ? COLORS.orange : FAINT_INK;
      ctx.fill();
    }
    if (!once && running) requestAnimationFrame((n) => draw(n));
  }

  layout();
  new ResizeObserver(layout).observe(canvas);
  if (prefersReducedMotion) return;
  watchVisibility(
    canvas,
    () => {
      if (!running) {
        running = true;
        requestAnimationFrame((n) => draw(n));
      }
    },
    () => {
      running = false;
    },
  );
}
