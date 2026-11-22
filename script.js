(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* Nav */
  var toggle = $('#navToggle'), mob = $('#navMobile');
  function setNav(o) { mob.classList.toggle('is-open', o); toggle.setAttribute('aria-expanded', String(o)); toggle.setAttribute('aria-label', o ? 'Close menu' : 'Open menu'); }
  toggle.addEventListener('click', function () { setNav(!mob.classList.contains('is-open')); });
  $$('a', mob).forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });

  /* Scroll: progress bar + 3D tilt-in (cards swing up from a tilted plane) */
  var bar = $('#progress'), tilts = $$('.tilt3d'), ticking = false;
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function frame() {
    ticking = false;
    var h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? clamp(scrollY / h, 0, 1) : 0) + ')';
    if (reduce) return;
    var vh = innerHeight;
    tilts.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 300) return;
      /* t: 0 when element top is at 100% of viewport, 1 when at 62% */
      var t = clamp((vh - r.top) / (vh * 0.38), 0, 1);
      var e = 1 - Math.pow(1 - t, 3);
      el.style.setProperty('--rx', ((1 - e) * 16).toFixed(2) + 'deg');
      el.style.setProperty('--ty', ((1 - e) * 60).toFixed(1) + 'px');
      el.style.setProperty('--op', (0.15 + 0.85 * e).toFixed(2));
    });
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  frame();

  /* Count-up */
  function count(el) {
    var end = +el.dataset.count, suf = el.dataset.suffix || '';
    if (reduce) { el.textContent = end.toLocaleString() + suf; return; }
    var t0 = performance.now(), d = 1500;
    (function f(n) { var k = Math.min(1, (n - t0) / d), e = 1 - Math.pow(1 - k, 4); el.textContent = Math.round(end * e).toLocaleString() + (k === 1 ? suf : ''); if (k < 1) requestAnimationFrame(f); })(t0);
  }
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { count(e.target); cio.unobserve(e.target); } }); }, { threshold: .6 });
    $$('[data-count]').forEach(function (e) { cio.observe(e); });
  } else { $$('[data-count]').forEach(count); }

  /* Filters */
  var chips = $$('.chip'), cards = $$('.card');
  chips.forEach(function (c) {
    var f = c.dataset.filter;
    $('em', c).textContent = f === 'all' ? cards.length : cards.filter(function (k) { return k.dataset.cat === f; }).length;
    c.addEventListener('click', function () {
      chips.forEach(function (x) { x.setAttribute('aria-pressed', String(x === c)); });
      cards.forEach(function (k) { k.hidden = !(f === 'all' || k.dataset.cat === f); });
      req();
    });
  });

  /* Ledger (cleans itself when scrolled into view) */
  var body = $('#ledgerBody'), statusEl = $('#ledgerStatus'), replay = $('#ledgerReplay');
  var ROW = 46, rows = [], timers = [];
  var data = [
    { raw: ['zenith pharma', 'meds'], clean: ['Zenith Pharma Ltd', 'Medical'] },
    { raw: ['ACME STEEL LIMITED', 'steel/metal'], clean: ['Acme Steel Ltd', 'Materials'] },
    { raw: ['brent lab supplies', 'Lab equip.'], clean: ['Brent Lab Supplies', 'Laboratory'] },
    { raw: ['acme steel ltd', 'Steel'], clean: ['Acme Steel Ltd', 'Materials'], dupe: true },
    { raw: ['Alpha fuel co', 'fuel'], clean: ['Alpha Fuel Co', 'Energy'] },
    { raw: ['BRENT LAB SUPPLIES LTD', 'lab'], clean: ['Brent Lab Supplies', 'Laboratory'], dupe: true }
  ];
  var kept = data.filter(function (d) { return !d.dupe; }).length;
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function place(r, s) { r.style.transform = 'translateY(' + (s * ROW) + 'px)'; }
  function mk(a, b, cls) {
    var li = document.createElement('li'); li.className = 'lrow' + (cls ? ' ' + cls : '');
    li.innerHTML = '<span></span><span></span><i aria-hidden="true">✓</i>';
    li.children[0].textContent = a; li.children[1].textContent = b; return li;
  }
  function build() {
    body.style.setProperty('--rows', data.length); body.innerHTML = '';
    rows = data.map(function (d, i) { var li = mk(d.raw[0], d.raw[1]); place(li, i); body.appendChild(li); return li; });
    statusEl.textContent = data.length + ' rows, messy';
  }
  function finalState() {
    var k = data.filter(function (d) { return !d.dupe; }).sort(function (a, b) { return a.clean[0].localeCompare(b.clean[0]); });
    body.style.setProperty('--rows', k.length); body.innerHTML = '';
    k.forEach(function (d, i) { var li = mk(d.clean[0], d.clean[1], 'is-clean'); place(li, i); body.appendChild(li); });
    statusEl.textContent = k.length + ' clean rows';
  }
  function run() {
    timers.forEach(clearTimeout); timers = [];
    if (reduce) { finalState(); return; }
    build();
    later(function () {
      statusEl.textContent = 'standardising…';
      rows.forEach(function (r, i) { later(function () { r.children[0].textContent = data[i].clean[0]; r.children[1].textContent = data[i].clean[1]; r.classList.add('is-clean'); }, i * 150); });
    }, 700);
    later(function () { rows.forEach(function (r, i) { if (data[i].dupe) r.classList.add('is-dupe'); }); statusEl.textContent = '2 duplicates found'; }, 2100);
    later(function () { rows.forEach(function (r, i) { if (data[i].dupe) r.classList.add('is-gone'); }); statusEl.textContent = 'merging…'; }, 2900);
    later(function () {
      data.map(function (d, i) { return { d: d, i: i }; }).filter(function (o) { return !o.d.dupe; })
        .sort(function (a, b) { return a.d.clean[0].localeCompare(b.d.clean[0]); })
        .forEach(function (o, s) { place(rows[o.i], s); });
      statusEl.textContent = 'sorting…';
    }, 3500);
    later(function () { statusEl.textContent = kept + ' clean rows'; body.style.setProperty('--rows', kept); }, 4400);
  }
  replay.addEventListener('click', run);
  build();
  if ('IntersectionObserver' in window) {
    var lio = new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { run(); o.disconnect(); } }, { threshold: .4 });
    lio.observe($('#ledger'));
  } else { run(); }
})();
