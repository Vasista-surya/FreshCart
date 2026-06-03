/* ═══════════════════════════════════════════════════════════════
   FreshCart — Main JavaScript
   Data store, Navbar, Footer, Toast, Cart Sidebar, Search
   ═══════════════════════════════════════════════════════════════ */

/* ── SVG Icons ───────────────────────────────────────────────── */
const ICONS = {
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>',
  heartFill: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
  arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
  starEmpty: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  checkCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  alertCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
  infoCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  eyeOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>',
  mapPin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/></svg>',
  creditCard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
  cash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M2 10h2m16 0h2M2 14h2m16 0h2"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>',
  twitter: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
};

/* ── Product Data Store ──────────────────────────────────────── */
const CATEGORIES = [
  { _id: 'cat1', name: 'Grocery', slug: 'grocery', icon: '🛒', description: 'Rice, flour, pulses, oils, spices, salt, sugar', productCount: 10 },
  { _id: 'cat2', name: 'Fruits', slug: 'fruits', icon: '🍎', description: 'Fresh seasonal and imported fruits', productCount: 6 },
  { _id: 'cat3', name: 'Vegetables', slug: 'vegetables', icon: '🥬', description: 'Farm-fresh vegetables delivered daily', productCount: 6 },
  { _id: 'cat4', name: 'Dairy', slug: 'dairy', icon: '🥛', description: 'Milk, butter, cheese, paneer, ghee, curd', productCount: 6 },
  { _id: 'cat5', name: 'Snacks', slug: 'snacks', icon: '🍿', description: 'Biscuits, chips, namkeen, cookies', productCount: 6 },
  { _id: 'cat6', name: 'Beverages', slug: 'beverages', icon: '☕', description: 'Tea, coffee, soft drinks, juices', productCount: 6 },
  { _id: 'cat7', name: 'Personal Care', slug: 'personal-care', icon: '🧴', description: 'Toothpaste, soap, shampoo, skincare', productCount: 5 },
  { _id: 'cat8', name: 'Household', slug: 'household', icon: '🧹', description: 'Cleaning supplies, detergent, fresheners', productCount: 5 },
];

