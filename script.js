/* ============================================================
   SUNSHINE GROUP — Main JavaScript (Light Theme Update)
   ============================================================ */

'use strict';

// ─── Page Loader ──────────────────────────────────────────
(function () {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  const hasVisited = sessionStorage.getItem('luxe_visited');

  if (hasVisited) {
    loader.style.display = 'none';
    document.body.style.overflow = '';
  } else {
    document.body.style.overflow = 'hidden';
    sessionStorage.setItem('luxe_visited', '1');
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
      }, 1900);
    });
  }
})();

// ─── Convert Scroll-to-Top → WhatsApp Button ─────────────
(function () {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;

  // Replace button with WhatsApp anchor
  const wa = document.createElement('a');
  wa.id = 'scroll-top';
  wa.href = 'https://wa.me/9554953832'; // Update with real number
  wa.target = '_blank';
  wa.rel = 'noopener noreferrer';
  wa.setAttribute('aria-label', 'Chat on WhatsApp');
  wa.innerHTML = '<i class="fab fa-whatsapp"></i>';
  wa.style.cssText = 'display:flex;'; // ensure flex for centering

  btn.replaceWith(wa);
})();

// ─── Navbar Scroll Effect ─────────────────────────────────
const navbar = document.querySelector('.navbar');
if (navbar) {
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
}

// ─── Hamburger / Mobile Menu ──────────────────────────────
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ─── Mobile Accordion ─────────────────────────────────────
document.querySelectorAll('.mobile-nav-link[data-toggle]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const target = document.querySelector(btn.dataset.toggle);
    if (target) {
      const isOpen = target.style.display === 'block';
      target.style.display = isOpen ? 'none' : 'block';
      // Toggle arrow indicator
      const arrow = btn.textContent.trim().endsWith('▾') || btn.textContent.trim().endsWith('▴');
      if (!isOpen) {
        btn.innerHTML = btn.innerHTML.replace('▾', '▴');
      } else {
        btn.innerHTML = btn.innerHTML.replace('▴', '▾');
      }
    }
  });
});

// ─── Hero Slider ──────────────────────────────────────────
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slide-dot');
  if (!slides.length) return;

  let current = 0;
  let autoPlay;

  const infos = document.querySelectorAll('.hero-slide-info');

  const reraBadge = document.getElementById('heroReraBadge');

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    infos[current]?.classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
    infos[current]?.classList.add('active');
    if (reraBadge) reraBadge.classList.toggle('visible', current === 1);
  }

  function startAuto() {
    clearInterval(autoPlay);
    autoPlay = setInterval(() => goTo(current + 1), 4000);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startAuto(); });
  });

  startAuto();
}
initHeroSlider();

// ─── Scroll Reveal ────────────────────────────────────────
function initReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
}
initReveal();

// ─── Animated Counters ────────────────────────────────────
function animateCounter(el, target, suffix = '', duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const update = () => {
    start += step;
    if (start >= target) {
      el.textContent = target.toLocaleString() + suffix;
    } else {
      el.textContent = Math.floor(start).toLocaleString() + suffix;
      requestAnimationFrame(update);
    }
  };
  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCounter(el, parseInt(el.dataset.count), el.dataset.suffix || '');
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}
initCounters();

// ─── Testimonial Slider ───────────────────────────────────
function initTestimonialSlider() {
  const track = document.querySelector('.testimonials-track');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.testimonial-card'));
  const prevBtns = document.querySelectorAll('.slider-btn.prev');
  const nextBtns = document.querySelectorAll('.slider-btn.next');
  const dotsContainer = document.querySelector('.slider-dots');

  let current = 0;
  let autoPlayTimer;

  function getVisible() {
    if (window.innerWidth < 700) return 1;
    if (window.innerWidth < 1060) return 2;
    return 3;
  }

  function getMaxIndex() {
    return Math.max(0, cards.length - getVisible());
  }

  function buildDots() {
    if (!dotsContainer) return;
    const max = getMaxIndex();
    dotsContainer.innerHTML = '';
    for (let i = 0; i <= max; i++) {
      const d = document.createElement('div');
      d.className = 'slider-dot' + (i === current ? ' active' : '');
      d.addEventListener('click', () => { goTo(i); resetAuto(); });
      dotsContainer.appendChild(d);
    }
  }

  function updateDots() {
    if (!dotsContainer) return;
    dotsContainer.querySelectorAll('.slider-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function updateButtons() {
    prevBtns.forEach(btn => { btn.style.opacity = current === 0 ? '0.4' : '1'; });
    nextBtns.forEach(btn => { btn.style.opacity = current >= getMaxIndex() ? '0.4' : '1'; });
  }

  function render() {
    const visible = getVisible();
    const gapPx = 20;
    const cardWidth = (track.parentElement.offsetWidth - (gapPx * visible)) / visible;
    const offset = current * (cardWidth + gapPx);
    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
    updateButtons();
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, getMaxIndex()));
    render();
  }

  function resetAuto() {
    clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(() => {
      goTo(current >= getMaxIndex() ? 0 : current + 1);
    }, 4500);
  }

  prevBtns.forEach(btn => btn.addEventListener('click', () => { goTo(current - 1); resetAuto(); }));
  nextBtns.forEach(btn => btn.addEventListener('click', () => { goTo(current + 1); resetAuto(); }));

  window.addEventListener('resize', () => {
    current = Math.min(current, getMaxIndex());
    buildDots();
    render();
  }, { passive: true });

  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); resetAuto(); }
  }, { passive: true });

  buildDots();
  render();
  resetAuto();
}
initTestimonialSlider();

