document.addEventListener('DOMContentLoaded', () => {
  
  // --- STICKY NAV ON SCROLL ---
  const header = document.getElementById('header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Init on load

    // --- MOBILE NAVIGATION TOGGLE ---
  const hamburger = document.getElementById('hamburger');
  // Support both inner pages (.nav-menu or #mobile-nav) and home page (.nav-links)
  const mobileNav = document.getElementById('mobile-nav') || document.querySelector('.nav-menu') || document.querySelector('.nav-links');
  const overlay = document.getElementById('overlay'); // Might be null on home page
  
  const toggleMenu = () => {
    if (mobileNav) mobileNav.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
    
    // Simple hamburger animation toggle
    const spans = hamburger.querySelectorAll('span');
    if (spans.length === 3) {
      if (mobileNav && mobileNav.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    }
  };

  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }
  if (overlay) {
    overlay.addEventListener('click', toggleMenu);
  }

  // Close menu on link click
  const navLinksList = document.querySelectorAll('.nav-link, .nav-links a');
  navLinksList.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav && mobileNav.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  // --- STATS COUNTER ANIMATION ---
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const rawTarget = target.getAttribute('data-target');
          if (!rawTarget) return;
          const endValue = parseInt(rawTarget);
          if (isNaN(endValue)) return;
          let startValue = 0;
          const duration = 2000;
          const increment = endValue / (duration / 16); // 60fps
          
          const updateCounter = () => {
            startValue += increment;
            if (startValue < endValue) {
              target.innerText = Math.ceil(startValue);
              requestAnimationFrame(updateCounter);
            } else {
              target.innerText = endValue;
            }
          };
          updateCounter();
          observer.unobserve(target);
        }
      });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(num => observer.observe(num));
  }

  // --- GALLERY FILTERING ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  if (filterBtns.length > 0 && galleryItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active to clicked
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        galleryItems.forEach(item => {
          if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // --- LIGHTBOX IMPLEMENTATION ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  
  if (galleryItems.length > 0 && lightbox) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const imgSrc = item.querySelector('img').getAttribute('src');
        lightboxImg.setAttribute('src', imgSrc);
        lightbox.classList.add('active');
      });
    });
    
    const closeLightbox = () => lightbox.classList.remove('active');
    
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // --- CONTACT FORM SUBMISSION ---
  const contactForm = document.getElementById('contact-form');
  const successModal = document.getElementById('success-modal');
  const successClose = document.getElementById('success-close');
  const successBtn = document.getElementById('success-btn');

  if (contactForm && successModal) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerText;
      submitBtn.innerText = "Sending...";
      submitBtn.disabled = true;

      const formData = new FormData(contactForm);

      fetch("https://formsubmit.co/ajax/greenhouse.bza@gmail.com", {
        method: "POST",
        headers: {
            'Accept': 'application/json'
        },
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        // Show success modal
        successModal.classList.add('active');
        contactForm.reset();
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
      })
      .catch(error => {
        console.error("Error:", error);
        alert("Oops! There was a problem submitting your form. Please check your network and try again.");
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
      });
    });

    const closeSuccess = () => successModal.classList.remove('active');
    
    if (successClose) successClose.addEventListener('click', closeSuccess);
    if (successBtn) successBtn.addEventListener('click', closeSuccess);
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) closeSuccess();
    });
  }

});

/* --- HOME PAGE SPECIFIC JS --- */
document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
            navbar.style.padding = '10px 0';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
            navbar.style.padding = '15px 0';
        }
    });

    // Simple hotspot interaction
    const hotspots = document.querySelectorAll('.hotspot');
    hotspots.forEach(hotspot => {
        hotspot.addEventListener('mouseenter', () => {
            hotspot.style.transform = 'translateY(-5px) scale(1.05)';
        });
        hotspot.addEventListener('mouseleave', () => {
            hotspot.style.transform = 'none';
        });
    });
});