const PRODUCTS = [
  // ── Grocery (10 products) ─────────────────────────────────────
  { _id:'p1', name:'India Gate Basmati Rice (5kg)', category:'Grocery', price:399, mrp:450, stock:150, description:'Premium aged basmati rice with long grains and rich aroma. Perfect for biryanis and pulaos.', image:'assets/images/products/rice.png', weight:'5kg', brand:'India Gate', isFeatured:true, rating:4.5, numReviews:120 },
  { _id:'p2', name:'Aashirvaad Superior MP Atta (5kg)', category:'Grocery', price:290, mrp:335, stock:200, description:'100% whole wheat atta from the finest MP Sharbati wheat. Makes soft rotis every time.', image:'assets/images/products/wheat-flour.png', weight:'5kg', brand:'Aashirvaad', isFeatured:true, rating:4.6, numReviews:200 },
  { _id:'p3', name:'Tata Sampann Toor Dal (1kg)', category:'Grocery', price:165, mrp:189, stock:150, description:'Unpolished toor dal rich in protein. Cooks faster and tastes better.', image:'assets/images/products/toor-dal.png', weight:'1kg', brand:'Tata Sampann', rating:4.5, numReviews:110 },
  { _id:'p4', name:'Fortune Sunlite Sunflower Oil (1L)', category:'Grocery', price:180, mrp:210, stock:120, description:'Light and healthy refined sunflower oil rich in Vitamin E.', image:'assets/images/products/cooking-oil.png', weight:'1L', brand:'Fortune', isFeatured:true, rating:4.4, numReviews:150 },
  { _id:'p5', name:'MDH Garam Masala (100g)', category:'Grocery', price:95, mrp:110, stock:90, description:'Aromatic blend of whole spices ground to perfection.', image:'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop', weight:'100g', brand:'MDH', rating:4.6, numReviews:155 },
  { _id:'p6', name:'Tata Salt (1kg)', category:'Grocery', price:28, mrp:32, stock:200, description:'Iodized vacuum evaporated salt. Desh ka namak.', image:'assets/images/products/salt.png', weight:'1kg', brand:'Tata', rating:4.7, numReviews:250 },
  { _id:'p7', name:'Catch Turmeric Powder (200g)', category:'Grocery', price:55, mrp:65, stock:120, description:'Pure haldi powder with high curcumin content for cooking.', image:'https://images.pexels.com/photos/4198744/pexels-photo-4198744.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop', weight:'200g', brand:'Catch', rating:4.3, numReviews:70 },
  { _id:'p8', name:'Rajdhani Besan (500g)', category:'Grocery', price:85, mrp:99, stock:100, description:'Fine gram flour for pakoras, chilla and sweets.', image:'assets/images/products/besan.png', weight:'500g', brand:'Rajdhani', rating:4.2, numReviews:55 },
  { _id:'p9', name:'Uttam Sugar (1kg)', category:'Grocery', price:48, mrp:55, stock:180, description:'Refined white sugar for tea, coffee and cooking.', image:'assets/images/products/sugar.png', weight:'1kg', brand:'Uttam', rating:4.0, numReviews:35 },
  { _id:'p10', name:'Saffola Gold Oil (1L)', category:'Grocery', price:210, mrp:245, stock:90, description:'Dual seed oil with natural antioxidants. Heart-healthy choice.', image:'assets/images/products/cooking-oil.png', weight:'1L', brand:'Saffola', rating:4.5, numReviews:95 },
  // ── Fruits (6 products) ───────────────────────────────────────
  { _id:'p11', name:'Fresh Banana (Dozen)', category:'Fruits', price:50, mrp:55, stock:120, description:'Ripe yellow bananas. Nutritious and delicious.', image:'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop', weight:'12pcs', brand:'Farm Fresh', rating:4.2, numReviews:60 },
  { _id:'p12', name:'Fresh Apple - Shimla (1kg)', category:'Fruits', price:180, mrp:200, stock:80, description:'Sweet and crunchy Shimla apples rich in nutrients.', image:'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop', weight:'1kg', brand:'Farm Fresh', isFeatured:true, rating:4.4, numReviews:40 },
  { _id:'p13', name:'Fresh Orange - Nagpur (1kg)', category:'Fruits', price:90, mrp:110, stock:100, description:'Juicy Nagpur oranges bursting with Vitamin C.', image:'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=400&fit=crop', weight:'1kg', brand:'Farm Fresh', rating:4.3, numReviews:35 },
  { _id:'p14', name:'Fresh Pomegranate (500g)', category:'Fruits', price:120, mrp:140, stock:60, description:'Ruby red pomegranate seeds packed with antioxidants.', image:'https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?w=400&h=400&fit=crop', weight:'500g', brand:'Farm Fresh', rating:4.3, numReviews:30 },
  { _id:'p15', name:'Fresh Grapes - Green (500g)', category:'Fruits', price:75, mrp:85, stock:90, description:'Seedless green grapes, sweet and refreshing.', image:'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&h=400&fit=crop', weight:'500g', brand:'Farm Fresh', rating:4.1, numReviews:25 },
  { _id:'p16', name:'Fresh Watermelon (1pc)', category:'Fruits', price:60, mrp:70, stock:40, description:'Sweet and juicy watermelon, perfect summer fruit.', image:'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop', weight:'1pc (~2kg)', brand:'Farm Fresh', rating:4.0, numReviews:20 },
  // ── Vegetables (6 products) ───────────────────────────────────
  { _id:'p17', name:'Fresh Onion (1kg)', category:'Vegetables', price:35, mrp:40, stock:200, description:'Fresh red onions from Maharashtra farms. Essential for every kitchen.', image:'assets/images/products/onion.png', weight:'1kg', brand:'Farm Fresh', rating:4.1, numReviews:50 },
  { _id:'p18', name:'Fresh Tomato (1kg)', category:'Vegetables', price:30, mrp:35, stock:150, description:'Ripe and juicy tomatoes for curries and salads.', image:'assets/images/products/tomato.png', weight:'1kg', brand:'Farm Fresh', rating:4.0, numReviews:45 },
  { _id:'p19', name:'Fresh Potato (1kg)', category:'Vegetables', price:25, mrp:30, stock:250, description:'Clean and fresh potatoes. Indian kitchen staple.', image:'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=400&fit=crop', weight:'1kg', brand:'Farm Fresh', rating:4.0, numReviews:55 },
  { _id:'p20', name:'Fresh Spinach (250g)', category:'Vegetables', price:25, mrp:30, stock:80, description:'Fresh green palak leaves rich in iron and vitamins.', image:'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop', weight:'250g', brand:'Farm Fresh', rating:4.2, numReviews:30 },
  { _id:'p21', name:'Fresh Capsicum - Green (250g)', category:'Vegetables', price:30, mrp:40, stock:70, description:'Crunchy green bell peppers for salads and stir-fry.', image:'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=400&fit=crop', weight:'250g', brand:'Farm Fresh', rating:4.1, numReviews:25 },
  { _id:'p22', name:'Fresh Ginger (100g)', category:'Vegetables', price:20, mrp:25, stock:80, description:'Aromatic fresh ginger root for tea and cooking.', image:'assets/images/products/ginger.png', weight:'100g', brand:'Farm Fresh', rating:4.1, numReviews:25 },
  // ── Dairy (6 products) ────────────────────────────────────────
  { _id:'p23', name:'Amul Butter (100g)', category:'Dairy', price:56, mrp:60, stock:80, description:"Utterly butterly delicious. India's favorite butter.", image:'assets/images/products/butter.png', weight:'100g', brand:'Amul', isFeatured:true, rating:4.7, numReviews:220 },
  { _id:'p24', name:'Amul Gold Full Cream Milk (500ml)', category:'Dairy', price:34, mrp:34, stock:100, description:'Rich and creamy full cream milk. Perfect for chai.', image:'assets/images/products/milk.png', weight:'500ml', brand:'Amul', rating:4.5, numReviews:110 },
  { _id:'p25', name:'Amul Cheese Slices (200g)', category:'Dairy', price:110, mrp:125, stock:60, description:'Processed cheese slices perfect for sandwiches.', image:'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop', weight:'200g', brand:'Amul', rating:4.4, numReviews:80 },
  { _id:'p26', name:'Amul Fresh Paneer (200g)', category:'Dairy', price:90, mrp:100, stock:50, description:'Soft and fresh paneer made from pure milk.', image:'assets/images/products/paneer.png', weight:'200g', brand:'Amul', rating:4.5, numReviews:95 },
  { _id:'p27', name:'Mother Dairy Curd (400g)', category:'Dairy', price:35, mrp:35, stock:70, description:'Fresh and creamy set curd rich in probiotics.', image:'assets/images/products/curd.png', weight:'400g', brand:'Mother Dairy', rating:4.3, numReviews:65 },
  { _id:'p28', name:'Amul Ghee (1L)', category:'Dairy', price:560, mrp:610, stock:45, description:'Pure cow ghee with rich aroma and traditional taste.', image:'assets/images/products/ghee.png', weight:'1L', brand:'Amul', rating:4.6, numReviews:130 },
  // ── Snacks (6 products) ───────────────────────────────────────
  { _id:'p29', name:'Parle-G Gold Biscuits (1kg)', category:'Snacks', price:40, mrp:45, stock:200, description:"India's most loved glucose biscuit. Premium gold variant.", image:'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop', weight:'1kg', brand:'Parle', rating:4.5, numReviews:300 },
  { _id:'p30', name:'Haldiram Aloo Bhujia (400g)', category:'Snacks', price:75, mrp:85, stock:110, description:"Classic crispy potato-based namkeen. Everyone's favorite.", image:'assets/images/products/namkeen.png', weight:'400g', brand:'Haldirams', isFeatured:true, rating:4.4, numReviews:120 },
  { _id:'p31', name:'Sunfeast Dark Fantasy (200g)', category:'Snacks', price:45, mrp:50, stock:120, description:'Premium chocolate-filled cookies for a luxurious treat.', image:'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop', weight:'200g', brand:'Sunfeast', rating:4.6, numReviews:130 },
  { _id:'p32', name:"Lay's Classic Salted Chips (52g)", category:'Snacks', price:20, mrp:20, stock:200, description:'Thin and crispy potato chips with classic salt flavour.', image:'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop', weight:'52g', brand:"Lay's", rating:4.2, numReviews:200 },
  { _id:'p33', name:'Oreo Original Cookies (150g)', category:'Snacks', price:30, mrp:35, stock:160, description:'Iconic chocolate sandwich cookies with vanilla cream.', image:'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop', weight:'150g', brand:'Cadbury', rating:4.5, numReviews:140 },
  { _id:'p34', name:'Britannia Good Day Butter Cookies (250g)', category:'Snacks', price:35, mrp:40, stock:180, description:'Crunchy butter cookies with rich buttery taste.', image:'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop', weight:'250g', brand:'Britannia', rating:4.3, numReviews:110 },
  // ── Beverages (6 products) ────────────────────────────────────
  { _id:'p35', name:'Tata Tea Gold (500g)', category:'Beverages', price:255, mrp:290, stock:130, description:'15% long leaves for a rich, aromatic cup of tea.', image:'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=400&fit=crop', weight:'500g', brand:'Tata Tea', isFeatured:true, rating:4.5, numReviews:180 },
  { _id:'p36', name:'Nescafe Classic Coffee (200g)', category:'Beverages', price:275, mrp:310, stock:90, description:'Instant coffee for a quick and energizing brew.', image:'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop', weight:'200g', brand:'Nescafe', rating:4.4, numReviews:140 },
  { _id:'p37', name:'Coca-Cola Classic (750ml)', category:'Beverages', price:40, mrp:40, stock:200, description:'Iconic cola-flavoured carbonated drink.', image:'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=400&fit=crop', weight:'750ml', brand:'Coca-Cola', rating:4.3, numReviews:200 },
  { _id:'p38', name:'Real Mixed Fruit Juice (1L)', category:'Beverages', price:99, mrp:110, stock:80, description:'Mixed fruit juice with no added preservatives.', image:'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop', weight:'1L', brand:'Real', rating:4.3, numReviews:70 },
  { _id:'p39', name:'Bisleri Mineral Water (1L)', category:'Beverages', price:20, mrp:20, stock:500, description:'Pure and safe packaged drinking water.', image:'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=400&fit=crop', weight:'1L', brand:'Bisleri', rating:4.0, numReviews:40 },
  { _id:'p40', name:'Red Label Tea (500g)', category:'Beverages', price:195, mrp:220, stock:160, description:"India's favorite chai for everyday brewing.", image:'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=400&fit=crop', weight:'500g', brand:'Brooke Bond', rating:4.3, numReviews:100 },
  // ── Personal Care (5 products) ────────────────────────────────
  { _id:'p41', name:'Colgate Strong Teeth Toothpaste (200g)', category:'Personal Care', price:95, mrp:110, stock:120, description:'Cavity protection toothpaste with calcium boost.', image:'assets/images/products/toothpaste.png', weight:'200g', brand:'Colgate', rating:4.4, numReviews:150 },
  { _id:'p42', name:'Dettol Liquid Handwash (250ml)', category:'Personal Care', price:99, mrp:115, stock:100, description:'Antibacterial handwash that kills 99.9% germs.', image:'https://images.pexels.com/photos/3987151/pexels-photo-3987151.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop', weight:'250ml', brand:'Dettol', rating:4.5, numReviews:130 },
  { _id:'p43', name:'Dove Cream Beauty Bar (100g)', category:'Personal Care', price:52, mrp:60, stock:90, description:'Moisturizing beauty bar with 1/4 moisturizing cream.', image:'https://images.pexels.com/photos/3735149/pexels-photo-3735149.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop', weight:'100g', brand:'Dove', rating:4.5, numReviews:120 },
  { _id:'p44', name:'Head & Shoulders Shampoo (340ml)', category:'Personal Care', price:190, mrp:220, stock:75, description:'Anti-dandruff shampoo for clean, flake-free hair.', image:'https://images.pexels.com/photos/3993398/pexels-photo-3993398.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop', weight:'340ml', brand:'Head & Shoulders', rating:4.3, numReviews:90 },
  { _id:'p45', name:'Nivea Body Lotion (400ml)', category:'Personal Care', price:230, mrp:265, stock:55, description:'Deep moisture body lotion for smooth, supple skin.', image:'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop', weight:'400ml', brand:'Nivea', rating:4.4, numReviews:75 },
  // ── Household (5 products) ────────────────────────────────────
  { _id:'p46', name:'Vim Dishwash Gel (500ml)', category:'Household', price:99, mrp:115, stock:100, description:'Powerful dishwash gel that cuts through grease.', image:'https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop', weight:'500ml', brand:'Vim', rating:4.3, numReviews:90 },
  { _id:'p47', name:'Surf Excel Easy Wash (1kg)', category:'Household', price:135, mrp:155, stock:120, description:'Detergent powder for hand and machine wash.', image:'https://images.pexels.com/photos/5217882/pexels-photo-5217882.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop', weight:'1kg', brand:'Surf Excel', isFeatured:true, rating:4.4, numReviews:110 },
  { _id:'p48', name:'Lizol Floor Cleaner Citrus (500ml)', category:'Household', price:115, mrp:132, stock:80, description:'Disinfectant surface cleaner with citrus fragrance.', image:'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop', weight:'500ml', brand:'Lizol', rating:4.3, numReviews:60 },
  { _id:'p49', name:'Harpic Toilet Cleaner (500ml)', category:'Household', price:79, mrp:90, stock:90, description:'10x better cleaning with thick liquid formula.', image:'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop', weight:'500ml', brand:'Harpic', rating:4.2, numReviews:75 },
  { _id:'p50', name:'Scotch-Brite Scrub Pad (3pcs)', category:'Household', price:50, mrp:55, stock:130, description:'Heavy duty scrub pads for tough stains on utensils.', image:'https://images.pexels.com/photos/4239036/pexels-photo-4239036.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop', weight:'3pcs', brand:'Scotch-Brite', rating:4.4, numReviews:85 },
];

