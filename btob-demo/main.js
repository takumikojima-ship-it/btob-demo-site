/* ============================================================
   NEXSYS株式会社 — Global JavaScript
   ============================================================
   各ページに共通する処理をまとめています。
   ページ固有の処理は各 HTML の <script> に記述。
   ============================================================ */

(function () {
  'use strict';

  /* 1. Sticky Header: スクロール時にシャドウを付与
  ---------------------------------------------------------- */
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });
  }

  /* 2. Mobile Menu: ハンバーガー開閉
  ---------------------------------------------------------- */
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav  = document.getElementById('mobile-nav');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen);
    });
    // 画面外クリックで閉じる
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target)) {
        mobileNav.classList.remove('open');
        menuToggle.classList.remove('open');
      }
    });
  }

  /* 3. Active Nav Link: 現在ページにアクティブクラス
  ---------------------------------------------------------- */
  const currentFile = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentFile || (currentFile === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* 4. Scroll Animations: IntersectionObserver でフェードイン
  ---------------------------------------------------------- */
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    fadeEls.forEach(el => observer.observe(el));
  }

  /* 5. FAQ Accordion: クリックで開閉
  ---------------------------------------------------------- */
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      // 同一グループ内の他を閉じる（任意: コメントアウトで全開可）
      // item.closest('.faq-list')?.querySelectorAll('.faq-item.open').forEach(i => {
      //   if (i !== item) i.classList.remove('open');
      // });
      item.classList.toggle('open');
    });
  });

  /* 6. Filter Buttons: data-cat によるカード絞り込み
  ---------------------------------------------------------- */
  document.querySelectorAll('.filter-row').forEach(row => {
    const targetId = row.dataset.target;
    const grid = targetId ? document.getElementById(targetId) : null;
    if (!grid) return;

    row.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        row.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat;
        grid.querySelectorAll('[data-cat]').forEach(card => {
          const show = cat === 'all' || card.dataset.cat === cat;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  });

  /* 7. Smooth Scroll: ページ内アンカーリンク
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = header ? header.offsetHeight + 16 : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
