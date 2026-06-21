/* Fallbakit pitch deck — vanilla slide controller */
(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const total = slides.length;
  const dotsWrap = document.getElementById('dots');
  const bar = document.getElementById('progressBar');
  const curNum = document.getElementById('curNum');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // dots
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

  // intro / how-to modal
  const modal = document.getElementById('introModal');
  const SEEN = 'fbk-pitch-help-seen';
  const modalOpen = () => !modal.hidden;
  const openHelp = () => { modal.hidden = false; };
  const closeHelp = () => { modal.hidden = true; try { localStorage.setItem(SEEN, '1'); } catch (e) {} };
  document.getElementById('modalStart').addEventListener('click', closeHelp);
  document.getElementById('helpBtn').addEventListener('click', openHelp);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeHelp(); });

  // keyboard
  addEventListener('keydown', (e) => {
    if (modalOpen()) { e.preventDefault(); closeHelp(); return; }
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
    if (x0 === null || modalOpen()) { x0 = null; return; }
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

  // share (last slide)
  const ogUrl = document.querySelector('meta[property="og:url"]');
  const canonical = (ogUrl && ogUrl.content) || (location.origin + location.pathname);
  const shareText = 'Fallbakit — cut the cost of AI inference. Run models on hardware you already own.';
  const enc = encodeURIComponent;
  const setHref = (id, href) => { const el = document.getElementById(id); if (el) el.href = href; };
  setHref('shX', `https://twitter.com/intent/tweet?text=${enc(shareText)}&url=${enc(canonical)}`);
  setHref('shIn', `https://www.linkedin.com/sharing/share-offsite/?url=${enc(canonical)}`);
  setHref('shWa', `https://wa.me/?text=${enc(shareText + ' ' + canonical)}`);
  const nativeBtn = document.getElementById('shareNative');
  if (nativeBtn && navigator.share) {
    nativeBtn.hidden = false;
    nativeBtn.addEventListener('click', () => navigator.share({ title: document.title, text: shareText, url: canonical }).catch(() => {}));
  }
  const copyBtn = document.getElementById('shCopy');
  const toast = document.getElementById('shareToast');
  if (copyBtn) copyBtn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(canonical); }
    catch (e) {
      const t = document.createElement('textarea'); t.value = canonical;
      document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); } catch (e2) {}
      t.remove();
    }
    if (toast) { toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 1600); }
  });

  if (reduce) document.querySelectorAll('svg').forEach((s) => s.pauseAnimations && s.pauseAnimations());

  go(fromHash());

  // show the how-to modal on first visit
  let seen = false;
  try { seen = !!localStorage.getItem(SEEN); } catch (e) {}
  if (!seen) openHelp();
})();
