/* Shamik Basu - portfolio scripts (no dependencies) */
(function () {
  'use strict';

  var CALENDAR_URL = 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ3zKOb4P00q16CON7kIHMigcoWwlm3bdonq4wnh5WpjqUZ3GxG1HROP2XfDn2QwpBov9DEEypsW?gv=true';

  /* ---- Theme ---- */
  var root = document.documentElement;
  try {
    if (localStorage.getItem('theme') === 'dark') root.setAttribute('data-theme', 'dark');
  } catch (e) {}

  function syncThemeToggle() {
    var isDark = root.getAttribute('data-theme') === 'dark';
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      btn.title = isDark ? 'Light mode' : 'Dark mode';
    });
  }
  syncThemeToggle();

  document.querySelectorAll('.theme-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var isDark = root.getAttribute('data-theme') === 'dark';
      root.setAttribute('data-theme', isDark ? 'light' : 'dark');
      try { localStorage.setItem('theme', isDark ? 'light' : 'dark'); } catch (e) {}
      syncThemeToggle();
    });
  });

  /* ---- Mobile menu ---- */
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.querySelector('.mobile-menu');
  if (toggle && menu) {
    function closeMenu() {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    }
    toggle.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });
    menu.querySelectorAll('a, [data-open-calendar]').forEach(function (el) {
      el.addEventListener('click', closeMenu);
    });
  }

  /* ---- Calendar panel ---- */
  function initCalendar() {
    var panel = document.querySelector('.calendar-panel');
    var backdrop = document.querySelector('.calendar-backdrop');
    if (!panel || !backdrop || panel.dataset.calendarInit) return;
    panel.dataset.calendarInit = '1';

    var iframe = panel.querySelector('.calendar-frame, iframe');
    var closeBtn = panel.querySelector('.calendar-close');
    var openers = document.querySelectorAll('[data-open-calendar]');
    var loaded = false;
    var open = false;
    var lastFocus = null;

    function loadIframe() {
      if (!iframe || loaded) return;
      loaded = true;
      iframe.src = CALENDAR_URL;
    }

    function setOpen(next) {
      open = next;
      panel.classList.toggle('open', open);
      backdrop.classList.toggle('open', open);
      document.body.classList.toggle('calendar-open', open);
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');
      backdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
      openers.forEach(function (btn) {
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      if (open) {
        lastFocus = document.activeElement;
        loadIframe();
        if (closeBtn) closeBtn.focus();
      } else if (lastFocus && lastFocus.focus) {
        lastFocus.focus();
      }
    }

    if (closeBtn) closeBtn.addEventListener('click', function () { setOpen(false); });
    backdrop.addEventListener('click', function () { setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && open) setOpen(false);
    });
    document.body.addEventListener('click', function (e) {
      var opener = e.target.closest && e.target.closest('[data-open-calendar]');
      if (opener) {
        e.preventDefault();
        setOpen(!open);
      }
    });
  }

  /* ---- Click-to-play local video ---- */
  document.querySelectorAll('[data-play-video]').forEach(function (btn) {
    var media = btn.closest('.project-featured-media, .project-media');
    if (!media) return;
    var video = media.querySelector('video');
    if (!video) return;
    btn.addEventListener('click', function () {
      media.classList.add('is-playing');
      video.play().catch(function () {});
    });
  });

  /* ---- Lazy YouTube embeds ---- */
  function loadYoutube(box) {
    var id = box.getAttribute('data-youtube');
    if (!id || box.dataset.loaded) return;
    box.dataset.loaded = '1';
    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
    iframe.title = box.getAttribute('data-title') || 'Project walkthrough';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    box.innerHTML = '';
    box.appendChild(iframe);
  }

  document.querySelectorAll('.video-embed[data-youtube]').forEach(function (box) {
    box.addEventListener('click', function () { loadYoutube(box); });
    box.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        loadYoutube(box);
      }
    });
  });

  /* ---- Active nav section ---- */
  var navLinks = document.querySelectorAll('.nav-links a[data-section]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.getAttribute('id');
        navLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('data-section') === id);
        });
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    document.querySelectorAll('section[id]').forEach(function (s) { sectionObserver.observe(s); });
  }

  /* ---- Scroll reveal ---- */
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 0.05 + 's';
      revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  initCalendar();
})();