/* ── Helper: Get current page name ───────────────────────────── */
function getCurrentPage() {
  const path = window.location.pathname;
  const page = path.split('/').pop().replace('.html','') || 'index';
  return page;
}

/* ── Toast System ────────────────────────────────────────────── */
function showToast(message, type = 'success', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const iconMap = { success: ICONS.checkCircle, error: ICONS.alertCircle, info: ICONS.infoCircle };
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div class="toast-icon ${type}">${iconMap[type] || iconMap.info}</div>
    <p class="toast-message">${message}</p>
    <button class="toast-close" onclick="this.parentElement.remove()">${ICONS.x}</button>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ── Cart Helpers (localStorage) ─────────────────────────────── */
function getCart() {
  try { return JSON.parse(localStorage.getItem('fc_cart') || '[]'); }
  catch { return []; }
}

function saveCart(items) {
  localStorage.setItem('fc_cart', JSON.stringify(items));
  document.dispatchEvent(new CustomEvent('cartUpdated'));
}

function addToCart(product, qty = 1) {
  const items = getCart();
  const idx = items.findIndex(i => i._id === product._id);
  if (idx >= 0) {
    items[idx].quantity += qty;
  } else {
    items.push({ ...product, quantity: qty });
  }
  saveCart(items);
  showToast(`${product.name} added to cart`, 'success');
  openCartSidebar();
}

function updateCartQty(productId, qty) {
  if (qty < 1) return removeFromCart(productId);
  const items = getCart();
  const idx = items.findIndex(i => i._id === productId);
  if (idx >= 0) items[idx].quantity = qty;
  saveCart(items);
}

function removeFromCart(productId) {
  const items = getCart().filter(i => i._id !== productId);
  saveCart(items);
  showToast('Item removed from cart', 'info');
}

function clearCart() {
  saveCart([]);
}

function getCartCount() {
  return getCart().reduce((sum, i) => sum + i.quantity, 0);
}

function getCartSubtotal() {
  return getCart().reduce((sum, i) => sum + (i.price * i.quantity), 0);
}

/* ── Auth Helpers (localStorage) ─────────────────────────────── */
function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem('fc_user') || 'null'); }
  catch { return null; }
}

