/* ═══════════════════════════════════════════════════════════════
   FreshCart — Auth (Login/Signup) Logic
   ═══════════════════════════════════════════════════════════════ */

const DEMO_USERS = [
  { name: 'Admin', email: 'admin@freshcart.com', password: 'admin123', role: 'admin' },
  { name: 'Demo User', email: 'user@freshcart.com', password: 'user123', role: 'user' },
];

function getUsers() {
  try {
    const stored = JSON.parse(localStorage.getItem('fc_users') || '[]');
    // Merge demo users if not present
    DEMO_USERS.forEach(du => {
      if (!stored.find(u => u.email === du.email)) stored.push({ ...du });
    });
    localStorage.setItem('fc_users', JSON.stringify(stored));
    return stored;
  } catch {
    localStorage.setItem('fc_users', JSON.stringify([...DEMO_USERS]));
    return [...DEMO_USERS];
  }
}

/* ── Login Page ──────────────────────────────────────────────── */
function initLoginPage() {
  const form = document.getElementById('login-form');
  if (!form) return;

  // Floating emoji animation
  initFloatingEmojis('login-floating-container');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const submitBtn = document.getElementById('login-submit');

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      showToast('Invalid email or password', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-small"></span> Signing in...';

    setTimeout(() => {
      setCurrentUser({ name: user.name, email: user.email, role: user.role });
      showToast('Welcome back! 🎉', 'success');
      setTimeout(() => { window.location.href = 'index.html'; }, 800);
    }, 600);
  });

  // Toggle password visibility
  const toggleBtn = document.getElementById('login-toggle-pass');
  const passInput = document.getElementById('login-password');
  if (toggleBtn && passInput) {
    toggleBtn.addEventListener('click', () => {
      const isPassword = passInput.type === 'password';
      passInput.type = isPassword ? 'text' : 'password';
      toggleBtn.innerHTML = isPassword ? ICONS.eyeOff : ICONS.eye;
    });
  }
}

/* ── Signup Page ──────────────────────────────────────────────── */
function initSignupPage() {
  const form = document.getElementById('signup-form');
  if (!form) return;

  let stage = 0;
  const stages = [
    { emoji: '🧺', text: "Let's get you started!", subtext: 'Create your FreshCart account' },
    { emoji: '📝', text: 'Fill in your details', subtext: 'Just a few more steps...' },
    { emoji: '🛒', text: 'Loading your cart...', subtext: 'Almost there!' },
    { emoji: '🎉', text: 'Welcome to FreshCart!', subtext: 'Your groceries await!' },
  ];

  const groceryItems = ['🍎', '🥕', '🧀', '🥬', '🍞', '🥛', '🍌', '🍅', '🥚', '🧅'];

  function updateMascot() {
    const mascotEl = document.getElementById('signup-mascot');
    const textEl = document.getElementById('signup-mascot-text');
    const subtextEl = document.getElementById('signup-mascot-subtext');
    const dotsEl = document.getElementById('signup-progress-dots');
    if (mascotEl) mascotEl.textContent = stages[stage].emoji;
    if (textEl) textEl.textContent = stages[stage].text;
    if (subtextEl) subtextEl.textContent = stages[stage].subtext;
    if (dotsEl) {
      dotsEl.innerHTML = stages.map((_, i) =>
        `<div class="dot ${i <= stage ? 'active' : ''}" ${i === stage ? 'style="animation:dotPulse 1.5s infinite"' : ''}></div>`
      ).join('');
    }
  }

  // Stage 0→1 when name field gets input
  const nameInput = document.getElementById('signup-name');
  nameInput?.addEventListener('input', () => {
    if (stage === 0 && nameInput.value.trim()) {
      stage = 1;
      updateMascot();
    }
  });

  initFloatingEmojis('signup-floating-container');
  updateMascot();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const submitBtn = document.getElementById('signup-submit');

    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    const users = getUsers();
    if (users.find(u => u.email === email)) {
      showToast('Email already registered', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-small"></span> Creating account...';

    // Stage 2: Loading animation
    stage = 2;
    updateMascot();

    // Animate groceries falling
    const bagEl = document.getElementById('signup-grocery-bag');
    if (bagEl) {
      bagEl.innerHTML = '';
      for (let i = 0; i < groceryItems.length; i++) {
        await new Promise(r => setTimeout(r, 150));
        const span = document.createElement('span');
        span.textContent = groceryItems[i];
        span.style.cssText = 'display:inline-block;font-size:1.5rem;animation:groceryFall 0.4s ease forwards;margin:0.125rem;';
        bagEl.appendChild(span);
      }
    }

    // Save user
    users.push({ name, email, password, role: 'user' });
    localStorage.setItem('fc_users', JSON.stringify(users));
    setCurrentUser({ name, email, role: 'user' });

    // Stage 3: Success
    stage = 3;
    updateMascot();
    showToast('Account created successfully! 🛒', 'success');

    setTimeout(() => { window.location.href = 'index.html'; }, 2000);
  });

  // Toggle password visibility
  const toggleBtn = document.getElementById('signup-toggle-pass');
  const passInput = document.getElementById('signup-password');
  if (toggleBtn && passInput) {
    toggleBtn.addEventListener('click', () => {
      const isPassword = passInput.type === 'password';
      passInput.type = isPassword ? 'text' : 'password';
      toggleBtn.innerHTML = isPassword ? ICONS.eyeOff : ICONS.eye;
    });
  }
}

/* ── Floating Emojis Animation ───────────────────────────────── */
function initFloatingEmojis(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const emojis = ['🍎', '🥕', '🧀', '🥬', '🍞', '🥛', '🍌', '🧅'];
  emojis.forEach((emoji, i) => {
    const el = document.createElement('div');
    el.className = 'floating-emoji';
    el.textContent = emoji;
    el.style.cssText = `
      top: ${10 + (i * 12) % 80}%;
      left: ${5 + (i * 15) % 85}%;
      animation: floatEmoji ${4 + i * 0.5}s ease-in-out ${i * 0.3}s infinite;
    `;
    container.appendChild(el);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initLoginPage();
  initSignupPage();
});
