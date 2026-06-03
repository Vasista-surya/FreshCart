/* ═══════════════════════════════════════════════════════════════
   FreshCart — Products Page Logic
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  let activeCategory = params.get('category') || '';
  let searchQuery = params.get('search') || '';
  let sortBy = 'name';

  const headerEl = document.getElementById('products-header');
  const sidebarEl = document.getElementById('products-sidebar');
  const gridEl = document.getElementById('products-grid');
  const searchInput = document.getElementById('products-search');
  const sortSelect = document.getElementById('products-sort');

  if (searchInput && searchQuery) searchInput.value = searchQuery;

  function getFilteredProducts() {
    let results = [...PRODUCTS];

    if (activeCategory) {
      results = results.filter(p => p.category === activeCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q))
      );
    }

    switch (sortBy) {
      case 'name': results.sort((a,b) => a.name.localeCompare(b.name)); break;
      case '-name': results.sort((a,b) => b.name.localeCompare(a.name)); break;
      case 'price': results.sort((a,b) => a.price - b.price); break;
      case '-price': results.sort((a,b) => b.price - a.price); break;
      case '-rating': results.sort((a,b) => b.rating - a.rating); break;
    }

    return results;
  }

  function renderHeader(count) {
    if (!headerEl) return;
    headerEl.innerHTML = `
      <h1>${activeCategory || 'All Products'}</h1>
      <p>${count} products ${activeCategory ? `in ${activeCategory}` : 'available'}</p>
    `;
  }

  function renderSidebar() {
    if (!sidebarEl) return;
    sidebarEl.innerHTML = `
      <div class="sidebar-section">
        <form id="sidebar-search-form">
          <div class="search-input-wrapper">
            ${ICONS.search}
            <input type="text" class="input-field" placeholder="Search products..." id="products-search" value="${searchQuery}" style="padding-left:3rem;font-size:0.875rem">
          </div>
        </form>
      </div>
      <div class="sidebar-section">
        <h3>${ICONS.filter} Categories</h3>
        <div>
          <button class="filter-btn ${!activeCategory ? 'active' : ''}" data-category="">All Categories</button>
          ${CATEGORIES.map(cat => `
            <button class="filter-btn ${activeCategory === cat.name ? 'active' : ''}" data-category="${cat.name}">
              <span class="icon">${cat.icon}</span>${cat.name}
            </button>
          `).join('')}
        </div>
      </div>
      <div class="sidebar-section">
        <h3>Sort By</h3>
        <select class="input-field" id="products-sort" style="font-size:0.875rem">
          <option value="name" ${sortBy==='name'?'selected':''}>Name (A-Z)</option>
          <option value="-name" ${sortBy==='-name'?'selected':''}>Name (Z-A)</option>
          <option value="price" ${sortBy==='price'?'selected':''}>Price (Low to High)</option>
          <option value="-price" ${sortBy==='-price'?'selected':''}>Price (High to Low)</option>
          <option value="-rating" ${sortBy==='-rating'?'selected':''}>Highest Rated</option>
        </select>
      </div>
    `;

    // Category filter buttons
    sidebarEl.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategory = btn.dataset.category;
        searchQuery = '';
        const newSearch = document.getElementById('products-search');
        if (newSearch) newSearch.value = '';
        updateURL();
        render();
      });
    });

    // Sort
    document.getElementById('products-sort')?.addEventListener('change', (e) => {
      sortBy = e.target.value;
      render();
    });

    // Search form
    document.getElementById('sidebar-search-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      searchQuery = document.getElementById('products-search')?.value.trim() || '';
      activeCategory = '';
      updateURL();
      render();
    });
  }

  function renderGrid(products) {
    if (!gridEl) return;
    if (products.length === 0) {
      gridEl.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="emoji">🔍</div>
          <h3>No products found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      `;
      return;
    }
    gridEl.innerHTML = products.map(p => renderProductCard(p)).join('');
    // Init reveal animations
    if (typeof initRevealAnimations === 'function') initRevealAnimations();
  }

  function updateURL() {
    const params = new URLSearchParams();
    if (activeCategory) params.set('category', activeCategory);
    if (searchQuery) params.set('search', searchQuery);
    const newUrl = `products.html${params.toString() ? '?' + params.toString() : ''}`;
    history.replaceState(null, '', newUrl);
  }

  function render() {
    const products = getFilteredProducts();
    renderHeader(products.length);
    renderSidebar();
    renderGrid(products);
  }

  render();
});
