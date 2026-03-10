/* MP Drafting — Interactions */
document.addEventListener('DOMContentLoaded', function () {

  /* ── Mega menu (Services) ── */
  // Direct element listeners — simpler and more reliable than document capture.
  // .mega-wrapper has align-self:stretch so it fills the full 68px nav height,
  // meaning the cursor stays inside it right to the nav's bottom edge with no gap.
  // The 200ms close delay lets the cursor travel from wrapper to the fixed panel.
  var megaTimer;
  var megaWrapper = document.getElementById('mega-wrapper');
  var megaMenu    = document.getElementById('mega-menu');

  if (megaWrapper && megaMenu) {
    function openMega()  { clearTimeout(megaTimer); megaMenu.classList.add('open'); }
    function closeMega() { megaTimer = setTimeout(function () { megaMenu.classList.remove('open'); }, 200); }

    megaWrapper.addEventListener('mouseenter', openMega);
    megaWrapper.addEventListener('mouseleave', closeMega);
    megaMenu.addEventListener('mouseenter', openMega);
    megaMenu.addEventListener('mouseleave', closeMega);

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!megaWrapper.contains(e.target) && !megaMenu.contains(e.target)) {
        clearTimeout(megaTimer);
        megaMenu.classList.remove('open');
      }
    });
  }

  /* ── About dropdown ── */
  var aboutTimer;
  var aboutWrapper  = document.getElementById('about-wrapper');
  var aboutDropdown = document.getElementById('about-dropdown');

  if (aboutWrapper && aboutDropdown) {
    function openAbout()  { clearTimeout(aboutTimer); aboutDropdown.classList.add('open'); }
    function closeAbout() { aboutTimer = setTimeout(function () { aboutDropdown.classList.remove('open'); }, 200); }

    aboutWrapper.addEventListener('mouseenter', openAbout);
    aboutWrapper.addEventListener('mouseleave', closeAbout);
    aboutDropdown.addEventListener('mouseenter', openAbout);
    aboutDropdown.addEventListener('mouseleave', closeAbout);

    document.addEventListener('click', function (e) {
      if (!aboutWrapper.contains(e.target) && !aboutDropdown.contains(e.target)) {
        clearTimeout(aboutTimer);
        aboutDropdown.classList.remove('open');
      }
    });
  }

  /* ── Mobile nav toggle ── */
  document.addEventListener('click', function (e) {
    var btn = document.getElementById('nav-hamburger');
    var mobileNav = document.getElementById('mobile-nav');
    if (!btn || !mobileNav) return;

    if (btn.contains(e.target)) {
      mobileNav.classList.toggle('open');
    } else if (!mobileNav.contains(e.target)) {
      mobileNav.classList.remove('open');
    }
  });

  /* ── FAQ accordion ── */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = this.closest('.faq-item');
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (el) { el.classList.remove('open'); });
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── Level example modal (request-quote) ── */
  var levelExamples = {
    'quick-draw': {
      tag:     'Level 1',
      title:   'Quick Draw',
      tagline: 'Fast, streamlined detail for early-stage or budget-sensitive projects.',
      bullets: [
        'Basic system details based on customer input',
        'Generic surrounding condition representation',
        'Faster Lead Times'
      ]
    },
    'typical-detail': {
      tag:     'Level 2 — MP Standard',
      title:   'Typical Detail',
      tagline: 'Our standard for most commercial submittals.',
      bullets: [
        'Accurate surrounding conditions',
        'Correct fasteners matched to the condition',
        'Coordination dimensions and column line references',
        'Clear notes'
      ]
    },
    'design-assist': {
      tag:     'Level 3',
      title:   'Advanced Detailing',
      tagline: 'Expanded drafting support for projects requiring more.',
      bullets: [
        'Design Assist services',
        '3D Isometrics or option detailing',
        'Studies for complex conditions',
        'Drawings using client standards or templates'
      ]
    }
  };

  var levelModal    = document.getElementById('level-example-modal');
  var levelModalTag = document.getElementById('level-example-tag');
  var levelModalTitle = document.getElementById('level-example-title');
  var levelModalClose = document.getElementById('level-example-close');
  var levelModalSelect = document.getElementById('level-example-select');
  var currentExampleLevel = null;

  document.querySelectorAll('[data-level]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      currentExampleLevel = this.dataset.level;
      var data = levelExamples[currentExampleLevel];
      if (!data || !levelModal) return;
      levelModalTag.textContent   = data.tag;
      levelModalTitle.textContent = data.title;
      document.getElementById('level-example-tagline').textContent = data.tagline;
      var listHtml = '<ul class="level-example-list">';
      data.bullets.forEach(function (b) { listHtml += '<li>' + b + '</li>'; });
      listHtml += '</ul>';
      listHtml += '<a href="#" target="_blank" rel="noopener" class="level-example-pdf">View Examples Side-by-Side (PDF opens in new tab)</a>';
      document.getElementById('level-example-content').innerHTML = listHtml;
      levelModal.classList.add('open');
    });
  });

  if (levelModalClose) {
    levelModalClose.addEventListener('click', function () { levelModal.classList.remove('open'); });
  }
  if (levelModal) {
    levelModal.addEventListener('click', function (e) { if (e.target === this) this.classList.remove('open'); });
  }
  if (levelModalSelect) {
    levelModalSelect.addEventListener('click', function () {
      if (!currentExampleLevel) return;
      var targetCard = document.querySelector('.level-card input[value="' + currentExampleLevel + '"]');
      if (targetCard) targetCard.closest('.level-card').click();
      levelModal.classList.remove('open');
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && levelModal) levelModal.classList.remove('open');
  });

  /* ── Level card selection (request-quote) ── */
  document.querySelectorAll('.level-card').forEach(function (card) {
    card.addEventListener('click', function () {
      document.querySelectorAll('.level-card').forEach(function (c) {
        c.classList.remove('selected');
        var r = c.querySelector('input[type="radio"]');
        if (r) r.checked = false;
      });
      this.classList.add('selected');
      var radio = this.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;

      var dbFields = document.getElementById('design-build-fields');
      if (dbFields) {
        dbFields.style.display = (radio && radio.value === 'design-assist') ? 'block' : 'none';
      }
    });
  });

  /* ── Multi-step form ── */
  var step1 = document.getElementById('form-step-1');
  var step2 = document.getElementById('form-step-2');
  var ind1  = document.getElementById('step-ind-1');
  var ind2  = document.getElementById('step-ind-2');

  var nextBtn = document.getElementById('form-next');
  if (nextBtn && step1 && step2) {
    nextBtn.addEventListener('click', function () {
      // Populate review summary
      var levelEl = document.querySelector('.level-card.selected .level-card-name');
      var r = document.getElementById('review-level');
      if (r && levelEl) r.textContent = levelEl.textContent;

      var projName = document.getElementById('project-name');
      var rp = document.getElementById('review-project');
      if (rp && projName) rp.textContent = projName.value || '—';

      step1.style.display = 'none';
      step2.style.display = 'block';
      if (ind1) { ind1.classList.remove('active'); ind1.classList.add('done'); }
      if (ind2) ind2.classList.add('active');
      window.scrollTo(0, 0);
    });
  }

  var backBtn = document.getElementById('form-back');
  if (backBtn && step1 && step2) {
    backBtn.addEventListener('click', function () {
      step2.style.display = 'none';
      step1.style.display = 'block';
      if (ind1) { ind1.classList.add('active'); ind1.classList.remove('done'); }
      if (ind2) ind2.classList.remove('active');
      window.scrollTo(0, 0);
    });
  }

  /* ── Lightbox (homepage proof thumbnails) ── */
  var lightbox    = document.getElementById('lightbox');
  var lbCaption   = document.getElementById('lightbox-caption');
  var lbClose     = document.getElementById('lightbox-close');

  document.querySelectorAll('[data-lightbox]').forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      if (!lightbox) return;
      if (lbCaption) lbCaption.textContent = this.dataset.caption || '';
      lightbox.classList.add('open');
    });
  });

  if (lbClose)   lbClose.addEventListener('click', function () { lightbox.classList.remove('open'); });
  if (lightbox)  lightbox.addEventListener('click', function (e) { if (e.target === this) this.classList.remove('open'); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox) lightbox.classList.remove('open');
  });

  /* ── FAQ search filter ── */
  var faqSearch = document.getElementById('faq-search');
  if (faqSearch) {
    faqSearch.addEventListener('input', function () {
      var query = this.value.toLowerCase().trim();
      var allItems = document.querySelectorAll('.faq-item');
      var anyVisible = false;

      allItems.forEach(function (item) {
        var q = (item.querySelector('.faq-question') || {}).textContent || '';
        var a = (item.querySelector('.faq-answer')   || {}).textContent || '';
        var match = !query || (q + ' ' + a).toLowerCase().indexOf(query) !== -1;
        item.style.display = match ? '' : 'none';
        if (match) anyVisible = true;
      });

      // Show/hide each category label based on whether any sibling items are visible
      document.querySelectorAll('.faq-category-label').forEach(function (label) {
        var list = label.nextElementSibling;
        var hasVisible = false;
        if (list) {
          list.querySelectorAll('.faq-item').forEach(function (item) {
            if (item.style.display !== 'none') hasVisible = true;
          });
        }
        label.style.display = hasVisible ? '' : 'none';
      });

      var noResults = document.getElementById('faq-no-results');
      if (noResults) noResults.style.display = anyVisible ? 'none' : 'block';
    });
  }

  /* ── Tab filter (sample-drawings) ── */
  document.querySelectorAll('.tab-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');
      var filter = this.dataset.filter;
      document.querySelectorAll('.drawing-item').forEach(function (item) {
        item.style.display = (filter === 'all' || item.dataset.category === filter) ? '' : 'none';
      });
    });
  });

  /* ── Our Process: anchor nav active state + process progress bar ── */
  (function () {
    var anchorLinks = document.querySelectorAll('.anchor-nav a[href^="#"]');
    var processBlocks = document.querySelectorAll('.process-block');
    if (!anchorLinks.length || !processBlocks.length) return;

    // Build ordered list of { id, section el, nav link, process block }
    var steps = [];
    anchorLinks.forEach(function (link, i) {
      var id = link.getAttribute('href').slice(1);
      var el = document.getElementById(id);
      if (el) steps.push({ id: id, el: el, link: link, block: processBlocks[i] || null });
    });

    var sidebarDots = document.querySelectorAll('.process-sidebar-dot');
    var sidebarFill = document.getElementById('process-sidebar-fill');

    function applyActive(activeId) {
      var activeIndex = -1;
      steps.forEach(function (s, i) { if (s.id === activeId) activeIndex = i; });

      steps.forEach(function (s, i) {
        // Anchor nav
        s.link.classList.toggle('active', s.id === activeId);
        // Process block
        if (s.block) {
          if (i < activeIndex) {
            s.block.classList.add('is-done');
            s.block.classList.remove('is-active');
          } else if (i === activeIndex) {
            s.block.classList.add('is-active');
            s.block.classList.remove('is-done');
          } else {
            s.block.classList.remove('is-done', 'is-active');
          }
        }
        // Sidebar dots
        var dot = sidebarDots[i];
        if (dot) {
          dot.classList.toggle('is-active', i === activeIndex);
          dot.classList.toggle('is-done', i < activeIndex);
        }
      });

      // Sidebar fill — progress from first to last dot
      if (sidebarFill && steps.length > 1) {
        var pct = activeIndex / (steps.length - 1) * 100;
        sidebarFill.style.height = pct + '%';
      }
    }

    // IntersectionObserver: fire when a section crosses into the upper portion of the viewport
    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible[entry.target.id] = entry.isIntersecting;
      });
      // First visible section in DOM order wins
      for (var i = 0; i < steps.length; i++) {
        if (visible[steps[i].id]) { applyActive(steps[i].id); return; }
      }
    }, { rootMargin: '-10% 0px -65% 0px', threshold: 0 });

    steps.forEach(function (s) { io.observe(s.el); });

    // Click: smooth-scroll with offset for sticky nav + anchor bar (~120px)
    function smoothScrollToId(id, e) {
      var target = document.getElementById(id);
      if (!target) return;
      if (e) e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }

    anchorLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        smoothScrollToId(this.getAttribute('href').slice(1), e);
      });
    });

    sidebarDots.forEach(function (dot) {
      dot.addEventListener('click', function (e) {
        smoothScrollToId(this.getAttribute('href').slice(1), e);
      });
    });
  }());

});
