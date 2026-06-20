/* ============================================================
   Shamik Basu - Portfolio scripts
   Small, dependency-free, easy to read.
   ============================================================ */
(function () {
  'use strict';

  /* ---- Theme toggle (light default, remembers choice) ---- */
  var root = document.documentElement;
  try {
    if (localStorage.getItem('theme') === 'dark') root.setAttribute('data-theme', 'dark');
  } catch (e) {}

  var themeBtn = document.querySelector('.theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var isDark = root.getAttribute('data-theme') === 'dark';
      root.setAttribute('data-theme', isDark ? 'light' : 'dark');
      try { localStorage.setItem('theme', isDark ? 'light' : 'dark'); } catch (e) {}
    });
  }

  /* ---- Mobile menu ---- */
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.querySelector('.mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  /* ---- Highlights slideshow ---- */
  var slides = Array.prototype.slice.call(document.querySelectorAll('.highlight-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.slider-dot'));
  var current = 0;
  var timer = null;

  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach(function (s, i) { s.classList.toggle('active', i === current); });
    dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
  }
  function startAuto() {
    if (slides.length > 1) timer = setInterval(function () { show(current + 1); }, 6000);
  }
  if (slides.length) {
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(parseInt(this.dataset.index, 10));
        if (timer) { clearInterval(timer); startAuto(); }
      });
    });
    show(0);
    startAuto();
  }

  /* ---- Lazy YouTube embeds (click to load, keeps page light) ---- */
  document.querySelectorAll('.video-embed[data-youtube]').forEach(function (box) {
    var id = box.getAttribute('data-youtube');
    if (!id) return; /* no video yet -> poster stays */
    box.addEventListener('click', function () {
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
      iframe.title = box.getAttribute('data-title') || 'Project walkthrough';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      box.innerHTML = '';
      box.appendChild(iframe);
    });
  });

  /* ---- Active section highlight in nav ---- */
  var navLinks = document.querySelectorAll('.nav-links a[data-section]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function (a) {
            a.style.color = a.getAttribute('data-section') === id ? 'var(--accent)' : '';
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('section[id]').forEach(function (s) { observer.observe(s); });
  }

  /* ---- Touch profile.json so crawlers/agents discover the data file ---- */
  try { fetch('assets/data/profile.json').catch(function () {}); } catch (e) {}
})();
