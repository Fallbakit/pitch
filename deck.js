/* Fallbakit pitch deck — vanilla slide controller */
(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const total = slides.length;
  const dotsWrap = document.getElementById('dots');
  const bar = document.getElementById('progressBar');
  const curNum = document.getElementById('curNum');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // build dots
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Go to slide ${i + 1}`);
    b.addEventListener('click', () => go(i));
    dotsWrap.appendChild(b);
  });
  const dots = [...dotsWrap.children];

  let cur = -1;

  function go(i) {
    i = Math.max(0, Math.min(total - 1, i));
    if (i === cur) return;
    cur = i;

    slides.forEach((s, idx) => s.classList.toggle('is-active', idx === i));
    dots.forEach((d, idx) => d.classList.toggle('active', idx === i));

    // stagger entrance of revealable children
    if (!reduce) {
      slides[i].querySelectorAll('.reveal, .step').forEach((el, n) => {
        el.style.setProperty('--d', (n * 0.07 + 0.12).toFixed(2) + 's');
      });
    }

    bar.style.width = ((i + 1) / total) * 100 + '%';
    curNum.textContent = String(i + 1).padStart(2, '0');
    if (location.hash !== '#' + (i + 1)) history.replaceState(null, '', '#' + (i + 1));
  }

  const next = () => go(cur + 1);
  const prev = () => go(cur - 1);

  // keyboard
  addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowRight': case 'ArrowDown': case 'PageDown': case ' ': e.preventDefault(); next(); break;
      case 'ArrowLeft': case 'ArrowUp': case 'PageUp': e.preventDefault(); prev(); break;
      case 'Home': e.preventDefault(); go(0); break;
      case 'End': e.preventDefault(); go(total - 1); break;
      default:
        if (e.key >= '1' && e.key <= '9') go(+e.key - 1);
    }
  });

  // click zones
  document.getElementById('nextBtn').addEventListener('click', next);
  document.getElementById('prevBtn').addEventListener('click', prev);

  // touch swipe
  let x0 = null;
  addEventListener('touchstart', (e) => { x0 = e.changedTouches[0].clientX; }, { passive: true });
  addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
    x0 = null;
  }, { passive: true });

  // deep-link via hash
  const fromHash = () => {
    const n = parseInt(location.hash.slice(1), 10);
    return Number.isFinite(n) ? n - 1 : 0;
  };
  addEventListener('hashchange', () => go(fromHash()));

  // reduced motion: stop ambient SVG (SMIL) packets
  if (reduce) document.querySelectorAll('svg').forEach((s) => s.pauseAnimations && s.pauseAnimations());

  go(fromHash());
})();
