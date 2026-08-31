/* Shamik Basu — portfolio scripts (no dependencies) */
(function () {
  'use strict';

  var CALENDAR_URL = 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ3zKOb4P00q16CON7kIHMigcoWwlm3bdonq4wnh5WpjqUZ3GxG1HROP2XfDn2QwpBov9DEEypsW?gv=true';

  function closestEl(node, selector) {
    while (node && node.nodeType === 1) {
      if (node.matches && node.matches(selector)) return node;
      node = node.parentElement;
    }
    return null;
  }

  /* ---- Calendar panel ---- */
  function initCalendar() {
    var panel = document.querySelector('.calendar-panel');
    var backdrop = document.querySelector('.calendar-backdrop');
    var fab = document.querySelector('.calendar-fab');
    if (!panel || !backdrop || !fab || panel.dataset.calendarInit) return;
    panel.dataset.calendarInit = '1';

    var iframe = panel.querySelector('.calendar-frame, iframe');
    var closeBtn = panel.querySelector('.calendar-close');
    var loaded = false;
    var open = false;

    function loadIframe() {
      if (!iframe || loaded) return;
      loaded = true;
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          iframe.src = CALENDAR_URL;
          iframe.removeAttribute('loading');
        });
      });
    }

    function setOpen(next) {
      open = next;
      panel.classList.toggle('open', open);
      backdrop.classList.toggle('open', open);
      document.body.classList.toggle('calendar-open', open);
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');
      backdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
      fab.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) loadIframe();
    }

    if (closeBtn) closeBtn.addEventListener('click', function () { setOpen(false); });
    backdrop.addEventListener('click', function () { setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && open) setOpen(false);
    });
    document.body.addEventListener('click', function (e) {
      if (closestEl(e.target, '[data-open-calendar]')) {
        e.preventDefault();
        setOpen(!open);
      }
    });
  }

  function initSiteChrome() {
    initCalendar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSiteChrome);
  } else {
    initSiteChrome();
  }

  /* ---- Theme toggle ---- */
  var root = document.documentElement;
  try {
    if (localStorage.getItem('theme') === 'dark') root.setAttribute('data-theme', 'dark');
  } catch (e) {}

  document.querySelectorAll('.theme-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var isDark = root.getAttribute('data-theme') === 'dark';
      root.setAttribute('data-theme', isDark ? 'light' : 'dark');
      try { localStorage.setItem('theme', isDark ? 'light' : 'dark'); } catch (e) {}
    });
  });

  /* ---- Mobile menu ---- */
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.querySelector('.mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      });
    });
  }

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
    if (!box.getAttribute('data-youtube')) return;
    box.addEventListener('click', function () { loadYoutube(box); });
    box.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        loadYoutube(box);
      }
    });
  });

  /* ---- Project video mute toggle ---- */
  document.querySelectorAll('.project-media, .project-featured-media').forEach(function (media) {
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

  /* ---- Active nav section ---- */
  var navLinks = document.querySelectorAll('.nav-links a[data-section]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function (a) {
            a.classList.toggle('is-active', a.getAttribute('data-section') === id);
          });
        }
      });
    }, { rootMargin: '-42% 0px -52% 0px' });
    document.querySelectorAll('section[id]').forEach(function (s) { observer.observe(s); });
  }

  /* ---- Scroll reveal ---- */
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 0.06 + 's';
      revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ---- Profile data hint for crawlers ---- */
  try {
    var profilePath = document.body.getAttribute('data-profile-path') || 'assets/data/profile.json';
    fetch(profilePath).catch(function () {});
  } catch (e) {}
})();
