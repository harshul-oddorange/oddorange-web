/*
 * Runs in <head>, before the first paint (the content policy blocks inline scripts, so it is a file).
 * .js keeps the hero hidden until its reveal animation takes over, so it never shows twice.
 * .no-intro skips the logo sting on repeat visits and for reduced motion without flashing it first.
 */
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  try {
    if (sessionStorage.getItem('oo-intro') || matchMedia('(prefers-reduced-motion: reduce)').matches)
      root.classList.add('no-intro');
  } catch (e) {
    /* storage unavailable: the intro module decides */
  }
})();
