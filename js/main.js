/* =============================================================
   AIRA HOMES — main.js
   Works for both index.html (styles.css) and inner pages (style.css)
   ============================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. STICKY HEADER ── */
  const header = document.getElementById('header');
  if (header) {
    const handleScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ── 2. MOBILE NAVIGATION TOGGLE ── */
  const hamburger   = document.getElementById('hamburger');
  const overlay     = document.getElementById('overlay');

  // home page uses .navbar .nav-links (a <ul>)
  // inner pages use #mobile-nav (an <aside>)
  const mobilePanel = document.getElementById('mobile-nav')
                   || document.querySelector('.navbar .nav-links');

  /* Open the slide-in menu */
  const openMenu = () => {
    if (!mobilePanel) return;
    mobilePanel.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Animate hamburger → X
    if (hamburger) {
      const spans = hamburger.querySelectorAll('span');
      if (spans[0]) spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
      if (spans[1]) spans[1].style.opacity   = '0';
      if (spans[2]) spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
    }
  };

  /* Close the slide-in menu */
  const closeMenu = () => {
    if (!mobilePanel) return;
    mobilePanel.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
    // Reset hamburger
    if (hamburger) {
      const spans = hamburger.querySelectorAll('span');
      spans.forEach(s => {
        s.style.transform = '';
        s.style.opacity   = '';
      });
    }
  };

  /* Toggle on hamburger click */
  if (hamburger) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobilePanel && mobilePanel.classList.contains('active');
      isOpen ? closeMenu() : openMenu();
    });
  }

  /* Close when overlay (dark backdrop) is tapped */
  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  /* ─────────────────────────────────────────────────────────────
     NAV LINK CLICKS — CRITICAL FIX
     We must NOT call e.preventDefault() on navigation links.
     We close the menu AFTER a short delay so the browser has
     already registered the navigation href before DOM changes.
  ───────────────────────────────────────────────────────────── */
  const navLinksInPanel = mobilePanel
    ? mobilePanel.querySelectorAll('a')
    : [];

  navLinksInPanel.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      // If it's a real page link, navigate manually to ensure it works on mobile
      if (href && !href.startsWith('#') && !href.startsWith('tel:') && !href.startsWith('mailto:')) {
        e.preventDefault();
        closeMenu();
        setTimeout(() => {
          window.location.href = href;
        }, 300); // Wait for menu to slide out
      } else {
        // Let tel/mailto/anchor links run natively
        setTimeout(closeMenu, 300);
      }
    });
  });

  /* ── 3. STATS COUNTER ANIMATION ── */
  const statNumbers = document.querySelectorAll('[data-target]');
  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const endVal = parseInt(el.getAttribute('data-target'), 10);
        if (isNaN(endVal)) return;
        let current  = 0;
        const step   = endVal / (2000 / 16); // 2 sec at 60fps
        const tick   = () => {
          current += step;
          if (current < endVal) {
            el.textContent = Math.ceil(current);
            requestAnimationFrame(tick);
          } else {
            el.textContent = endVal;
          }
        };
        tick();
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });
    statNumbers.forEach(el => observer.observe(el));
  }

  /* ── 4. GALLERY FILTERING ── */
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
          const show = filter === 'all' || item.getAttribute('data-category') === filter;
          if (show) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity   = '1';
              item.style.transform = 'scale(1)';
            }, 30);
          } else {
            item.style.opacity   = '0';
            item.style.transform = 'scale(0.85)';
            setTimeout(() => { item.style.display = 'none'; }, 320);
          }
        });
      });
    });
  }

  /* ── 5. CONTACT FORM ── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn          = contactForm.querySelector('[type="submit"]');
      const originalText = btn ? btn.textContent : '';
      if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }
      setTimeout(() => {
        alert('✅ Thank you! Your message has been received. We will contact you shortly.');
        contactForm.reset();
        if (btn) { btn.textContent = originalText; btn.disabled = false; }
      }, 800);
    });
  }

  /* ── 6. SMOOTH SCROLL — only for true same-page anchors ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href   = anchor.getAttribute('href');
      // Skip bare "#" links to avoid blocking navigation
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
