/* ============================================================
   Shamik Basu - Portfolio scripts
   Small, dependency-free, easy to read.
   ============================================================ */
(function () {
  'use strict';

  var CALENDAR_URL = 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ3zKOb4P00q16CON7kIHMigcoWwlm3bdonq4wnh5WpjqUZ3GxG1HROP2XfDn2QwpBov9DEEypsW?gv=true';
  var EMAIL = 'shamik1900@gmail.com';
  var LINKEDIN = 'https://linkedin.com/in/shamikofficial/';
  var GITHUB = 'https://github.com/ShamikOfficial';

  /* ---- Shared top bar + floating calendar (all pages) ---- */
  function injectSiteChrome() {
    var nav = document.querySelector('header.nav');
    if (!nav || document.querySelector('.topbar')) return;

    var topbar = document.createElement('div');
    topbar.className = 'topbar';
    topbar.innerHTML =
      '<div class="topbar-inner">' +
        '<div class="topbar-left">' +
          '<a class="topbar-item" href="mailto:' + EMAIL + '">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5z"/></svg>' +
            '<span class="topbar-text-email">' + EMAIL + '</span>' +
          '</a>' +
          '<span class="topbar-item">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z"/></svg>' +
            'Los Angeles, CA' +
          '</span>' +
        '</div>' +
        '<div class="topbar-right">' +
          '<button type="button" class="topbar-connect" data-open-calendar aria-label="Let\'s Connect - book a meeting">' +
            '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>' +
            "Let's Connect" +
          '</button>' +
          '<div class="topbar-social">' +
            '<a href="' + GITHUB + '" target="_blank" rel="noopener" aria-label="GitHub">' +
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.44 9.8 8.2 11.39.6.11.82-.26.82-.58 0-.28-.01-1.02-.02-2-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.49 5.93.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.22.7.83.58A12 12 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>' +
            '</a>' +
            '<a href="' + LINKEDIN + '" target="_blank" rel="noopener" aria-label="LinkedIn">' +
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>' +
            '</a>' +
          '</div>' +
        '</div>' +
      '</div>';
    nav.insertBefore(topbar, nav.firstChild);

    var backdrop = document.createElement('div');
    backdrop.className = 'calendar-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');

    var panel = document.createElement('div');
    panel.className = 'calendar-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', 'calendar-panel-title');
    panel.setAttribute('aria-hidden', 'true');
    panel.innerHTML =
      '<div class="calendar-panel-head">' +
        '<h2 id="calendar-panel-title">Book a meeting</h2>' +
        '<button type="button" class="calendar-close" aria-label="Close calendar">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
        '</button>' +
      '</div>' +
      '<iframe title="Book an appointment with Shamik Basu" loading="lazy"></iframe>';

    var fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'calendar-fab';
    fab.setAttribute('aria-label', 'Book a meeting');
    fab.setAttribute('aria-expanded', 'false');
    fab.setAttribute('data-open-calendar', '');
    fab.innerHTML =
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5zm2 4h10v2H7v-2zm0 4h7v2H7v-2z"/></svg>' +
      '<span>Book time</span>';

    document.body.appendChild(backdrop);
    document.body.appendChild(panel);
    document.body.appendChild(fab);

    var iframe = panel.querySelector('iframe');
    var loaded = false;
    var open = false;

    function setOpen(next) {
      open = next;
      panel.classList.toggle('open', open);
      backdrop.classList.toggle('open', open);
      document.body.classList.toggle('calendar-open', open);
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');
      backdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
      fab.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open && !loaded) {
        iframe.src = CALENDAR_URL;
        loaded = true;
      }
    }

    function toggleCalendar() { setOpen(!open); }

    panel.querySelector('.calendar-close').addEventListener('click', function () { setOpen(false); });
    backdrop.addEventListener('click', function () { setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && open) setOpen(false);
    });
    document.body.addEventListener('click', function (e) {
      if (e.target.closest('[data-open-calendar]')) {
        e.preventDefault();
        toggleCalendar();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectSiteChrome);
  } else {
    injectSiteChrome();
  }

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

  /* ---- Project video mute toggle ---- */
  document.querySelectorAll('.project-media').forEach(function (media) {
    var video = media.querySelector('video.project-video');
    var btn = media.querySelector('.video-mute-btn');
    if (!video || !btn) return;
    function sync() {
      var muted = video.muted;
      btn.classList.toggle('is-muted', muted);
      btn.setAttribute('aria-pressed', muted ? 'true' : 'false');
      btn.setAttribute('aria-label', muted ? 'Unmute video' : 'Mute video');
      btn.title = muted ? 'Unmute' : 'Mute';
    }
    btn.addEventListener('click', function () {
      video.muted = !video.muted;
      if (!video.muted) video.play().catch(function () {});
      sync();
    });
    sync();
  });

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
