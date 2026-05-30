const bcrypt = require('bcryptjs')

// ── Product Data ────────────────────────────────────────────────
const categoriesData = [
  { _id: 'cat1', name: 'Grocery', slug: 'grocery', icon: '🛒', description: 'Rice, flour, pulses, oils, spices, salt, sugar', order: 1, isActive: true },
  { _id: 'cat2', name: 'Fruits', slug: 'fruits', icon: '🍎', description: 'Fresh seasonal and imported fruits', order: 2, isActive: true },
  { _id: 'cat3', name: 'Vegetables', slug: 'vegetables', icon: '🥬', description: 'Farm-fresh vegetables delivered daily', order: 3, isActive: true },
  { _id: 'cat4', name: 'Dairy', slug: 'dairy', icon: '🥛', description: 'Milk, butter, cheese, paneer, ghee, curd', order: 4, isActive: true },
  { _id: 'cat5', name: 'Snacks', slug: 'snacks', icon: '🍿', description: 'Biscuits, chips, namkeen, cookies', order: 5, isActive: true },
  { _id: 'cat6', name: 'Beverages', slug: 'beverages', icon: '☕', description: 'Tea, coffee, soft drinks, juices', order: 6, isActive: true },
  { _id: 'cat7', name: 'Personal Care', slug: 'personal-care', icon: '🧴', description: 'Toothpaste, soap, shampoo, skincare', order: 7, isActive: true },
  { _id: 'cat8', name: 'Household', slug: 'household', icon: '🧹', description: 'Cleaning supplies, detergent, fresheners', order: 8, isActive: true },
]

