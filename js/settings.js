/* ═══════════════════════════════════════════════════════════════
   FreshCart — Settings Page Logic
   ═══════════════════════════════════════════════════════════════ */

function initSettingsPage() {
  const container = document.getElementById('settings-content');
  if (!container) return;

  const user = getCurrentUser();
  if (!user) {
    container.innerHTML = `
      <div class="empty-state" style="padding:5rem 1rem">
        <div class="emoji" style="font-size:3.5rem">🔒</div>
        <h3>Please log in</h3>
        <p>You need to be logged in to view settings</p>
        <a href="login.html" class="btn-primary" style="margin-top:1.5rem">Login</a>
      </div>
    `;
    return;
  }

  // Load preferences
  const prefs = JSON.parse(localStorage.getItem('fc_prefs') || '{}');
  const darkMode = prefs.darkMode || false;
  const emailNotif = prefs.emailNotif !== false;
  const orderNotif = prefs.orderNotif !== false;
  const promoNotif = prefs.promoNotif !== false;

  container.innerHTML = `
    <h1 class="animate-slide-up" style="font-family:var(--font-display);font-weight:700;font-size:1.875rem;color:var(--gray-900);margin-bottom:0.5rem">
      Settings
    </h1>
    <p style="color:var(--gray-500);margin-bottom:2rem">Manage your account preferences</p>

    <!-- Profile Section -->
    <div class="card settings-section reveal">
      <h2>${ICONS.user} Profile</h2>
      <div class="settings-row">
        <div>
          <div class="label">Name</div>
        </div>
        <div class="value">${user.name}</div>
      </div>
      <div class="settings-row">
        <div>
          <div class="label">Email</div>
        </div>
        <div class="value">${user.email}</div>
      </div>
      <div class="settings-row">
        <div>
          <div class="label">Role</div>
        </div>
        <div class="value" style="text-transform:capitalize">${user.role || 'user'}</div>
      </div>
    </div>

    <!-- Theme Section -->
    <div class="card settings-section reveal">
      <h2>${ICONS.moon} Theme</h2>
      <div class="settings-row">
        <div>
          <div class="label">Dark Mode</div>
          <div class="sublabel">Use dark theme for better night viewing</div>
        </div>
        <div class="toggle ${darkMode ? 'active' : ''}" id="toggle-dark" role="switch" aria-checked="${darkMode}"></div>
      </div>
    </div>

    <!-- Notifications Section -->
    <div class="card settings-section reveal">
      <h2>${ICONS.bell} Notifications</h2>
      <div class="settings-row">
        <div>
          <div class="label">Email Notifications</div>
          <div class="sublabel">Receive updates about your account</div>
        </div>
        <div class="toggle ${emailNotif ? 'active' : ''}" id="toggle-email" role="switch" aria-checked="${emailNotif}"></div>
      </div>
      <div class="settings-row">
        <div>
          <div class="label">Order Updates</div>
          <div class="sublabel">Get notified about order status changes</div>
        </div>
        <div class="toggle ${orderNotif ? 'active' : ''}" id="toggle-order" role="switch" aria-checked="${orderNotif}"></div>
      </div>
      <div class="settings-row">
        <div>
          <div class="label">Promotional Offers</div>
          <div class="sublabel">Receive deals and discount notifications</div>
        </div>
        <div class="toggle ${promoNotif ? 'active' : ''}" id="toggle-promo" role="switch" aria-checked="${promoNotif}"></div>
      </div>
    </div>

    <!-- Danger Zone -->
    <div class="card settings-section reveal" style="border:1px solid var(--red-100)">
      <h2 style="color:var(--red-600)">Danger Zone</h2>
      <div class="settings-row">
        <div>
          <div class="label">Logout</div>
          <div class="sublabel">Sign out of your account</div>
        </div>
        <button class="btn-secondary" style="color:var(--red-600);border-color:var(--red-100);font-size:0.875rem;padding:0.5rem 1rem" id="settings-logout">
          Logout
        </button>
      </div>
    </div>
  `;

  // Toggle handlers
  function setupToggle(id, prefKey) {
    const toggle = document.getElementById(id);
    if (!toggle) return;
    toggle.addEventListener('click', () => {
      const isActive = toggle.classList.toggle('active');
      toggle.setAttribute('aria-checked', isActive);
      const prefs = JSON.parse(localStorage.getItem('fc_prefs') || '{}');
      prefs[prefKey] = isActive;
      localStorage.setItem('fc_prefs', JSON.stringify(prefs));
      showToast('Preference updated', 'success');
    });
  }

  setupToggle('toggle-dark', 'darkMode');
  setupToggle('toggle-email', 'emailNotif');
  setupToggle('toggle-order', 'orderNotif');
  setupToggle('toggle-promo', 'promoNotif');

  // Logout
  document.getElementById('settings-logout')?.addEventListener('click', () => {
    setCurrentUser(null);
    showToast('Logged out successfully', 'info');
    setTimeout(() => { window.location.href = 'index.html'; }, 500);
  });

  if (typeof initRevealAnimations === 'function') initRevealAnimations();
}

document.addEventListener('DOMContentLoaded', initSettingsPage);