function setCurrentUser(user) {
  if (user) localStorage.setItem('fc_user', JSON.stringify(user));
  else localStorage.removeItem('fc_user');
  document.dispatchEvent(new CustomEvent('authChanged'));
}

/* ── Wishlist Helpers (localStorage) ─────────────────────────── */
function getWishlist() {
  try { return JSON.parse(localStorage.getItem('fc_wishlist') || '[]'); }
  catch { return []; }
}

function saveWishlist(items) {
  localStorage.setItem('fc_wishlist', JSON.stringify(items));
}

function toggleWishlist(productId) {
  const items = getWishlist();
  const idx = items.indexOf(productId);
  if (idx >= 0) {
    items.splice(idx, 1);
    showToast('Removed from wishlist', 'info');
  } else {
    items.push(productId);
    showToast('Added to wishlist ❤️', 'success');
  }
  saveWishlist(items);
}

function isInWishlist(productId) {
  return getWishlist().includes(productId);
}

/* ── Render Navbar ───────────────────────────────────────────── */
function renderNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const currentPage = getCurrentPage();
  const user = getCurrentUser();
  const count = getCartCount();

  const links = [
    { label: 'Home', path: 'index', href: 'index.html' },
    { label: 'Products', path: 'products', href: 'products.html' },
    { label: 'Categories', path: 'categories', href: 'categories.html' },
    { label: 'Contact', path: 'contact', href: 'contact.html' },
  ];

  nav.innerHTML = `
    <nav class="navbar" id="main-navbar">
      <div class="navbar-inner">
        <a href="index.html" class="nav-logo" id="nav-logo">
          <div class="nav-logo-icon">🛒</div>
          <span class="nav-logo-text">Fresh<span>Cart</span></span>
        </a>

        <div class="nav-links">
          ${links.map(l => `<a href="${l.href}" class="nav-link ${currentPage === l.path ? 'active' : ''}" id="nav-${l.label.toLowerCase()}">${l.label}</a>`).join('')}
        </div>

        <div class="nav-actions">
          <button class="nav-action-btn" id="nav-search-btn" title="Search">${ICONS.search}</button>
          ${user ? `<a href="settings.html" class="nav-action-btn" title="Settings">${ICONS.settings}</a>` : ''}
          <button class="nav-action-btn" id="nav-cart-btn" title="Cart">
            ${ICONS.cart}
            ${count > 0 ? `<span class="nav-cart-badge">${count > 99 ? '99+' : count}</span>` : ''}
          </button>
          ${user ? `
            <div class="nav-user-menu" id="nav-user-menu">
              <button class="nav-user-btn" id="nav-user-btn">
                <div class="nav-user-avatar">${user.name.charAt(0).toUpperCase()}</div>
                <span class="nav-user-name">${user.name.split(' ')[0]}</span>
              </button>
              <div class="nav-dropdown">
                <a href="settings.html">Settings</a>
                <a href="cart.html">My Cart</a>
                <hr>
                <button class="logout-btn" id="logout-btn">Logout</button>
              </div>
            </div>
          ` : `
            <a href="login.html" class="btn-primary nav-login-btn" id="nav-login-btn">Login</a>
          `}
          <button class="mobile-toggle" id="mobile-toggle">${ICONS.menu}</button>
        </div>
      </div>

      <div class="search-dropdown" id="search-dropdown">
        <div class="search-dropdown-inner">
          <div class="search-input-wrapper" id="search-wrapper">
            ${ICONS.search}
            <input type="text" class="input-field" placeholder="Search for groceries, fruits, vegetables..." id="search-input">
            <button class="search-clear-btn" id="search-clear" style="display:none">${ICONS.x}</button>
            <div class="search-results" id="search-results" style="display:none"></div>
          </div>
        </div>
      </div>

      <div class="mobile-menu" id="mobile-menu">
        ${links.map(l => `<a href="${l.href}" class="${currentPage === l.path ? 'active' : ''}">${l.label}</a>`).join('')}
      </div>
    </nav>
  `;

  // Event listeners
  const navbar = document.getElementById('main-navbar');

  // Scroll effect
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });

  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  mobileToggle?.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    mobileToggle.innerHTML = isOpen ? ICONS.x : ICONS.menu;
  });

  // Search toggle
  const searchBtn = document.getElementById('nav-search-btn');
  const searchDropdown = document.getElementById('search-dropdown');
  searchBtn?.addEventListener('click', () => {
    searchDropdown.classList.toggle('open');
    if (searchDropdown.classList.contains('open')) {
      document.getElementById('search-input')?.focus();
    }
  });

  // Search functionality
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const searchClear = document.getElementById('search-clear');
  let searchTimeout;

  searchInput?.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    const query = searchInput.value.trim();
    searchClear.style.display = query ? 'block' : 'none';

    if (query.length < 2) {
      searchResults.style.display = 'none';
      return;
    }

    searchTimeout = setTimeout(() => {
      const results = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 6);

      if (results.length > 0) {
        searchResults.innerHTML = results.map(p => `
          <button class="search-result-item" onclick="window.location.href='product-details.html?id=${p._id}'">
            <img src="${p.image}" alt="${p.name}" loading="lazy">
            <div style="flex:1;min-width:0">
              <p class="name">${p.name}</p>
              <p class="category">${p.category}</p>
            </div>
            <span class="price">₹${p.price}</span>
          </button>
        `).join('');
        searchResults.style.display = 'block';
      } else {
        searchResults.style.display = 'none';
      }
    }, 200);
  });

  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim()) {
      window.location.href = `products.html?search=${encodeURIComponent(searchInput.value.trim())}`;
    }
  });

  searchClear?.addEventListener('click', () => {
    searchInput.value = '';
    searchResults.style.display = 'none';
    searchClear.style.display = 'none';
    searchInput.focus();
  });

  // Cart sidebar
  document.getElementById('nav-cart-btn')?.addEventListener('click', openCartSidebar);

  // User menu toggle (click-based for mobile)
  const userMenu = document.getElementById('nav-user-menu');
  document.getElementById('nav-user-btn')?.addEventListener('click', () => {
    userMenu?.classList.toggle('open');
  });

  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    setCurrentUser(null);
    showToast('Logged out successfully', 'info');
    setTimeout(() => window.location.href = 'index.html', 500);
  });

  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (userMenu && !userMenu.contains(e.target)) userMenu.classList.remove('open');
    if (searchDropdown && !searchDropdown.contains(e.target) && e.target !== searchBtn) {
      searchDropdown.classList.remove('open');
    }
  });
}