// ─── Progress Bars ────────────────────────────────────────
function initProgressBars() {
  const bars = document.querySelectorAll('.progress-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.style.width = (entry.target.dataset.width || '0') + '%', 300);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}
initProgressBars();

// ─── Project Filter ───────────────────────────────────────
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('[data-category]');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          setTimeout(() => card.style.opacity = '1', 10);
        } else {
          card.style.opacity = '0';
          setTimeout(() => card.style.display = 'none', 300);
        }
      });
    });
  });
}
initProjectFilter();

// ─── Contact Form ─────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      form.reset();
      showToast('Your message has been sent! We will contact you shortly.');
      setTimeout(() => btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message', 3000);
    }, 2000);
  });
}
initContactForm();

// ─── Toast Notification ───────────────────────────────────
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}
window.showToast = showToast;

// ─── Active Nav Link ──────────────────────────────────────
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.includes(currentPage)) link.classList.add('active');
  });
}
setActiveNavLink();

// ─── Smooth Page Transition ───────────────────────────────
document.body.style.opacity = '1';
document.body.style.transition = 'opacity 0.35s ease';

// When browser restores page from back/forward cache, reset opacity
window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    document.body.style.opacity = '1';
  }
});

document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto') && !href.startsWith('tel') && !href.startsWith('https://wa.me')) {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.style.opacity = '0';
      setTimeout(() => { window.location.href = href; }, 300);
    });
  }
});

// ─── Parallax Hero (zoom removed, translateY only) ────────
const heroSlides = document.querySelectorAll('.hero-slide');
if (heroSlides.length) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    heroSlides.forEach(slide => {
      slide.style.transform = `translateY(${scrolled * 0.25}px)`;
    });
  }, { passive: true });
}

// ─── Enquiry / Brochure / Video handlers ─────────────────
document.querySelectorAll('[data-enquiry]').forEach(btn => {
  btn.addEventListener('click', () => showToast('Thank you for your interest! Our team will reach out soon.'));
});
document.querySelectorAll('[data-brochure]').forEach(btn => {
  btn.addEventListener('click', () => showToast('Brochure download initiated! Check your downloads folder.'));
});
document.querySelectorAll('.video-testimonial').forEach(vid => {
  vid.addEventListener('click', () => showToast('Video testimonial player coming soon!'));
});

