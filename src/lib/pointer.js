/** Live pointer position shared by the cursor, dot field and ball pit. */
export const pointer = { x: -9999, y: -9999, active: false };

window.addEventListener(
  'pointermove',
  (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
  },
  { passive: true },
);