/* ── Cart Sidebar ────────────────────────────────────────────── */
function openCartSidebar() {
  document.getElementById('cart-overlay')?.classList.add('open');
  document.getElementById('cart-sidebar')?.classList.add('open');
  document.body.style.overflow = 'hidden';
  renderCartSidebar();
}

function closeCartSidebar() {
  document.getElementById('cart-overlay')?.classList.remove('open');
  document.getElementById('cart-sidebar')?.classList.remove('open');
  document.body.style.overflow = '';
}

function renderCartSidebar() {
  const body = document.getElementById('cart-sidebar-body');
  const footer = document.getElementById('cart-sidebar-footer');
  const headerBadge = document.getElementById('cart-sidebar-badge');
  if (!body) return;

  const items = getCart();
  const count = getCartCount();
  const subtotal = getCartSubtotal();

  if (headerBadge) headerBadge.innerHTML = count > 0 ? `<span class="badge" style="background:var(--brand-100);color:var(--brand-700)">${count} items</span>` : '';

  if (items.length === 0) {
    body.innerHTML = `
      <div class="cart-sidebar-empty">
        <div class="emoji">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Add some fresh groceries to get started</p>
        <a href="products.html" class="btn-primary" style="font-size:0.875rem" onclick="closeCartSidebar()">Browse Products</a>
      </div>
    `;
    if (footer) footer.style.display = 'none';
    return;
  }

  body.innerHTML = items.map(item => `
    <div class="cart-sidebar-item">
      <img src="${item.image}" alt="${item.name}" loading="lazy">
      <div class="info">
        <h4>${item.name}</h4>
        <p class="weight">${item.weight || ''}</p>
        <p class="price">₹${item.price * item.quantity}</p>
      </div>
      <div class="controls">
        <div class="qty-control">
          <button onclick="updateCartQty('${item._id}', ${item.quantity - 1}); renderCartSidebar(); updateNavCartBadge();">${ICONS.minus}</button>
          <span class="qty">${item.quantity}</span>
          <button onclick="updateCartQty('${item._id}', ${item.quantity + 1}); renderCartSidebar(); updateNavCartBadge();">${ICONS.plus}</button>
        </div>
        <button class="remove-btn" onclick="removeFromCart('${item._id}'); renderCartSidebar(); updateNavCartBadge();">Remove</button>
      </div>
    </div>
  `).join('');

  if (footer) {
    footer.style.display = 'block';
    footer.innerHTML = `
      <div class="subtotal">
        <span class="subtotal-label">Subtotal</span>
        <span class="subtotal-value">₹${subtotal}</span>
      </div>
      <div class="actions">
        <button class="btn-secondary" onclick="clearCart(); renderCartSidebar(); updateNavCartBadge();">Clear</button>
        <a href="checkout.html" class="btn-primary" style="text-align:center" onclick="closeCartSidebar()">Checkout</a>
      </div>
      <a href="cart.html" class="view-cart" onclick="closeCartSidebar()">View full cart →</a>
    `;
  }
}