// ─── FAQ Accordion ────────────────────────────────────────
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-question')?.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ─── Gallery Carousel ─────────────────────────────────────
function initGalleryCarousel() {
  const slidesInner = document.getElementById('gallerySlides');
  if (!slidesInner) return;

  const slides = Array.from(slidesInner.querySelectorAll('.gallery-slide'));
  const dotsRow = document.getElementById('galleryDots');
  const thumbStrip = document.getElementById('galleryThumbs');
  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');
  const currentEl = document.getElementById('galleryCurrent');
  const totalEl = document.getElementById('galleryTotal');
  const expandBtn = document.getElementById('galleryExpand');
  const mainTrack = document.querySelector('.gallery-main-track');

  const lightbox = document.getElementById('galleryLightbox');
  const lbFrame = document.getElementById('lightboxFrame');
  const lbImg = document.getElementById('lightboxImg');
  const lbTitle = document.getElementById('lightboxTitle');
  const lbSub = document.getElementById('lightboxSub');
  const lbCounter = document.getElementById('lightboxCounter');
  const lbClose = document.getElementById('lightboxClose');
  const lbPrev = document.getElementById('lightboxPrev');
  const lbNext = document.getElementById('lightboxNext');
  const lbBackdrop = document.getElementById('lightboxBackdrop');

  const total = slides.length;
  let current = 0;
  let autoTimer = null;

  if (totalEl) totalEl.textContent = total;

  // Apply per-slide gradient backgrounds from data-gradient attribute
  slides.forEach(slide => {
    const grad = slide.dataset.gradient;
    if (grad) slide.style.background = grad;
  });

  // Build dot buttons
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to image ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsRow.appendChild(dot);
  });

  // Build thumbnails (same images as slides)
  slides.forEach((slide, i) => {
    const thumb = document.createElement('div');
    thumb.className = 'gallery-thumb' + (i === 0 ? ' active' : '');
    const grad = slide.dataset.gradient || 'linear-gradient(135deg,#0a1628,#1a2f5a)';
    thumb.style.background = grad;

    const imgEl = slide.querySelector('img');
    const imgSrc = imgEl ? imgEl.getAttribute('src') : null;
    if (imgSrc) {
      const tImg = document.createElement('img');
      tImg.src = imgSrc;
      tImg.alt = imgEl.alt || '';
      tImg.loading = 'lazy';
      tImg.onerror = function () { this.style.display = 'none'; };
      thumb.appendChild(tImg);
    }

    thumb.addEventListener('click', () => goTo(i));
    thumbStrip.appendChild(thumb);
  });

  function updateUI() {
    slidesInner.style.transform = 'translateX(-' + (current * 100) + '%)';

    if (currentEl) currentEl.textContent = current + 1;

    dotsRow.querySelectorAll('.gallery-dot').forEach((d, i) => d.classList.toggle('active', i === current));

    const thumbEls = thumbStrip.querySelectorAll('.gallery-thumb');
    thumbEls.forEach((t, i) => t.classList.toggle('active', i === current));

    // Scroll active thumb to center of the strip
    const activeThumb = thumbEls[current];
    if (activeThumb) {
      const scrollLeft = activeThumb.offsetLeft - (thumbStrip.offsetWidth / 2) + (activeThumb.offsetWidth / 2);
      thumbStrip.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }

  function goTo(index) {
    current = ((index % total) + total) % total;
    updateUI();
    resetAuto();
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }

  prevBtn && prevBtn.addEventListener('click', e => { e.stopPropagation(); goTo(current - 1); });
  nextBtn && nextBtn.addEventListener('click', e => { e.stopPropagation(); goTo(current + 1); });

  // Touch swipe support
  if (mainTrack) {
    let touchX = 0;
    mainTrack.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    mainTrack.addEventListener('touchend', e => {
      const diff = touchX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
    }, { passive: true });
  }

  // Arrow-key navigation (when lightbox is closed)
  document.addEventListener('keydown', e => {
    if (lightbox && lightbox.classList.contains('open')) return;
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  // ─── Lightbox ──────────────────────────────────────────────
  function updateLightbox(index) {
    const slide = slides[index];
    if (!slide) return;

    const grad = slide.dataset.gradient || 'linear-gradient(135deg,#0a1628,#1a2f5a)';
    const imgEl = slide.querySelector('img');
    const imgSrc = imgEl ? imgEl.getAttribute('src') : null;

    if (lbFrame) lbFrame.style.background = grad;

    if (lbImg) {
      lbImg.classList.remove('loaded');
      lbImg.style.display = 'block';
      if (imgSrc) {
        lbImg.src = imgSrc;
        lbImg.alt = imgEl.alt || '';
        lbImg.onload = () => lbImg.classList.add('loaded');
        lbImg.onerror = () => { lbImg.style.display = 'none'; };
      } else {
        lbImg.src = '';
        lbImg.style.display = 'none';
      }
    }

    if (lbTitle) lbTitle.textContent = slide.dataset.title || '';
    if (lbSub) lbSub.textContent = slide.dataset.sub || '';
    if (lbCounter) lbCounter.textContent = (index + 1) + ' / ' + total;
  }

  function openLightbox(index) {
    if (!lightbox) return;
    updateLightbox(index);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Click on main track (not on nav buttons) → open lightbox
  if (mainTrack) {
    mainTrack.addEventListener('click', e => {
      if (!e.target.closest('.gallery-nav') && !e.target.closest('.gallery-expand-btn')) {
        openLightbox(current);
      }
    });
  }
  expandBtn && expandBtn.addEventListener('click', e => { e.stopPropagation(); openLightbox(current); });

  lbClose && lbClose.addEventListener('click', closeLightbox);
  lbBackdrop && lbBackdrop.addEventListener('click', closeLightbox);

  lbPrev && lbPrev.addEventListener('click', () => {
    const idx = ((current - 1) % total + total) % total;
    goTo(idx);
    updateLightbox(idx);
  });
  lbNext && lbNext.addEventListener('click', () => {
    const idx = (current + 1) % total;
    goTo(idx);
    updateLightbox(idx);
  });

  document.addEventListener('keydown', e => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') { const idx = ((current-1)%total+total)%total; goTo(idx); updateLightbox(idx); }
    if (e.key === 'ArrowRight') { const idx = (current+1)%total; goTo(idx); updateLightbox(idx); }
  });

  updateUI();
  resetAuto();
}
initGalleryCarousel();