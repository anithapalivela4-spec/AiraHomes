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
  const hamburger = document.getElementById('hamburger');
  const overlay   = document.getElementById('overlay');

  // Support both inner-page aside and home-page ul
  const mobilePanel = document.getElementById('mobile-nav')          // inner pages
                   || document.querySelector('.navbar .nav-links');  // home page

  const openMenu = () => {
    if (mobilePanel) mobilePanel.classList.add('active');
    if (overlay)     overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Animate hamburger → X
    if (hamburger) {
      const [s1, s2, s3] = hamburger.querySelectorAll('span');
      if (s1) s1.style.transform = 'rotate(45deg) translate(5px, 6px)';
      if (s2) s2.style.opacity   = '0';
      if (s3) s3.style.transform = 'rotate(-45deg) translate(5px, -6px)';
    }
  };

  const closeMenu = () => {
    if (mobilePanel) mobilePanel.classList.remove('active');
    if (overlay)     overlay.classList.remove('active');
    document.body.style.overflow = '';
    // Reset hamburger
    if (hamburger) {
      const spans = hamburger.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  };

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobilePanel && mobilePanel.classList.contains('active');
      isOpen ? closeMenu() : openMenu();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  // Close menu when any nav link is clicked
  const allNavLinks = document.querySelectorAll(
    '.mobile-nav .nav-link, .navbar .nav-links a, .nav-link'
  );
  allNavLinks.forEach(link => link.addEventListener('click', closeMenu));

  /* ── 3. STATS COUNTER ANIMATION ── */
  const statNumbers = document.querySelectorAll('[data-target]');
  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el       = entry.target;
        const endVal   = parseInt(el.getAttribute('data-target'), 10);
        if (isNaN(endVal)) return;
        let current    = 0;
        const duration = 2000;
        const step     = endVal / (duration / 16);
        const tick = () => {
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
  const filterBtns  = document.querySelectorAll('.filter-btn');
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
            setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 30);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.85)';
            setTimeout(() => { item.style.display = 'none'; }, 320);
          }
        });
      });
    });
  }

  /* ── 5. CONTACT FORM SUBMISSION ── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      const originalText = btn ? btn.textContent : '';
      if (btn) { btn.textContent = 'Sending...'; btn.disabled = true; }
      setTimeout(() => {
        alert('✅ Thank you! Your message has been received. We will contact you shortly.');
        contactForm.reset();
        if (btn) { btn.textContent = originalText; btn.disabled = false; }
      }, 800);
    });
  }

  /* ── 6. SMOOTH SCROLL FOR ANCHOR LINKS ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