function updateNavCartBadge() {
  const count = getCartCount();
  const badge = document.querySelector('.nav-cart-badge');
  if (badge) {
    badge.textContent = count > 99 ? '99+' : count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  } else if (count > 0) {
    const btn = document.getElementById('nav-cart-btn');
    if (btn) {
      const span = document.createElement('span');
      span.className = 'nav-cart-badge';
      span.textContent = count;
      btn.appendChild(span);
    }
  }
}

/* ── Render Footer ───────────────────────────────────────────── */
function renderFooter() {
  const el = document.getElementById('footer');
  if (!el) return;

  el.innerHTML = `
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="index.html" class="nav-logo" style="margin-bottom:1rem;display:inline-flex">
              <div class="nav-logo-icon">🛒</div>
              <span class="nav-logo-text" style="color:var(--white)">Fresh<span style="color:var(--brand-400)">Cart</span></span>
            </a>
            <p>Premium quality groceries, fresh produce, and daily essentials delivered to your doorstep. Quality you can trust.</p>
            <div>
              <div class="footer-contact-item">${ICONS.mail}<span>support@freshcart.com</span></div>
              <div class="footer-contact-item">${ICONS.phone}<span>+91 98765 43210</span></div>
              <div class="footer-contact-item">${ICONS.mapPin}<span>Mumbai, Maharashtra, India</span></div>
            </div>
          </div>
          <div class="footer-section">
            <h3>Shop</h3>
            <ul>
              <li><a href="products.html">All Products</a></li>
              <li><a href="categories.html">Categories</a></li>
              <li><a href="products.html?category=Fruits">Fresh Fruits</a></li>
              <li><a href="products.html?category=Vegetables">Vegetables</a></li>
              <li><a href="products.html?category=Dairy">Dairy</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h3>Account</h3>
            <ul>
              <li><a href="cart.html">Cart</a></li>
              <li><a href="settings.html">Settings</a></li>
              <li><a href="login.html">Login</a></li>
              <li><a href="signup.html">Sign Up</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h3>Company</h3>
            <ul>
              <li><a href="contact.html">About Us</a></li>
              <li><a href="contact.html">Contact</a></li>
              <li><a href="contact.html">Privacy Policy</a></li>
              <li><a href="contact.html">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="footer-bottom-inner">
          <p>© ${new Date().getFullYear()} FreshCart. All rights reserved.</p>
          <div class="footer-socials">
            <a href="#" aria-label="Facebook">${ICONS.facebook}</a>
            <a href="#" aria-label="Twitter">${ICONS.twitter}</a>
            <a href="#" aria-label="Instagram">${ICONS.instagram}</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}

/* ── Product Card Renderer ───────────────────────────────────── */
function renderProductCard(product) {
  const discount = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const user = getCurrentUser();
  const wishlisted = isInWishlist(product._id);

  return `
    <div class="card product-card reveal" id="product-card-${product._id}">
      <div class="image-wrap">
        <a href="product-details.html?id=${product._id}">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
        </a>
        <div class="badges">
          ${discount > 0 ? `<span class="badge badge-discount">${discount}% OFF</span>` : ''}
          ${product.isFeatured ? '<span class="badge badge-featured">Featured</span>' : ''}
          ${product.stock === 0 ? '<span class="badge badge-oos">Out of Stock</span>' : ''}
        </div>
        ${user ? `
          <button class="wishlist-btn" onclick="event.preventDefault(); event.stopPropagation(); toggleWishlist('${product._id}'); this.innerHTML = isInWishlist('${product._id}') ? '${ICONS.heartFill.replace(/'/g,"\\'")}' : '${ICONS.heart.replace(/'/g,"\\'")}'; this.querySelector('svg').style.color = isInWishlist('${product._id}') ? 'var(--red-500)' : 'var(--gray-600)';" id="wishlist-btn-${product._id}">
            ${wishlisted ? `<span style="color:var(--red-500)">${ICONS.heartFill}</span>` : ICONS.heart}
          </button>
        ` : ''}
      </div>
      <div class="info">
        <a href="product-details.html?id=${product._id}">
          <p class="category-label">${product.category}</p>
          <h3 class="line-clamp-2">${product.name}</h3>
        </a>
        ${product.weight ? `<p class="weight">${product.weight}</p>` : ''}
        <div class="price-row">
          <div>
            <span class="price">₹${product.price}</span>
            ${product.mrp > product.price ? `<span class="mrp">₹${product.mrp}</span>` : ''}
          </div>
          <button class="btn-icon-brand ${product.stock === 0 ? 'disabled' : ''}"
            onclick="event.preventDefault(); addToCart(PRODUCTS.find(p=>p._id==='${product._id}'))"
            ${product.stock === 0 ? 'disabled' : ''}
            id="add-to-cart-${product._id}">
            ${ICONS.plus}
          </button>
        </div>
      </div>
    </div>
  `;
}

/* ── Star Rating Renderer ────────────────────────────────────── */
function renderStars(rating) {
  let html = '<div class="stars">';
  for (let i = 1; i <= 5; i++) {
    html += i <= Math.round(rating)
      ? `<span class="filled">${ICONS.star}</span>`
      : `<span class="empty">${ICONS.starEmpty}</span>`;
  }
  html += '</div>';
  return html;
}

/* ── Init on Every Page ──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();

  // Listen for cart updates to refresh badge
  document.addEventListener('cartUpdated', updateNavCartBadge);

  // Cart sidebar overlay close
  document.getElementById('cart-overlay')?.addEventListener('click', closeCartSidebar);
  document.getElementById('cart-close-btn')?.addEventListener('click', closeCartSidebar);
});
