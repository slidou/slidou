// ============================
// Init Lucide Icons
// ============================
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  initNavigation();
  initCounters();
  initContactForm();
  initMobileMenu();
});

// ============================
// NAVIGATION (SPA-like)
// ============================
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-section');

      // Update active link
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Switch section
      sections.forEach(s => {
        s.classList.remove('active-section');
        s.style.animation = 'none';
      });

      const target = document.getElementById(targetId);
      if (target) {
        // Force reflow for animation restart
        void target.offsetWidth;
        target.style.animation = '';
        target.classList.add('active-section');
      }

      // Close mobile menu if open
      closeMobileMenu();

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

// ============================
// COUNTER ANIMATION
// ============================
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 1800;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);

    el.textContent = current + '+';

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// ============================
// CONTACT FORM (simulated)
// ============================
function initContactForm() {
  const form = document.querySelector('.contact-form');
  const toast = document.getElementById('formToast');

  if (!form || !toast) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      showToast(toast, 'Veuillez remplir tous les champs.', false);
      return;
    }

    if (!isValidEmail(email)) {
      showToast(toast, 'Veuillez entrer un email valide.', false);
      return;
    }

    // Simulate sending
    showToast(toast, 'Message envoyé avec succès !', true);
    form.reset();

    setTimeout(() => {
      toast.classList.remove('visible');
    }, 4000);
  });
}

function showToast(toast, message, success) {
  toast.innerHTML = success
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>${message}`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>${message}`;

  toast.style.background = success
    ? 'rgba(34, 197, 94, 0.15)'
    : 'rgba(239, 68, 68, 0.15)';
  toast.style.borderColor = success
    ? 'rgba(34, 197, 94, 0.3)'
    : 'rgba(239, 68, 68, 0.3)';
  toast.style.color = success ? '#22C55E' : '#EF4444';

  toast.classList.add('visible');

  setTimeout(() => {
    toast.classList.remove('visible');
  }, 4000);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ============================
// MOBILE MENU
// ============================
function initMobileMenu() {
  const toggle = document.getElementById('mobileToggle');
  const sidebar = document.querySelector('.sidebar');

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  document.body.appendChild(overlay);

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
  });

  overlay.addEventListener('click', closeMobileMenu);
}

function closeMobileMenu() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('active');
}
