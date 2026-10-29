/* پورتال عامل‌های هوشمند ایران — اسکریپت تعاملی (بدون وابستگی) */
(function () {
  'use strict';

  /* ---------- منوی موبایل ---------- */
  document.querySelectorAll('.nav-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var nav = document.querySelector('.main-nav');
      if (nav) nav.classList.toggle('open');
    });
  });

  /* ---------- لینک فعال منو ---------- */
  var path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
  });

  /* ---------- دکمه کپی کد ---------- */
  document.querySelectorAll('.code-block').forEach(function (block) {
    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.type = 'button';
    btn.textContent = 'کپی';
    btn.addEventListener('click', function () {
      var text = block.querySelector('code') ? block.querySelector('code').innerText : block.innerText.replace(/^کپی\s*/m, '');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          btn.textContent = 'کپی شد ✓';
          setTimeout(function () { btn.textContent = 'کپی'; }, 1600);
        });
      } else {
        // جایگزین برای file:// بدون clipboard API
        var ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); btn.textContent = 'کپی شد ✓'; } catch (e) { btn.textContent = 'کپی نشد'; }
        document.body.removeChild(ta);
        setTimeout(function () { btn.textContent = 'کپی'; }, 1600);
      }
    });
    block.appendChild(btn);
  });

  /* ---------- فیلتر کاتالوگ ابزارها (tools.html) ---------- */
  var searchBox = document.getElementById('tool-search');
  var chips = document.querySelectorAll('.tool-filters .chip');
  var cards = document.querySelectorAll('.tool-card');
  var activeCat = 'all';

  function applyFilter() {
    var q = searchBox ? searchBox.value.trim().toLowerCase() : '';
    var visible = 0;
    cards.forEach(function (card) {
      var cat = card.getAttribute('data-cat') || '';
      var txt = (card.getAttribute('data-name') || '') + ' ' + (card.getAttribute('data-desc') || '');
      var show = (activeCat === 'all' || cat === activeCat) && (!q || txt.toLowerCase().indexOf(q) !== -1);
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    var counter = document.getElementById('tool-count');
    if (counter) counter.textContent = visible + ' ابزار';
  }

  if (searchBox) searchBox.addEventListener('input', applyFilter);
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('on'); });
      chip.classList.add('on');
      activeCat = chip.getAttribute('data-cat') || 'all';
      applyFilter();
    });
  });

  /* ---------- اسکرول نرم برای لینک‌های داخلی ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.getElementById(a.getAttribute('href').slice(1));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ---------- هایلایت بخش فعال در محتوای طولانی ---------- */
  if ('IntersectionObserver' in window) {
    var navLinks = document.querySelectorAll('.content-nav a[href^="#"]');
    var sections = [];
    navLinks.forEach(function (link) {
      var sec = document.getElementById(link.getAttribute('href').slice(1));
      if (sec) sections.push({ link: link, sec: sec });
    });
    if (sections.length) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            navLinks.forEach(function (l) { l.classList.remove('on'); });
            var match = sections.find(function (s) { return s.sec === en.target; });
            if (match) match.link.classList.add('on');
          }
        });
      }, { rootMargin: '-30% 0px -60% 0px' });
      sections.forEach(function (s) { obs.observe(s.sec); });
    }
  }
})();
