/**
 * Ball pit at the bottom of the contact section: small balls fall in when it scrolls into view.
 * Desktop: drag and throw them, and they shy away from the cursor. Phones: tap to kick.
 * The physics pauses when off screen and when every ball is asleep.
 */
import Matter from 'matter-js';
import { $, COLORS, fitCanvas, hasFinePointer, prefersReducedMotion, watchVisibility } from '../lib/dom.js';
import { pointer } from '../lib/pointer.js';

const { Engine, Bodies, Body, Composite, Mouse, MouseConstraint, Sleeping } = Matter;

export function initBallPit() {
  const canvas = $('.ball-pit');
  const ctx = canvas.getContext('2d');
  const engine = Engine.create({ enableSleeping: true });
  let size = { width: 0, height: 0 };
  let walls = [];
  let balls = [];
  let dropped = false;
  let running = false;

  function buildWalls() {
    size = fitCanvas(canvas, ctx);
    Composite.remove(engine.world, walls);
    const t = 200;
    const { width: W, height: H } = size;
    walls = [
      Bodies.rectangle(W / 2, H + t / 2, W * 3, t, { isStatic: true }),
      Bodies.rectangle(-t / 2, 0, t, H * 6, { isStatic: true }),
      Bodies.rectangle(W + t / 2, 0, t, H * 6, { isStatic: true }),
    ];
    Composite.add(engine.world, walls);
  }

  function dropBalls() {
    if (dropped) return;
    dropped = true;
    const { width: W } = size;
    const radius = W < 600 ? 10 : Math.max(12, Math.min(17, W / 90));
    const count = Math.floor(W / (radius * 2.3)) * 2;
    const oddIndex = Math.floor(count * 0.62);
    for (let i = 0; i < count; i++) {
      const isOdd = i === oddIndex;
      const r = isOdd ? radius * 1.5 : radius * (0.8 + Math.random() * 0.4);
      const ball = Bodies.circle(W * (0.03 + Math.random() * 0.94), -30 - i * (W < 600 ? 22 : 12), r, {
        restitution: 0.4,
        friction: 0.03,
        frictionAir: 0.01,
        density: 0.002,
      });
      ball.look = {
        r,
        fill: isOdd ? COLORS.orange : i % 9 === 4 ? COLORS.leaf : i % 6 === 2 ? COLORS.cream : COLORS.ink,
      };
      balls.push(ball);
    }
    Composite.add(engine.world, balls);
  }

  function draw() {
    ctx.clearRect(0, 0, size.width, size.height);
    for (const ball of balls) {
      ctx.beginPath();
      ctx.arc(ball.position.x, ball.position.y, ball.look.r, 0, Math.PI * 2);
      ctx.fillStyle = ball.look.fill;
      ctx.fill();
      if (ball.look.fill !== COLORS.ink) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = COLORS.ink;
        ctx.stroke();
      }
    }
  }

  /** Balls near the cursor drift away a little. */
  function nudgeFromCursor() {
    if (!hasFinePointer || !pointer.active) return;
    const rect = canvas.getBoundingClientRect();
    const mx = pointer.x - rect.left;
    const my = pointer.y - rect.top;
    if (my < -40 || my > size.height + 40) return;
    for (const ball of balls) {
      const dx = ball.position.x - mx;
      const dy = ball.position.y - my;
      const dist = Math.hypot(dx, dy);
      if (dist < 70 && dist > 0.5) {
        Sleeping.set(ball, false);
        const strength = (1 - dist / 70) * 0.0009 * ball.mass;
        Body.applyForce(ball, ball.position, {
          x: (dx / dist) * strength,
          y: (dy / dist) * strength - 0.0004 * ball.mass,
        });
      }
    }
  }

  function tick() {
    if (!running) return;
    nudgeFromCursor();
    Engine.update(engine, 1000 / 60);
    draw();
    requestAnimationFrame(tick);
  }

  buildWalls();
  new ResizeObserver(buildWalls).observe(canvas);

  if (hasFinePointer) {
    const mouse = Mouse.create(canvas);
    // let the page keep scrolling while the cursor is over the canvas
    canvas.removeEventListener('wheel', mouse.mousewheel);
    canvas.removeEventListener('mousewheel', mouse.mousewheel);
    canvas.removeEventListener('DOMMouseScroll', mouse.mousewheel);
    Composite.add(
      engine.world,
      MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } }),
    );
  } else {
    canvas.addEventListener(
      'pointerdown',
      (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        for (const ball of balls) {
          if (Math.hypot(ball.position.x - x, ball.position.y - y) < ball.look.r * 3) {
            Sleeping.set(ball, false);
            Body.setVelocity(ball, { x: (ball.position.x - x) * 0.3, y: -9 });
          }
        }
      },
      { passive: true },
    );
  }

  if (prefersReducedMotion) {
    dropBalls();
    for (let i = 0; i < 600; i++) Engine.update(engine, 1000 / 60);
    draw();
    return;
  }

  watchVisibility(
    canvas,
    () => {
      dropBalls();
      if (!running) {
        running = true;
        requestAnimationFrame(tick);
      }
    },
    () => {
      running = false;
    },
  );
}
