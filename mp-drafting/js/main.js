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
        dbFields.style.display = (radio && radio.value === 'design-build') ? 'block' : 'none';
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

});
