(function () {
  'use strict';
  var root = document.documentElement;
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var themeBtn = document.getElementById('theme');
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  function setMenu(open) {
    if (!nav || !burger) return;
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    var svg = burger.querySelector('svg');
    if (svg) {
      svg.innerHTML = open 
        ? '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>'
        : '<path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/>';
    }
  }

  if (burger) {
    burger.addEventListener('click', function () {
      setMenu(!nav.classList.contains('open'));
    });
  }

  if (nav) {
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setMenu(false);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  document.addEventListener('click', function (e) {
    if (nav && burger && !nav.contains(e.target) && !burger.contains(e.target)) {
      setMenu(false);
    }
  });

  function labelTheme() {
    if (!themeBtn) return;
    var isDark = root.dataset.theme === 'dark';
    themeBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    var sun = themeBtn.querySelector('.theme-icon-sun');
    var moon = themeBtn.querySelector('.theme-icon-moon');
    if (sun && moon) {
      sun.style.display = isDark ? 'block' : 'none';
      moon.style.display = isDark ? 'none' : 'block';
    }
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('theme', root.dataset.theme);
      } catch (e) {}
      labelTheme();
    });
    labelTheme();
  }
})();
