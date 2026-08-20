/* ============================================
   WeDent - Main JavaScript
   Theme | Mobile Menu | Animations | Lightbox
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- Preloader ---
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    window.addEventListener('load', () => preloader.classList.add('loaded'));
    setTimeout(() => preloader.classList.add('loaded'), 3000);
  }

  // --- Theme Toggle ---
  const themeToggle = document.querySelector('.theme-toggle');
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('wedent-theme') || 'light';
  html.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('wedent-theme', next);
      themeToggle.innerHTML = next === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
    themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  }

  // --- RTL Toggle ---
  const rtlToggle = document.querySelector('.rtl-toggle');
  const savedDir = localStorage.getItem('wedent-dir') || 'ltr';
  html.setAttribute('dir', savedDir);

  if (rtlToggle) {
    rtlToggle.addEventListener('click', () => {
      const current = html.getAttribute('dir');
      const next = current === 'ltr' ? 'rtl' : 'ltr';
      html.setAttribute('dir', next);
      localStorage.setItem('wedent-dir', next);
      rtlToggle.textContent = next === 'rtl' ? 'LTR' : 'RTL';
    });
    rtlToggle.textContent = savedDir === 'rtl' ? 'LTR' : 'RTL';
  }

  // --- Navbar Scroll ---
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
    window.dispatchEvent(new Event('scroll'));
  }

  // --- Mobile Menu ---
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.navbar-nav');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navMenu.querySelectorAll('.nav-dropdown > .nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          link.closest('.nav-dropdown').classList.toggle('open');
        }
      });
    });

    navMenu.querySelectorAll('.dropdown-item').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // --- Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Counter Animation ---
  const counters = document.querySelectorAll('.stat-number');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const count = parseInt(target.getAttribute('data-count'));
          const suffix = target.getAttribute('data-suffix') || '';
          let current = 0;
          const increment = count / 60;
          const timer = setInterval(() => {
            current += increment;
            if (current >= count) {
              current = count;
              clearInterval(timer);
            }
            target.textContent = Math.floor(current) + suffix;
          }, 30);
          counterObserver.unobserve(target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));
  }

  // --- FAQ Accordion ---
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item.active').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  // --- Gallery Lightbox ---
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox?.querySelector('img');
  const galleryItems = document.querySelectorAll('.gallery-item');
  let currentGalleryIndex = 0;

  if (lightbox && galleryItems.length) {
    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        currentGalleryIndex = index;
        const img = item.querySelector('img');
        if (img && lightboxImg) {
          lightboxImg.src = img.src;
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    lightbox.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

    document.querySelector('.lightbox-prev')?.addEventListener('click', () => {
      currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
      updateLightboxImage();
    });

    document.querySelector('.lightbox-next')?.addEventListener('click', () => {
      currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
      updateLightboxImage();
    });

    function updateLightboxImage() {
      const img = galleryItems[currentGalleryIndex].querySelector('img');
      if (img && lightboxImg) lightboxImg.src = img.src;
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // --- Back to Top ---
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Active Nav Link ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- Form Validation (Contact/Appointment) ---
  const forms = document.querySelectorAll('form[data-validate]');
  forms.forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;
      this.querySelectorAll('[required]').forEach(input => {
        if (!input.value.trim()) {
          valid = false;
          input.style.borderColor = '#ef4444';
        } else {
          input.style.borderColor = '';
        }
      });
      if (valid) {
        const btn = this.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Sent Successfully!';
        btn.style.background = '#06d6a0';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          this.reset();
        }, 2500);
      }
    });
  });

  // --- Countdown (Coming Soon) ---
  const countdownEl = document.querySelector('.countdown');
  if (countdownEl) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);

    function updateCountdown() {
      const now = new Date();
      const diff = targetDate - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const items = countdownEl.querySelectorAll('.count-number');
      if (items[0]) items[0].textContent = String(days).padStart(2, '0');
      if (items[1]) items[1].textContent = String(hours).padStart(2, '0');
      if (items[2]) items[2].textContent = String(minutes).padStart(2, '0');
      if (items[3]) items[3].textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // --- Blog Filter ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const blogCards = document.querySelectorAll('article[data-category]');

  if (filterBtns.length && blogCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        blogCards.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
});
