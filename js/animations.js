/* ═══════════════════════════════════════════════════════════════
   FreshCart — Animations (JS-driven)
   Scroll reveal, stagger entrance, floating elements
   ═══════════════════════════════════════════════════════════════ */

/* ── Scroll Reveal via IntersectionObserver ───────────────────── */
function initRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ── Stagger animation for a container's children ────────────── */
function staggerReveal(container, delay = 50) {
  if (!container) return;
  const children = container.children;
  Array.from(children).forEach((child, i) => {
    child.style.opacity = '0';
    child.style.transform = 'translateY(20px)';
    child.style.transition = `opacity 0.5s ease ${i * delay}ms, transform 0.5s ease ${i * delay}ms`;
    setTimeout(() => {
      child.style.opacity = '1';
      child.style.transform = 'translateY(0)';
    }, 50);
  });
}

/* ── Page load animation ─────────────────────────────────────── */
function initPageAnimation() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.3s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
}

/* ── Initialize all on DOM ready ─────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initPageAnimation();
  // Slight delay to ensure content is rendered
  setTimeout(initRevealAnimations, 100);
});
