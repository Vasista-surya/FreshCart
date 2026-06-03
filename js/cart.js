/* ═══════════════════════════════════════════════════════════════
   FreshCart — Cart & Checkout Logic
   ═══════════════════════════════════════════════════════════════ */

/* ── Cart Page Renderer ──────────────────────────────────────── */
function initCartPage() {
  const container = document.getElementById('cart-content');
  if (!container) return;

  function render() {
    const items = getCart();
    const subtotal = getCartSubtotal();
    const deliveryFee = subtotal >= 499 ? 0 : 40;
    const total = subtotal + deliveryFee;

    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-state animate-scale-in" style="padding:5rem 1rem">
          <div class="emoji" style="font-size:5rem">🛒</div>
          <h3 style="font-size:1.5rem;margin-bottom:0.5rem">Your cart is empty</h3>
          <p>Browse our products and add some items to your cart</p>
          <a href="products.html" class="btn-primary" style="margin-top:1.5rem">Start Shopping</a>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <h1 class="animate-slide-up" style="font-family:var(--font-display);font-weight:700;font-size:1.875rem;color:var(--gray-900);margin-bottom:2rem">
        Shopping Cart <span style="font-size:1rem;font-weight:400;color:var(--gray-500)">(${items.reduce((s,i)=>s+i.quantity,0)} items)</span>
      </h1>
      <div class="cart-layout">
        <div>
          ${items.map((item, i) => `
            <div class="card cart-item reveal" style="transition-delay:${i*0.05}s">
              <a href="product-details.html?id=${item._id}">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
              </a>
              <div class="info">
                <a href="product-details.html?id=${item._id}" class="name">${item.name}</a>
                <p class="meta">${item.weight || ''} • ${item.category}</p>
                <p class="price">₹${item.price}</p>
              </div>
              <div class="qty-control" style="background:var(--gray-100);border:none;border-radius:var(--radius-xl);padding:0 0.25rem">
                <button onclick="updateCartQty('${item._id}',${item.quantity-1}); initCartPage(); updateNavCartBadge();" style="padding:0.5rem">${ICONS.minus}</button>
                <span class="qty" style="width:1.5rem;font-weight:600;font-size:0.875rem">${item.quantity}</span>
                <button onclick="updateCartQty('${item._id}',${item.quantity+1}); initCartPage(); updateNavCartBadge();" style="padding:0.5rem">${ICONS.plus}</button>
              </div>
              <div class="total-col">
                <p class="total">₹${item.price * item.quantity}</p>
                <button class="remove-btn" onclick="removeFromCart('${item._id}'); initCartPage(); updateNavCartBadge();">
                  ${ICONS.trash} Remove
                </button>
              </div>
            </div>
          `).join('')}
          <button class="clear-cart-btn" onclick="clearCart(); initCartPage(); updateNavCartBadge();">Clear entire cart</button>
        </div>
        <div>
          <div class="card order-summary">
            <h3>Order Summary</h3>
            <div class="summary-row">
              <span class="label">Subtotal</span>
              <span class="value">₹${subtotal}</span>
            </div>
            <div class="summary-row">
              <span class="label">Delivery</span>
              <span class="value ${deliveryFee === 0 ? 'free' : ''}">${deliveryFee === 0 ? 'FREE' : '₹'+deliveryFee}</span>
            </div>
            ${deliveryFee > 0 ? '<p class="summary-note">Free delivery on orders above ₹499</p>' : ''}
            <hr class="summary-divider">
            <div class="summary-row total">
              <span class="label">Total</span>
              <span class="value">₹${total}</span>
            </div>
            <a href="checkout.html" class="btn-primary" style="width:100%;margin-top:1rem;text-align:center">
              Proceed to Checkout ${ICONS.arrowRight}
            </a>
            <a href="products.html" style="display:block;text-align:center;font-size:0.875rem;color:var(--brand-600);font-weight:500;margin-top:0.75rem">Continue Shopping</a>
          </div>
        </div>
      </div>
    `;

    if (typeof initRevealAnimations === 'function') initRevealAnimations();
  }

  render();
}

/* ── Checkout Page ───────────────────────────────────────────── */
function initCheckoutPage() {
  const container = document.getElementById('checkout-content');
  if (!container) return;

  const items = getCart();
  const subtotal = getCartSubtotal();
  const deliveryFee = subtotal >= 499 ? 0 : 40;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding:5rem 1rem">
        <div class="emoji" style="font-size:3.5rem">🛒</div>
        <h3>Nothing to checkout</h3>
        <p>Add items to your cart first</p>
        <a href="products.html" class="btn-primary" style="margin-top:1.5rem">Browse Products</a>
      </div>
    `;
    return;
  }

  let paymentMethod = 'cod';

  container.innerHTML = `
    <h1 class="animate-slide-up" style="font-family:var(--font-display);font-weight:700;font-size:1.875rem;color:var(--gray-900);margin-bottom:2rem">Checkout</h1>
    <form id="checkout-form" class="checkout-layout">
      <div>
        <div class="card form-section" style="padding:1.5rem;margin-bottom:1.5rem">
          <h2>${ICONS.mapPin} Shipping Address</h2>
          <div class="form-grid">
            <div class="form-group full">
              <label>Full Name</label>
              <input type="text" class="input-field" name="fullName" required id="checkout-name">
            </div>
            <div class="form-group full">
              <label>Phone</label>
              <input type="tel" class="input-field" name="phone" required id="checkout-phone">
            </div>
            <div class="form-group full">
              <label>Street Address</label>
              <input type="text" class="input-field" name="street" required id="checkout-street">
            </div>
            <div class="form-group">
              <label>City</label>
              <input type="text" class="input-field" name="city" required id="checkout-city">
            </div>
            <div class="form-group">
              <label>State</label>
              <input type="text" class="input-field" name="state" required id="checkout-state">
            </div>
            <div class="form-group">
              <label>PIN Code</label>
              <input type="text" class="input-field" name="pincode" required id="checkout-pincode">
            </div>
          </div>
        </div>

        <div class="card form-section" style="padding:1.5rem">
          <h2>Payment Method</h2>
          <label class="payment-option selected" id="pay-cod">
            <input type="radio" name="payment" value="cod" checked class="sr-only">
            ${ICONS.cash}
            <div>
              <p class="label">Cash on Delivery</p>
              <p class="desc">Pay when your order arrives</p>
            </div>
          </label>
          <label class="payment-option" id="pay-online">
            <input type="radio" name="payment" value="online" class="sr-only">
            ${ICONS.creditCard}
            <div>
              <p class="label">Online Payment</p>
              <p class="desc">Pay via UPI, Card, or Net Banking</p>
            </div>
          </label>
        </div>
      </div>

      <div>
        <div class="card order-summary">
          <h3>Order Summary</h3>
          <div style="max-height:12rem;overflow-y:auto" class="scrollbar-hide">
            ${items.map(item => `
              <div class="checkout-item">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
                <span class="name">${item.name}</span>
                <span class="qty">x${item.quantity}</span>
                <span class="price">₹${item.price * item.quantity}</span>
              </div>
            `).join('')}
          </div>
          <hr class="summary-divider">
          <div class="summary-row"><span class="label">Subtotal</span><span class="value">₹${subtotal}</span></div>
          <div class="summary-row"><span class="label">Delivery</span><span class="value ${deliveryFee===0?'free':''}">${deliveryFee===0?'FREE':'₹'+deliveryFee}</span></div>
          <hr class="summary-divider">
          <div class="summary-row total"><span class="label">Total</span><span class="value">₹${total}</span></div>
          <button type="submit" class="btn-primary" style="width:100%;margin-top:1rem" id="place-order-btn">
            Place Order — ₹${total}
          </button>
        </div>
      </div>
    </form>
  `;

  // Payment toggle
  const payOptions = container.querySelectorAll('.payment-option');
  payOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      payOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      opt.querySelector('input').checked = true;
      paymentMethod = opt.querySelector('input').value;
    });
  });

  // Form submit
  document.getElementById('checkout-form')?.addEventListener('submit', (e) => {
    e.preventDefault();

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('fc_orders') || '[]');
    const order = {
      _id: 'ord_' + Date.now().toString(36),
      items: items.map(i => ({ name: i.name, image: i.image, quantity: i.quantity, price: i.price })),
      shippingAddress: {
        fullName: document.getElementById('checkout-name').value,
        phone: document.getElementById('checkout-phone').value,
        street: document.getElementById('checkout-street').value,
        city: document.getElementById('checkout-city').value,
        state: document.getElementById('checkout-state').value,
        pincode: document.getElementById('checkout-pincode').value,
      },
      paymentMethod,
      subtotal,
      deliveryFee,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    orders.unshift(order);
    localStorage.setItem('fc_orders', JSON.stringify(orders));

    clearCart();
    updateNavCartBadge();
    showToast('Order placed successfully! 🎉', 'success');
    setTimeout(() => { window.location.href = 'index.html'; }, 1500);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initCartPage();
  initCheckoutPage();
});