const productsData = [
  // ── Grocery (10 products) ─────────────────────────────────────
  { _id: 'p1', name: 'India Gate Basmati Rice (5kg)', category: 'Grocery', price: 399, mrp: 450, stock: 150, description: 'Premium aged basmati rice with long grains and rich aroma. Perfect for biryanis and pulaos.', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop', weight: '5kg', brand: 'India Gate', isFeatured: true, rating: 4.5, numReviews: 120 },
  { _id: 'p2', name: 'Aashirvaad Superior MP Atta (5kg)', category: 'Grocery', price: 290, mrp: 335, stock: 200, description: '100% whole wheat atta from the finest MP Sharbati wheat. Makes soft rotis every time.', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop', weight: '5kg', brand: 'Aashirvaad', isFeatured: true, rating: 4.6, numReviews: 200 },
  { _id: 'p3', name: 'Tata Sampann Toor Dal (1kg)', category: 'Grocery', price: 165, mrp: 189, stock: 150, description: 'Unpolished toor dal rich in protein. Cooks faster and tastes better.', image: 'https://images.unsplash.com/photo-1585996746454-1c73e3a7087e?w=400&h=400&fit=crop', weight: '1kg', brand: 'Tata Sampann', rating: 4.5, numReviews: 110 },
  { _id: 'p4', name: 'Fortune Sunlite Sunflower Oil (1L)', category: 'Grocery', price: 180, mrp: 210, stock: 120, description: 'Light and healthy refined sunflower oil rich in Vitamin E.', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop', weight: '1L', brand: 'Fortune', isFeatured: true, rating: 4.4, numReviews: 150 },
  { _id: 'p5', name: 'MDH Garam Masala (100g)', category: 'Grocery', price: 95, mrp: 110, stock: 90, description: 'Aromatic blend of whole spices ground to perfection.', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop', weight: '100g', brand: 'MDH', rating: 4.6, numReviews: 155 },
  { _id: 'p6', name: 'Tata Salt (1kg)', category: 'Grocery', price: 28, mrp: 32, stock: 200, description: 'Iodized vacuum evaporated salt. Desh ka namak.', image: 'https://images.unsplash.com/photo-1618083707368-b3823daa2726?w=400&h=400&fit=crop', weight: '1kg', brand: 'Tata', rating: 4.7, numReviews: 250 },
  { _id: 'p7', name: 'Catch Turmeric Powder (200g)', category: 'Grocery', price: 55, mrp: 65, stock: 120, description: 'Pure haldi powder with high curcumin content for cooking.', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&h=400&fit=crop', weight: '200g', brand: 'Catch', rating: 4.3, numReviews: 70 },
  { _id: 'p8', name: 'Rajdhani Besan (500g)', category: 'Grocery', price: 85, mrp: 99, stock: 100, description: 'Fine gram flour for pakoras, chilla and sweets.', image: 'https://images.unsplash.com/photo-1627483262769-04d0a1401487?w=400&h=400&fit=crop', weight: '500g', brand: 'Rajdhani', rating: 4.2, numReviews: 55 },
  { _id: 'p9', name: 'Uttam Sugar (1kg)', category: 'Grocery', price: 48, mrp: 55, stock: 180, description: 'Refined white sugar for tea, coffee and cooking.', image: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=400&h=400&fit=crop', weight: '1kg', brand: 'Uttam', rating: 4.0, numReviews: 35 },
  { _id: 'p10', name: 'Saffola Gold Oil (1L)', category: 'Grocery', price: 210, mrp: 245, stock: 90, description: 'Dual seed oil with natural antioxidants. Heart-healthy choice.', image: 'https://images.unsplash.com/photo-1608797178974-15b35a61d121?w=400&h=400&fit=crop', weight: '1L', brand: 'Saffola', rating: 4.5, numReviews: 95 },

  // ── Fruits (6 products) ───────────────────────────────────────
  { _id: 'p11', name: 'Fresh Banana (Dozen)', category: 'Fruits', price: 50, mrp: 55, stock: 120, description: 'Ripe yellow bananas. Nutritious and delicious.', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop', weight: '12pcs', brand: 'Farm Fresh', rating: 4.2, numReviews: 60 },
  { _id: 'p12', name: 'Fresh Apple - Shimla (1kg)', category: 'Fruits', price: 180, mrp: 200, stock: 80, description: 'Sweet and crunchy Shimla apples rich in nutrients.', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop', weight: '1kg', brand: 'Farm Fresh', isFeatured: true, rating: 4.4, numReviews: 40 },
  { _id: 'p13', name: 'Fresh Orange - Nagpur (1kg)', category: 'Fruits', price: 90, mrp: 110, stock: 100, description: 'Juicy Nagpur oranges bursting with Vitamin C.', image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=400&fit=crop', weight: '1kg', brand: 'Farm Fresh', rating: 4.3, numReviews: 35 },
  { _id: 'p14', name: 'Fresh Pomegranate (500g)', category: 'Fruits', price: 120, mrp: 140, stock: 60, description: 'Ruby red pomegranate seeds packed with antioxidants.', image: 'https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?w=400&h=400&fit=crop', weight: '500g', brand: 'Farm Fresh', rating: 4.3, numReviews: 30 },
  { _id: 'p15', name: 'Fresh Grapes - Green (500g)', category: 'Fruits', price: 75, mrp: 85, stock: 90, description: 'Seedless green grapes, sweet and refreshing.', image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&h=400&fit=crop', weight: '500g', brand: 'Farm Fresh', rating: 4.1, numReviews: 25 },
  { _id: 'p16', name: 'Fresh Watermelon (1pc)', category: 'Fruits', price: 60, mrp: 70, stock: 40, description: 'Sweet and juicy watermelon, perfect summer fruit.', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop', weight: '1pc (~2kg)', brand: 'Farm Fresh', rating: 4.0, numReviews: 20 },

  // ── Vegetables (6 products) ───────────────────────────────────
  { _id: 'p17', name: 'Fresh Onion (1kg)', category: 'Vegetables', price: 35, mrp: 40, stock: 200, description: 'Fresh red onions from Maharashtra farms. Essential for every kitchen.', image: 'https://images.unsplash.com/photo-1618512496248-a07fe8376ee2?w=400&h=400&fit=crop', weight: '1kg', brand: 'Farm Fresh', rating: 4.1, numReviews: 50 },
  { _id: 'p18', name: 'Fresh Tomato (1kg)', category: 'Vegetables', price: 30, mrp: 35, stock: 150, description: 'Ripe and juicy tomatoes for curries and salads.', image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=400&h=400&fit=crop', weight: '1kg', brand: 'Farm Fresh', rating: 4.0, numReviews: 45 },
  { _id: 'p19', name: 'Fresh Potato (1kg)', category: 'Vegetables', price: 25, mrp: 30, stock: 250, description: 'Clean and fresh potatoes. Indian kitchen staple.', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=400&fit=crop', weight: '1kg', brand: 'Farm Fresh', rating: 4.0, numReviews: 55 },
  { _id: 'p20', name: 'Fresh Spinach (250g)', category: 'Vegetables', price: 25, mrp: 30, stock: 80, description: 'Fresh green palak leaves rich in iron and vitamins.', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop', weight: '250g', brand: 'Farm Fresh', rating: 4.2, numReviews: 30 },
  { _id: 'p21', name: 'Fresh Capsicum - Green (250g)', category: 'Vegetables', price: 30, mrp: 40, stock: 70, description: 'Crunchy green bell peppers for salads and stir-fry.', image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=400&fit=crop', weight: '250g', brand: 'Farm Fresh', rating: 4.1, numReviews: 25 },
  { _id: 'p22', name: 'Fresh Ginger (100g)', category: 'Vegetables', price: 20, mrp: 25, stock: 80, description: 'Aromatic fresh ginger root for tea and cooking.', image: 'https://images.unsplash.com/photo-1599242429907-de8159670f5f?w=400&h=400&fit=crop', weight: '100g', brand: 'Farm Fresh', rating: 4.1, numReviews: 25 },

  // ── Dairy (6 products) ────────────────────────────────────────
  { _id: 'p23', name: 'Amul Butter (100g)', category: 'Dairy', price: 56, mrp: 60, stock: 80, description: 'Utterly butterly delicious. India\'s favorite butter.', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc0d?w=400&h=400&fit=crop', weight: '100g', brand: 'Amul', isFeatured: true, rating: 4.7, numReviews: 220 },
  { _id: 'p24', name: 'Amul Gold Full Cream Milk (500ml)', category: 'Dairy', price: 34, mrp: 34, stock: 100, description: 'Rich and creamy full cream milk. Perfect for chai.', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop', weight: '500ml', brand: 'Amul', rating: 4.5, numReviews: 110 },
  { _id: 'p25', name: 'Amul Cheese Slices (200g)', category: 'Dairy', price: 110, mrp: 125, stock: 60, description: 'Processed cheese slices perfect for sandwiches.', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop', weight: '200g', brand: 'Amul', rating: 4.4, numReviews: 80 },
  { _id: 'p26', name: 'Amul Fresh Paneer (200g)', category: 'Dairy', price: 90, mrp: 100, stock: 50, description: 'Soft and fresh paneer made from pure milk.', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=400&fit=crop', weight: '200g', brand: 'Amul', rating: 4.5, numReviews: 95 },
  { _id: 'p27', name: 'Mother Dairy Curd (400g)', category: 'Dairy', price: 35, mrp: 35, stock: 70, description: 'Fresh and creamy set curd rich in probiotics.', image: 'https://images.unsplash.com/photo-1571244856353-fb0e521e784a?w=400&h=400&fit=crop', weight: '400g', brand: 'Mother Dairy', rating: 4.3, numReviews: 65 },
  { _id: 'p28', name: 'Amul Ghee (1L)', category: 'Dairy', price: 560, mrp: 610, stock: 45, description: 'Pure cow ghee with rich aroma and traditional taste.', image: 'https://images.unsplash.com/photo-1617470703128-26a0fc9af10f?w=400&h=400&fit=crop', weight: '1L', brand: 'Amul', rating: 4.6, numReviews: 130 },

  // ── Snacks (6 products) ───────────────────────────────────────
  { _id: 'p29', name: 'Parle-G Gold Biscuits (1kg)', category: 'Snacks', price: 40, mrp: 45, stock: 200, description: 'India\'s most loved glucose biscuit. Premium gold variant.', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop', weight: '1kg', brand: 'Parle', rating: 4.5, numReviews: 300 },
  { _id: 'p30', name: 'Haldiram Aloo Bhujia (400g)', category: 'Snacks', price: 75, mrp: 85, stock: 110, description: 'Classic crispy potato-based namkeen. Everyone\'s favorite.', image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=400&fit=crop', weight: '400g', brand: 'Haldirams', isFeatured: true, rating: 4.4, numReviews: 120 },
  { _id: 'p31', name: 'Sunfeast Dark Fantasy (200g)', category: 'Snacks', price: 45, mrp: 50, stock: 120, description: 'Premium chocolate-filled cookies for a luxurious treat.', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop', weight: '200g', brand: 'Sunfeast', rating: 4.6, numReviews: 130 },
  { _id: 'p32', name: 'Lay\'s Classic Salted Chips (52g)', category: 'Snacks', price: 20, mrp: 20, stock: 200, description: 'Thin and crispy potato chips with classic salt flavour.', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop', weight: '52g', brand: 'Lay\'s', rating: 4.2, numReviews: 200 },
  { _id: 'p33', name: 'Oreo Original Cookies (150g)', category: 'Snacks', price: 30, mrp: 35, stock: 160, description: 'Iconic chocolate sandwich cookies with vanilla cream.', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop', weight: '150g', brand: 'Cadbury', rating: 4.5, numReviews: 140 },
  { _id: 'p34', name: 'Britannia Good Day Butter Cookies (250g)', category: 'Snacks', price: 35, mrp: 40, stock: 180, description: 'Crunchy butter cookies with rich buttery taste.', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop', weight: '250g', brand: 'Britannia', rating: 4.3, numReviews: 110 },

  // ── Beverages (6 products) ────────────────────────────────────
  { _id: 'p35', name: 'Tata Tea Gold (500g)', category: 'Beverages', price: 255, mrp: 290, stock: 130, description: '15% long leaves for a rich, aromatic cup of tea.', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&h=400&fit=crop', weight: '500g', brand: 'Tata Tea', isFeatured: true, rating: 4.5, numReviews: 180 },
  { _id: 'p36', name: 'Nescafe Classic Coffee (200g)', category: 'Beverages', price: 275, mrp: 310, stock: 90, description: 'Instant coffee for a quick and energizing brew.', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop', weight: '200g', brand: 'Nescafe', rating: 4.4, numReviews: 140 },
  { _id: 'p37', name: 'Coca-Cola Classic (750ml)', category: 'Beverages', price: 40, mrp: 40, stock: 200, description: 'Iconic cola-flavoured carbonated drink.', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop', weight: '750ml', brand: 'Coca-Cola', rating: 4.3, numReviews: 200 },
  { _id: 'p38', name: 'Real Mixed Fruit Juice (1L)', category: 'Beverages', price: 99, mrp: 110, stock: 80, description: 'Mixed fruit juice with no added preservatives.', image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400&h=400&fit=crop', weight: '1L', brand: 'Real', rating: 4.3, numReviews: 70 },
  { _id: 'p39', name: 'Bisleri Mineral Water (1L)', category: 'Beverages', price: 20, mrp: 20, stock: 500, description: 'Pure and safe packaged drinking water.', image: 'https://images.unsplash.com/photo-1608889174633-41a7c2fe1f18?w=400&h=400&fit=crop', weight: '1L', brand: 'Bisleri', rating: 4.0, numReviews: 40 },
  { _id: 'p40', name: 'Red Label Tea (500g)', category: 'Beverages', price: 195, mrp: 220, stock: 160, description: 'India\'s favorite chai for everyday brewing.', image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cfa9?w=400&h=400&fit=crop', weight: '500g', brand: 'Brooke Bond', rating: 4.3, numReviews: 100 },

  // ── Personal Care (5 products) ────────────────────────────────
  { _id: 'p41', name: 'Colgate Strong Teeth Toothpaste (200g)', category: 'Personal Care', price: 95, mrp: 110, stock: 120, description: 'Cavity protection toothpaste with calcium boost.', image: 'https://images.unsplash.com/photo-1559599101-f09722fb4925?w=400&h=400&fit=crop', weight: '200g', brand: 'Colgate', rating: 4.4, numReviews: 150 },
  { _id: 'p42', name: 'Dettol Liquid Handwash (250ml)', category: 'Personal Care', price: 99, mrp: 115, stock: 100, description: 'Antibacterial handwash that kills 99.9% germs.', image: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=400&h=400&fit=crop', weight: '250ml', brand: 'Dettol', rating: 4.5, numReviews: 130 },
  { _id: 'p43', name: 'Dove Cream Beauty Bar (100g)', category: 'Personal Care', price: 52, mrp: 60, stock: 90, description: 'Moisturizing beauty bar with 1/4 moisturizing cream.', image: 'https://images.unsplash.com/photo-1607006342411-9a910c74bba2?w=400&h=400&fit=crop', weight: '100g', brand: 'Dove', rating: 4.5, numReviews: 120 },
  { _id: 'p44', name: 'Head & Shoulders Shampoo (340ml)', category: 'Personal Care', price: 190, mrp: 220, stock: 75, description: 'Anti-dandruff shampoo for clean, flake-free hair.', image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&h=400&fit=crop', weight: '340ml', brand: 'Head & Shoulders', rating: 4.3, numReviews: 90 },
  { _id: 'p45', name: 'Nivea Body Lotion (400ml)', category: 'Personal Care', price: 230, mrp: 265, stock: 55, description: 'Deep moisture body lotion for smooth, supple skin.', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop', weight: '400ml', brand: 'Nivea', rating: 4.4, numReviews: 75 },

  // ── Household (5 products) ────────────────────────────────────
  { _id: 'p46', name: 'Vim Dishwash Gel (500ml)', category: 'Household', price: 99, mrp: 115, stock: 100, description: 'Powerful dishwash gel that cuts through grease.', image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=400&h=400&fit=crop', weight: '500ml', brand: 'Vim', rating: 4.3, numReviews: 90 },
  { _id: 'p47', name: 'Surf Excel Easy Wash (1kg)', category: 'Household', price: 135, mrp: 155, stock: 120, description: 'Detergent powder for hand and machine wash.', image: 'https://images.unsplash.com/photo-1584813539806-2538b8d918c6?w=400&h=400&fit=crop', weight: '1kg', brand: 'Surf Excel', isFeatured: true, rating: 4.4, numReviews: 110 },
  { _id: 'p48', name: 'Lizol Floor Cleaner Citrus (500ml)', category: 'Household', price: 115, mrp: 132, stock: 80, description: 'Disinfectant surface cleaner with citrus fragrance.', image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=400&fit=crop', weight: '500ml', brand: 'Lizol', rating: 4.3, numReviews: 60 },
  { _id: 'p49', name: 'Harpic Toilet Cleaner (500ml)', category: 'Household', price: 79, mrp: 90, stock: 90, description: '10x better cleaning with thick liquid formula.', image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&h=400&fit=crop', weight: '500ml', brand: 'Harpic', rating: 4.2, numReviews: 75 },
  { _id: 'p50', name: 'Scotch-Brite Scrub Pad (3pcs)', category: 'Household', price: 50, mrp: 55, stock: 130, description: 'Heavy duty scrub pads for tough stains on utensils.', image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&h=400&fit=crop', weight: '3pcs', brand: 'Scotch-Brite', rating: 4.4, numReviews: 85 },
]

// Add computed fields
productsData.forEach(p => {
  p.isAvailable = p.stock > 0
  p.isFeatured = p.isFeatured || false
  p.rating = p.rating || 4.0
  p.numReviews = p.numReviews || 10
})

// Compute category product counts
categoriesData.forEach(c => {
  c.productCount = productsData.filter(p => p.category === c.name).length
})

// ── In-memory database ──────────────────────────────────────────
let db = {
  users: [],
  products: [...productsData],
  categories: [...categoriesData],
  carts: [],
  orders: [],
  wishlists: [],
}

function initialize() {
  // Seed demo users
  const salt = bcrypt.genSaltSync(10)
  if (!db.users.find(u => u.email === 'admin@freshcart.com')) {
    db.users.push({
      _id: 'user_admin',
      name: 'Admin',
      email: 'admin@freshcart.com',
      password: bcrypt.hashSync('admin123', salt),
      role: 'admin',
      createdAt: new Date().toISOString(),
    })
  }
  if (!db.users.find(u => u.email === 'user@freshcart.com')) {
    db.users.push({
      _id: 'user_demo',
      name: 'Demo User',
      email: 'user@freshcart.com',
      password: bcrypt.hashSync('user123', salt),
      role: 'user',
      createdAt: new Date().toISOString(),
    })
  }
  console.log('📦 Mock database initialized with', db.products.length, 'products and', db.categories.length, 'categories')
}

// ── Accessor functions ──────────────────────────────────────────
const getDb = () => db
const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8)

module.exports = { initialize, getDb, genId }
