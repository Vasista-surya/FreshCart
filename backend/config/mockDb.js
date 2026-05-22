const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '..', 'data', 'db.json');

// Default seed data for Indian Kirana Store (Radhakrishna General Store)
const images = {
  rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
  flour: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop',
  dal: 'https://images.unsplash.com/photo-1585996746454-1c73e3a7087e?w=400&h=400&fit=crop',
  oil: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop',
  spices: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop',
  salt: 'https://images.unsplash.com/photo-1518110925495-5fe2c8cfe100?w=400&h=400&fit=crop',
  tea: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop',
  coffee: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop',
  biscuits: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop',
  snacks: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=400&fit=crop',
  beverages: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&h=400&fit=crop',
  dairy: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop',
  bread: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop',
  vegetables: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop',
  fruits: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=400&fit=crop',
  cleaning: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&h=400&fit=crop',
  personalCare: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
  eggs: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop',
  butter: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc0d?w=400&h=400&fit=crop',
  cheese: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop',
};

const categoriesData = [
  { _id: 'cat1', name: 'Rice & Grains', slug: 'rice-grains', icon: '🍚', image: images.rice, description: 'Premium quality rice and grains for your daily meals', order: 1, isActive: true },
  { _id: 'cat2', name: 'Atta & Flour', slug: 'atta-flour', icon: '🌾', image: images.flour, description: 'Fresh whole wheat atta and specialty flours', order: 2, isActive: true },
  { _id: 'cat3', name: 'Pulses & Dal', slug: 'pulses-dal', icon: '🫘', image: images.dal, description: 'Nutritious pulses and dal varieties', order: 3, isActive: true },
  { _id: 'cat4', name: 'Cooking Oils', slug: 'cooking-oils', icon: '🫒', image: images.oil, description: 'Pure and refined cooking oils', order: 4, isActive: true },
  { _id: 'cat5', name: 'Spices & Masala', slug: 'spices-masala', icon: '🌶️', image: images.spices, description: 'Authentic Indian spices and masala blends', order: 5, isActive: true },
  { _id: 'cat6', name: 'Salt & Sugar', slug: 'salt-sugar', icon: '🧂', image: images.salt, description: 'Essential salt and sugar products', order: 6, isActive: true },
  { _id: 'cat7', name: 'Tea & Coffee', slug: 'tea-coffee', icon: '☕', image: images.tea, description: 'Premium tea leaves and coffee blends', order: 7, isActive: true },
  { _id: 'cat8', name: 'Biscuits & Cookies', slug: 'biscuits-cookies', icon: '🍪', image: images.biscuits, description: 'Delicious biscuits and cookies for tea time', order: 8, isActive: true },
  { _id: 'cat9', name: 'Snacks & Namkeen', slug: 'snacks-namkeen', icon: '🍿', image: images.snacks, description: 'Crunchy snacks and traditional namkeen', order: 9, isActive: true },
  { _id: 'cat10', name: 'Beverages', slug: 'beverages', icon: '🥤', image: images.beverages, description: 'Refreshing drinks and beverages', order: 10, isActive: true },
  { _id: 'cat11', name: 'Dairy Products', slug: 'dairy-products', icon: '🥛', image: images.dairy, description: 'Fresh dairy products delivered daily', order: 11, isActive: true },
  { _id: 'cat12', name: 'Bread & Bakery', slug: 'bread-bakery', icon: '🍞', image: images.bread, description: 'Freshly baked bread and bakery items', order: 12, isActive: true },
  { _id: 'cat13', name: 'Fruits & Vegetables', slug: 'fruits-vegetables', icon: '🥬', image: images.vegetables, description: 'Farm-fresh fruits and vegetables', order: 13, isActive: true },
  { _id: 'cat14', name: 'Cleaning & Household', slug: 'cleaning-household', icon: '🧹', image: images.cleaning, description: 'Cleaning supplies and household essentials', order: 14, isActive: true },
  { _id: 'cat15', name: 'Personal Care', slug: 'personal-care', icon: '🧴', image: images.personalCare, description: 'Personal hygiene and care products', order: 15, isActive: true },
];

const rawProductsData = [
  // ── Rice & Grains (8 products) ──
  { name: 'India Gate Basmati Rice', description: 'Premium aged basmati rice with long grains and rich aroma. Perfect for biryanis and pulaos.', price: 399, mrp: 450, category: 'Rice & Grains', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop', stock: 150, unit: 'kg', weight: '5kg', brand: 'India Gate', isFeatured: true, rating: 4.5, numReviews: 120, tags: ['basmati', 'rice', 'premium'] },
  { name: 'Daawat Rozana Basmati Rice', description: 'Everyday basmati rice for daily cooking. Long grain and fluffy.', price: 325, mrp: 375, category: 'Rice & Grains', image: 'https://images.unsplash.com/photo-1536304997881-a372c179924b?w=400&h=400&fit=crop', stock: 120, unit: 'kg', weight: '5kg', brand: 'Daawat', rating: 4.2, numReviews: 85, tags: ['basmati', 'rice', 'everyday'] },
  { name: 'Fortune Everyday Basmati Rice', description: 'Affordable basmati rice for daily meals. Cooks fluffy and non-sticky.', price: 275, mrp: 310, category: 'Rice & Grains', image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=400&h=400&fit=crop', stock: 200, unit: 'kg', weight: '5kg', brand: 'Fortune', rating: 4.0, numReviews: 60, tags: ['basmati', 'rice'] },
  { name: 'Kohinoor Super Basmati Rice', description: 'Extra long grain aged basmati rice with authentic taste.', price: 520, mrp: 580, category: 'Rice & Grains', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=400&fit=crop', stock: 80, unit: 'kg', weight: '5kg', brand: 'Kohinoor', rating: 4.6, numReviews: 95, tags: ['basmati', 'premium', 'aged'] },
  { name: 'Tata Sampann Poha', description: 'Thick flattened rice, great for making poha breakfast.', price: 55, mrp: 65, category: 'Rice & Grains', image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=400&h=400&fit=crop', stock: 100, unit: 'g', weight: '500g', brand: 'Tata Sampann', rating: 4.1, numReviews: 40, tags: ['poha', 'flattened rice'] },
  { name: '24 Mantra Organic Brown Rice', description: 'Unpolished organic brown rice rich in fiber and nutrients.', price: 185, mrp: 210, category: 'Rice & Grains', image: 'https://images.unsplash.com/photo-1591814468924-cafb57c28348?w=400&h=400&fit=crop', stock: 60, unit: 'kg', weight: '1kg', brand: '24 Mantra', rating: 4.3, numReviews: 30, tags: ['organic', 'brown rice', 'healthy'] },
  { name: 'Lal Qilla Traditional Basmati', description: 'Traditional 1121 basmati with authentic aroma and extra-long grains.', price: 450, mrp: 499, category: 'Rice & Grains', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=400&fit=crop', stock: 70, unit: 'kg', weight: '5kg', brand: 'Lal Qilla', rating: 4.4, numReviews: 55, tags: ['basmati', 'traditional'] },
  { name: 'Sona Masoori Rice', description: 'Lightweight and aromatic South Indian rice variety. Ideal for daily cooking.', price: 150, mrp: 175, category: 'Rice & Grains', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop', stock: 180, unit: 'kg', weight: '5kg', brand: 'More', rating: 4.0, numReviews: 70, tags: ['sona masoori', 'south indian'] },

  // ── Atta & Flour (7 products) ──
  { name: 'Aashirvaad Superior MP Atta', description: '100% whole wheat atta made from the finest MP wheat. Makes soft rotis every time.', price: 290, mrp: 335, category: 'Atta & Flour', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop', stock: 200, unit: 'kg', weight: '5kg', brand: 'Aashirvaad', isFeatured: true, rating: 4.6, numReviews: 200, tags: ['atta', 'whole wheat', 'roti'] },
  { name: 'Pillsbury Chakki Fresh Atta', description: 'Freshly ground chakki atta for soft and fluffy chapatis.', price: 265, mrp: 299, category: 'Atta & Flour', image: 'https://images.unsplash.com/photo-1509440026859-f72288b7448e?w=400&h=400&fit=crop', stock: 150, unit: 'kg', weight: '5kg', brand: 'Pillsbury', rating: 4.3, numReviews: 90, tags: ['atta', 'chakki'] },
  { name: 'Aashirvaad Multigrain Atta', description: 'Blend of 6 grains — wheat, soya, oat, maize, psyllium husk & chana dal.', price: 320, mrp: 360, category: 'Atta & Flour', image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=400&h=400&fit=crop', stock: 80, unit: 'kg', weight: '5kg', brand: 'Aashirvaad', rating: 4.4, numReviews: 65, tags: ['multigrain', 'healthy'] },
  { name: 'Fortune Chakki Atta', description: 'Premium quality whole wheat flour for soft rotis.', price: 250, mrp: 280, category: 'Atta & Flour', image: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=400&h=400&fit=crop', stock: 130, unit: 'kg', weight: '5kg', brand: 'Fortune', rating: 4.1, numReviews: 45, tags: ['atta', 'whole wheat'] },
  { name: 'Rajdhani Besan', description: 'Fine gram flour (besan) for pakoras, chilla and sweets.', price: 85, mrp: 99, category: 'Atta & Flour', image: 'https://images.unsplash.com/photo-1627483262769-04d0a1401487?w=400&h=400&fit=crop', stock: 100, unit: 'g', weight: '500g', brand: 'Rajdhani', rating: 4.2, numReviews: 55, tags: ['besan', 'gram flour'] },
  { name: 'Aashirvaad Suji (Semolina)', description: 'Fine quality suji for halwa, upma and idli.', price: 58, mrp: 68, category: 'Atta & Flour', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=400&fit=crop', stock: 90, unit: 'g', weight: '500g', brand: 'Aashirvaad', rating: 4.3, numReviews: 35, tags: ['suji', 'semolina', 'rava'] },
  { name: 'Maida (All Purpose Flour)', description: 'Refined wheat flour for baking, naan and parathas.', price: 42, mrp: 50, category: 'Atta & Flour', image: 'https://images.unsplash.com/photo-1590080876251-139d94cdf92f?w=400&h=400&fit=crop', stock: 110, unit: 'g', weight: '500g', brand: 'Pillsbury', rating: 4.0, numReviews: 25, tags: ['maida', 'refined flour'] },

  // ── Pulses & Dal (8 products) ──
  { name: 'Tata Sampann Toor Dal', description: 'Unpolished toor dal rich in protein. Cooks faster and tastes better.', price: 165, mrp: 189, category: 'Pulses & Dal', image: 'https://images.unsplash.com/photo-1585996746454-1c73e3a7087e?w=400&h=400&fit=crop', stock: 150, unit: 'kg', weight: '1kg', brand: 'Tata Sampann', isFeatured: true, rating: 4.5, numReviews: 110, tags: ['toor dal', 'arhar dal', 'protein'] },
  { name: 'Tata Sampann Moong Dal', description: 'Premium yellow moong dal. Light on stomach and easy to digest.', price: 155, mrp: 175, category: 'Pulses & Dal', image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400&h=400&fit=crop', stock: 120, unit: 'kg', weight: '1kg', brand: 'Tata Sampann', rating: 4.4, numReviews: 75, tags: ['moong dal'] },
  { name: 'Tata Sampann Chana Dal', description: 'High quality chana dal for dal fry and sweets.', price: 115, mrp: 130, category: 'Pulses & Dal', image: 'https://images.unsplash.com/photo-1547058881-aa0edd92aab3?w=400&h=400&fit=crop', stock: 100, unit: 'kg', weight: '1kg', brand: 'Tata Sampann', rating: 4.3, numReviews: 60, tags: ['chana dal'] },
  { name: 'Tata Sampann Masoor Dal', description: 'Red masoor dal. Quick cooking and nutritious.', price: 120, mrp: 140, category: 'Pulses & Dal', image: 'https://images.unsplash.com/photo-1533630988626-c918c2923e16?w=400&h=400&fit=crop', stock: 100, unit: 'kg', weight: '1kg', brand: 'Tata Sampann', rating: 4.2, numReviews: 50, tags: ['masoor dal', 'red lentil'] },
  { name: 'Tata Sampann Urad Dal', description: 'Whole black urad dal for dal makhani and vada.', price: 175, mrp: 199, category: 'Pulses & Dal', image: 'https://images.unsplash.com/photo-1613049117604-5823126ee2c8?w=400&h=400&fit=crop', stock: 80, unit: 'kg', weight: '1kg', brand: 'Tata Sampann', rating: 4.3, numReviews: 45, tags: ['urad dal'] },
  { name: 'Rajma (Red Kidney Beans)', description: 'Premium Jammu rajma. Makes the best rajma chawal.', price: 160, mrp: 185, category: 'Pulses & Dal', image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400&h=400&fit=crop', stock: 90, unit: 'kg', weight: '1kg', brand: 'Rajdhani', rating: 4.4, numReviews: 55, tags: ['rajma', 'kidney beans'] },
  { name: 'Kabuli Chana (Chickpeas)', description: 'Large white kabuli chana for chole and salads.', price: 140, mrp: 160, category: 'Pulses & Dal', image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=400&fit=crop', stock: 110, unit: 'kg', weight: '1kg', brand: 'Rajdhani', rating: 4.2, numReviews: 40, tags: ['chana', 'chickpeas', 'chole'] },
  { name: 'Moong Sabut (Green Gram)', description: 'Whole green moong for sprouting and cooking.', price: 145, mrp: 165, category: 'Pulses & Dal', image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=400&h=400&fit=crop', stock: 70, unit: 'kg', weight: '1kg', brand: 'Tata Sampann', rating: 4.1, numReviews: 30, tags: ['moong', 'green gram'] },

  // ── Cooking Oils (7 products) ──
  { name: 'Fortune Sunlite Sunflower Oil', description: 'Light and healthy refined sunflower oil. Rich in Vitamin E.', price: 180, mrp: 210, category: 'Cooking Oils', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop', stock: 120, unit: 'L', weight: '1L', brand: 'Fortune', isFeatured: true, rating: 4.4, numReviews: 150, tags: ['sunflower oil', 'cooking oil', 'healthy'] },
  { name: 'Fortune Soyabean Oil', description: 'Premium refined soyabean oil for everyday cooking.', price: 155, mrp: 175, category: 'Cooking Oils', image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=400&fit=crop', stock: 100, unit: 'L', weight: '1L', brand: 'Fortune', rating: 4.2, numReviews: 80, tags: ['soyabean oil'] },
  { name: 'Saffola Gold Oil', description: 'Dual seed oil with natural antioxidants. Heart-healthy choice.', price: 210, mrp: 245, category: 'Cooking Oils', image: 'https://images.unsplash.com/photo-1608797178974-15b35a61d121?w=400&h=400&fit=crop', stock: 90, unit: 'L', weight: '1L', brand: 'Saffola', rating: 4.5, numReviews: 95, tags: ['blended oil', 'heart healthy'] },
  { name: 'Nature Fresh Acti Heart Mustard Oil', description: 'Pure kachi ghani mustard oil with rich pungent aroma.', price: 195, mrp: 220, category: 'Cooking Oils', image: 'https://images.unsplash.com/photo-1590548784585-645d2b61afb2?w=400&h=400&fit=crop', stock: 80, unit: 'L', weight: '1L', brand: 'Nature Fresh', rating: 4.3, numReviews: 65, tags: ['mustard oil', 'kachi ghani'] },
  { name: 'Dhara Refined Groundnut Oil', description: 'Premium filtered groundnut oil. Traditional taste.', price: 240, mrp: 270, category: 'Cooking Oils', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop', stock: 60, unit: 'L', weight: '1L', brand: 'Dhara', rating: 4.4, numReviews: 50, tags: ['groundnut oil', 'peanut oil'] },
  { name: 'Figaro Olive Oil', description: 'Imported olive oil for salads and light cooking.', price: 350, mrp: 399, category: 'Cooking Oils', image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=400&h=400&fit=crop', stock: 40, unit: 'ml', weight: '500ml', brand: 'Figaro', rating: 4.3, numReviews: 35, tags: ['olive oil', 'imported'] },
  { name: 'KS Coconut Oil', description: 'Pure cold-pressed coconut oil for cooking and hair care.', price: 190, mrp: 215, category: 'Cooking Oils', image: 'https://images.unsplash.com/photo-1614252368149-14a51e60058b?w=400&h=400&fit=crop', stock: 75, unit: 'L', weight: '1L', brand: 'KS', rating: 4.2, numReviews: 40, tags: ['coconut oil', 'cold pressed'] },

  // ── Spices & Masala (8 products) ──
  { name: 'MDH Deggi Mirch', description: 'Vibrant red chilli powder for rich color and mild heat.', price: 85, mrp: 99, category: 'Spices & Masala', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop', stock: 100, unit: 'g', weight: '100g', brand: 'MDH', rating: 4.5, numReviews: 130, tags: ['chilli powder', 'mirch'] },
  { name: 'MDH Garam Masala', description: 'Aromatic blend of whole spices ground to perfection.', price: 95, mrp: 110, category: 'Spices & Masala', image: 'https://images.unsplash.com/photo-1596040033290-7f284562c1ad?w=400&h=400&fit=crop', stock: 90, unit: 'g', weight: '100g', brand: 'MDH', isFeatured: true, rating: 4.6, numReviews: 155, tags: ['garam masala', 'spice blend'] },
  { name: 'Catch Turmeric Powder', description: 'Pure haldi powder with high curcumin content.', price: 55, mrp: 65, category: 'Spices & Masala', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&h=400&fit=crop', stock: 120, unit: 'g', weight: '200g', brand: 'Catch', rating: 4.3, numReviews: 70, tags: ['turmeric', 'haldi'] },
  { name: 'Catch Coriander Powder', description: 'Freshly ground dhania powder for authentic taste.', price: 50, mrp: 60, category: 'Spices & Masala', image: 'https://images.unsplash.com/photo-1615485500995-463413987bc2?w=400&h=400&fit=crop', stock: 110, unit: 'g', weight: '200g', brand: 'Catch', rating: 4.2, numReviews: 55, tags: ['coriander', 'dhania'] },
  { name: 'Everest Meat Masala', description: 'Special blend for mutton, chicken and meat dishes.', price: 75, mrp: 85, category: 'Spices & Masala', image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=400&h=400&fit=crop', stock: 85, unit: 'g', weight: '100g', brand: 'Everest', rating: 4.4, numReviews: 90, tags: ['meat masala', 'non-veg'] },
  { name: 'MDH Chana Masala', description: 'Perfect spice blend for chole and chana preparations.', price: 65, mrp: 75, category: 'Spices & Masala', image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=400&fit=crop', stock: 95, unit: 'g', weight: '100g', brand: 'MDH', rating: 4.3, numReviews: 60, tags: ['chana masala', 'chole'] },
  { name: 'Catch Cumin Powder (Jeera)', description: 'Fine quality ground jeera for tempering and seasoning.', price: 80, mrp: 95, category: 'Spices & Masala', image: 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=400&h=400&fit=crop', stock: 100, unit: 'g', weight: '200g', brand: 'Catch', rating: 4.4, numReviews: 48, tags: ['cumin', 'jeera'] },
  { name: 'Everest Kitchen King Masala', description: 'All-purpose masala for vegetables and gravies.', price: 70, mrp: 80, category: 'Spices & Masala', image: 'https://images.unsplash.com/photo-1615485291244-a82f3ef80e8e?w=400&h=400&fit=crop', stock: 105, unit: 'g', weight: '100g', brand: 'Everest', rating: 4.5, numReviews: 85, tags: ['kitchen king', 'all purpose'] },

  // ── Salt & Sugar (6 products) ──
  { name: 'Tata Salt', description: 'Iodized vacuum evaporated salt. Desh ka namak.', price: 28, mrp: 32, category: 'Salt & Sugar', image: 'https://images.unsplash.com/photo-1618083707368-b3823daa2726?w=400&h=400&fit=crop', stock: 200, unit: 'kg', weight: '1kg', brand: 'Tata', isFeatured: true, rating: 4.7, numReviews: 250, tags: ['salt', 'iodized'] },
  { name: 'Tata Rock Salt (Sendha Namak)', description: 'Pure rock salt for fasting and everyday use.', price: 45, mrp: 55, category: 'Salt & Sugar', image: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400&h=400&fit=crop', stock: 80, unit: 'g', weight: '500g', brand: 'Tata', rating: 4.3, numReviews: 40, tags: ['rock salt', 'sendha namak', 'fasting'] },
  { name: 'Tata Salt Lite', description: 'Low sodium salt with 15% less sodium. Heart-healthy.', price: 38, mrp: 45, category: 'Salt & Sugar', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop', stock: 60, unit: 'kg', weight: '1kg', brand: 'Tata', rating: 4.2, numReviews: 30, tags: ['low sodium', 'healthy salt'] },
  { name: 'Uttam Sugar', description: 'Refined white sugar for tea, coffee and cooking.', price: 48, mrp: 55, category: 'Salt & Sugar', image: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=400&h=400&fit=crop', stock: 180, unit: 'kg', weight: '1kg', brand: 'Uttam', rating: 4.0, numReviews: 35, tags: ['sugar', 'white sugar'] },
  { name: 'Dhampure Speciality Brown Sugar', description: 'Unrefined brown sugar for healthy sweetening.', price: 75, mrp: 89, category: 'Salt & Sugar', image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=400&h=400&fit=crop', stock: 50, unit: 'g', weight: '500g', brand: 'Dhampure', rating: 4.1, numReviews: 20, tags: ['brown sugar', 'healthy'] },
  { name: 'Trust Classic Mishri (Rock Sugar)', description: 'Crystal rock sugar for religious offerings and sweet preparations.', price: 65, mrp: 75, category: 'Salt & Sugar', image: 'https://images.unsplash.com/photo-1592151072895-3571d871d33c?w=400&h=400&fit=crop', stock: 55, unit: 'g', weight: '500g', brand: 'Trust', rating: 4.2, numReviews: 18, tags: ['mishri', 'rock sugar'] },

  // ── Tea & Coffee (7 products) ──
  { name: 'Tata Tea Gold', description: '15% long leaves for a rich, aromatic cup of tea.', price: 255, mrp: 290, category: 'Tea & Coffee', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&h=400&fit=crop', stock: 130, unit: 'g', weight: '500g', brand: 'Tata Tea', isFeatured: true, rating: 4.5, numReviews: 180, tags: ['tea', 'gold', 'premium'] },
  { name: 'Taj Mahal Tea', description: 'Premium Brooke Bond tea with handpicked leaves.', price: 310, mrp: 350, category: 'Tea & Coffee', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop', stock: 100, unit: 'g', weight: '500g', brand: 'Brooke Bond', rating: 4.6, numReviews: 120, tags: ['tea', 'premium'] },
  { name: 'Red Label Tea', description: 'India\'s favorite chai for everyday brewing.', price: 195, mrp: 220, category: 'Tea & Coffee', image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cfa9?w=400&h=400&fit=crop', stock: 160, unit: 'g', weight: '500g', brand: 'Brooke Bond', rating: 4.3, numReviews: 100, tags: ['tea', 'everyday'] },
  { name: 'Wagh Bakri Premium Tea', description: 'Gujarat\'s finest tea brand with rich taste.', price: 240, mrp: 270, category: 'Tea & Coffee', image: 'https://images.unsplash.com/photo-1563887530-623ae9f1c86e?w=400&h=400&fit=crop', stock: 80, unit: 'g', weight: '500g', brand: 'Wagh Bakri', rating: 4.4, numReviews: 65, tags: ['tea', 'gujarati'] },
  { name: 'Nescafe Classic Coffee', description: 'Instant coffee for a quick and energizing brew.', price: 275, mrp: 310, category: 'Tea & Coffee', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop', stock: 90, unit: 'g', weight: '200g', brand: 'Nescafe', rating: 4.4, numReviews: 140, tags: ['coffee', 'instant'] },
  { name: 'Bru Instant Coffee', description: 'Smooth instant coffee with rich taste and aroma.', price: 240, mrp: 270, category: 'Tea & Coffee', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop', stock: 85, unit: 'g', weight: '200g', brand: 'Bru', rating: 4.3, numReviews: 95, tags: ['coffee', 'instant'] },
  { name: 'Tata Coffee Grand', description: 'Granulated instant coffee with smooth flavour profile.', price: 195, mrp: 225, category: 'Tea & Coffee', image: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=400&h=400&fit=crop', stock: 70, unit: 'g', weight: '100g', brand: 'Tata Coffee', rating: 4.2, numReviews: 55, tags: ['coffee', 'granulated'] },

  // ── Biscuits & Cookies (7 products) ──
  { name: 'Parle-G Gold Biscuits', description: 'India\'s most loved glucose biscuit. Premium gold variant.', price: 40, mrp: 45, category: 'Biscuits & Cookies', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop', stock: 200, unit: 'pack', weight: '1kg', brand: 'Parle', rating: 4.5, numReviews: 300, tags: ['glucose', 'biscuit', 'classic'] },
  { name: 'Britannia Good Day Butter Cookies', description: 'Crunchy butter cookies with rich buttery taste.', price: 35, mrp: 40, category: 'Biscuits & Cookies', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop', stock: 180, unit: 'pack', weight: '250g', brand: 'Britannia', rating: 4.3, numReviews: 110, tags: ['butter', 'cookies'] },
  { name: 'Britannia Marie Gold', description: 'Light and crispy Marie biscuit. Perfect with tea.', price: 32, mrp: 38, category: 'Biscuits & Cookies', image: 'https://images.unsplash.com/photo-1590080875151-5120302b1b36?w=400&h=400&fit=crop', stock: 150, unit: 'pack', weight: '250g', brand: 'Britannia', rating: 4.2, numReviews: 90, tags: ['marie', 'light'] },
  { name: 'Sunfeast Dark Fantasy', description: 'Premium chocolate-filled cookies for a luxurious treat.', price: 45, mrp: 50, category: 'Biscuits & Cookies', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop', stock: 120, unit: 'pack', weight: '200g', brand: 'Sunfeast', isFeatured: true, rating: 4.6, numReviews: 130, tags: ['chocolate', 'premium', 'dark fantasy'] },
  { name: 'Oreo Original Cookies', description: 'Iconic chocolate sandwich cookies with vanilla cream.', price: 30, mrp: 35, category: 'Biscuits & Cookies', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop', stock: 160, unit: 'pack', weight: '150g', brand: 'Cadbury', rating: 4.5, numReviews: 140, tags: ['oreo', 'chocolate', 'cream'] },
  { name: 'Parle Monaco Salted Biscuit', description: 'Light and crispy salted biscuits. Great for snacking.', price: 25, mrp: 30, category: 'Biscuits & Cookies', image: 'https://images.unsplash.com/photo-1589613780020-f8fdf82db35?w=400&h=400&fit=crop', stock: 140, unit: 'pack', weight: '200g', brand: 'Parle', rating: 4.1, numReviews: 60, tags: ['salted', 'snack'] },
  { name: 'McVities Digestive Biscuits', description: 'High-fibre whole wheat biscuits for health-conscious snacking.', price: 55, mrp: 65, category: 'Biscuits & Cookies', image: 'https://images.unsplash.com/photo-1590080873972-e0ac8f4ee92d?w=400&h=400&fit=crop', stock: 70, unit: 'pack', weight: '250g', brand: 'McVities', rating: 4.3, numReviews: 45, tags: ['digestive', 'fibre', 'healthy'] },

  // ── Snacks & Namkeen (7 products) ──
  { name: 'Haldiram Aloo Bhujia', description: 'Classic crispy potato-based namkeen. Everyone\'s favorite.', price: 75, mrp: 85, category: 'Snacks & Namkeen', image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=400&fit=crop', stock: 110, unit: 'g', weight: '400g', brand: 'Haldirams', rating: 4.4, numReviews: 120, tags: ['bhujia', 'namkeen', 'aloo'] },
  { name: 'Haldiram Moong Dal Namkeen', description: 'Crunchy fried moong dal. A timeless Indian snack.', price: 60, mrp: 70, category: 'Snacks & Namkeen', image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=400&h=400&fit=crop', stock: 100, unit: 'g', weight: '400g', brand: 'Haldirams', rating: 4.3, numReviews: 85, tags: ['moong dal', 'namkeen'] },
  { name: 'Lay\'s Classic Salted Chips', description: 'Thin and crispy potato chips with classic salt flavour.', price: 20, mrp: 20, category: 'Snacks & Namkeen', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop', stock: 200, unit: 'g', weight: '52g', brand: 'Lay\'s', rating: 4.2, numReviews: 200, tags: ['chips', 'potato', 'salted'] },
  { name: 'Kurkure Masala Munch', description: 'Tangy orange corn twists/snack. Tangy masala taste.', price: 20, mrp: 20, category: 'Snacks & Namkeen', image: 'https://images.unsplash.com/photo-1613919189030-d34ef52176b6?w=400&h=400&fit=crop', stock: 180, unit: 'g', weight: '90g', brand: 'Kurkure', rating: 4.3, numReviews: 170, tags: ['kurkure', 'masala', 'crunchy'] },
  { name: 'Bikaji Bikaneri Bhujia', description: 'Authentic Bikaneri bhujia from the house of Bikaji.', price: 85, mrp: 95, category: 'Snacks & Namkeen', image: 'https://images.unsplash.com/photo-1605666807844-78fb683f4bd3?w=400&h=400&fit=crop', stock: 80, unit: 'g', weight: '400g', brand: 'Bikaji', rating: 4.5, numReviews: 75, tags: ['bhujia', 'bikaneri'] },
  { name: 'Haldiram Mixture', description: 'Mixed namkeen with sev, peanuts and fried dal.', price: 65, mrp: 75, category: 'Snacks & Namkeen', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=400&fit=crop', stock: 95, unit: 'g', weight: '400g', brand: 'Haldirams', rating: 4.2, numReviews: 65, tags: ['mixture', 'namkeen'] },
  { name: 'Act II Classic Salted Popcorn', description: 'Ready-to-microwave popcorn with classic salted flavour.', price: 40, mrp: 45, category: 'Snacks & Namkeen', image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400&h=400&fit=crop', stock: 60, unit: 'g', weight: '99g', brand: 'Act II', rating: 4.0, numReviews: 50, tags: ['popcorn', 'microwave'] },

  // ── Beverages (7 products) ──
  { name: 'Coca-Cola Classic', description: 'Iconic cola-flavoured carbonated drink.', price: 40, mrp: 40, category: 'Beverages', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop', stock: 200, unit: 'ml', weight: '750ml', brand: 'Coca-Cola', rating: 4.3, numReviews: 200, tags: ['cola', 'cold drink', 'carbonated'] },
  { name: 'Thums Up', description: 'Bold and strong cola taste. India\'s thunder.', price: 40, mrp: 40, category: 'Beverages', image: 'https://images.unsplash.com/photo-1624552184280-9e9631bbeee9?w=400&h=400&fit=crop', stock: 180, unit: 'ml', weight: '750ml', brand: 'Thums Up', rating: 4.4, numReviews: 170, tags: ['cola', 'strong'] },
  { name: 'Frooti Mango Drink', description: 'Refreshing mango drink made with real Alphonso mango pulp.', price: 10, mrp: 10, category: 'Beverages', image: 'https://images.unsplash.com/photo-1534080391025-a87b8f112255?w=400&h=400&fit=crop', stock: 300, unit: 'ml', weight: '200ml', brand: 'Frooti', rating: 4.2, numReviews: 160, tags: ['mango', 'juice'] },
  { name: 'Real Fruit Power Mixed Fruit', description: 'Mixed fruit juice with no added preservatives.', price: 99, mrp: 110, category: 'Beverages', image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400&h=400&fit=crop', stock: 80, unit: 'L', weight: '1L', brand: 'Real', rating: 4.3, numReviews: 70, tags: ['juice', 'mixed fruit'] },
  { name: 'Paper Boat Aam Panna', description: 'Refreshing raw mango drink. Traditional Indian summer cooler.', price: 30, mrp: 30, category: 'Beverages', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=400&fit=crop', stock: 90, unit: 'ml', weight: '250ml', brand: 'Paper Boat', rating: 4.4, numReviews: 55, tags: ['aam panna', 'summer', 'mango'] },
  { name: 'Bisleri Mineral Water', description: 'Pure and safe packaged drinking water.', price: 20, mrp: 20, category: 'Beverages', image: 'https://images.unsplash.com/photo-1608889174633-41a7c2fe1f18?w=400&h=400&fit=crop', stock: 500, unit: 'L', weight: '1L', brand: 'Bisleri', rating: 4.0, numReviews: 40, tags: ['water', 'mineral water'] },
  { name: 'Tang Orange Instant Drink Mix', description: 'Instant orange flavour drink powder. Just add water.', price: 110, mrp: 130, category: 'Beverages', image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=400&fit=crop', stock: 70, unit: 'g', weight: '500g', brand: 'Tang', rating: 4.1, numReviews: 45, tags: ['orange', 'drink mix', 'tang'] },

  // ── Dairy Products (7 products) ──
  { name: 'Amul Taaza Toned Milk', description: 'Toned milk with standardized fat content. Fresh and hygienic.', price: 27, mrp: 27, category: 'Dairy Products', image: 'https://images.unsplash.com/photo-1628160073992-0b26db40a200?w=400&h=400&fit=crop', stock: 100, unit: 'ml', weight: '500ml', brand: 'Amul', rating: 4.3, numReviews: 90, tags: ['milk', 'toned', 'fresh'] },
  { name: 'Amul Gold Full Cream Milk', description: 'Rich and creamy full cream milk. Perfect for chai and sweets.', price: 34, mrp: 34, category: 'Dairy Products', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop', stock: 100, unit: 'ml', weight: '500ml', brand: 'Amul', rating: 4.5, numReviews: 110, tags: ['milk', 'full cream'] },
  { name: 'Amul Butter', description: 'Utterly butterly delicious. India\'s favorite butter.', price: 56, mrp: 60, category: 'Dairy Products', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc0d?w=400&h=400&fit=crop', stock: 80, unit: 'g', weight: '100g', brand: 'Amul', isFeatured: true, rating: 4.7, numReviews: 220, tags: ['butter', 'dairy'] },
  { name: 'Amul Cheese Slices', description: 'Processed cheese slices perfect for sandwiches and burgers.', price: 110, mrp: 125, category: 'Dairy Products', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop', stock: 60, unit: 'g', weight: '200g', brand: 'Amul', rating: 4.4, numReviews: 80, tags: ['cheese', 'sliced'] },
  { name: 'Mother Dairy Dahi (Curd)', description: 'Fresh and creamy set curd. Rich in probiotics.', price: 35, mrp: 35, category: 'Dairy Products', image: 'https://images.unsplash.com/photo-1571244856353-fb0e521e784a?w=400&h=400&fit=crop', stock: 70, unit: 'g', weight: '400g', brand: 'Mother Dairy', rating: 4.3, numReviews: 65, tags: ['curd', 'dahi', 'probiotic'] },
  { name: 'Amul Fresh Paneer', description: 'Soft and fresh paneer made from pure milk.', price: 90, mrp: 100, category: 'Dairy Products', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=400&fit=crop', stock: 50, unit: 'g', weight: '200g', brand: 'Amul', rating: 4.5, numReviews: 95, tags: ['paneer', 'cottage cheese'] },
  { name: 'Amul Ghee', description: 'Pure cow ghee with rich aroma and traditional taste.', price: 560, mrp: 610, category: 'Dairy Products', image: 'https://images.unsplash.com/photo-1617470703128-26a0fc9af10f?w=400&h=400&fit=crop', stock: 45, unit: 'L', weight: '1L', brand: 'Amul', rating: 4.6, numReviews: 130, tags: ['ghee', 'cow ghee', 'pure'] },

  // ── Bread & Bakery (6 products) ──
  { name: 'Britannia Bread White', description: 'Soft and fresh white bread for sandwiches and toast.', price: 40, mrp: 42, category: 'Bread & Bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop', stock: 80, unit: 'pack', weight: '400g', brand: 'Britannia', rating: 4.1, numReviews: 70, tags: ['bread', 'white bread'] },
  { name: 'Britannia Brown Bread', description: 'Whole wheat brown bread. Healthier choice for daily use.', price: 45, mrp: 48, category: 'Bread & Bakery', image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&h=400&fit=crop', stock: 70, unit: 'pack', weight: '400g', brand: 'Britannia', rating: 4.2, numReviews: 55, tags: ['bread', 'brown bread', 'whole wheat'] },
  { name: 'Harvest Gold Multigrain Bread', description: 'Multigrain bread with seeds for nutritious breakfast.', price: 55, mrp: 60, category: 'Bread & Bakery', image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=400&h=400&fit=crop', stock: 50, unit: 'pack', weight: '450g', brand: 'Harvest Gold', rating: 4.3, numReviews: 35, tags: ['multigrain', 'healthy bread'] },
  { name: 'Britannia Milk Bread', description: 'Soft milk-enriched bread for a delightful taste.', price: 50, mrp: 55, category: 'Bread & Bakery', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop', stock: 60, unit: 'pack', weight: '400g', brand: 'Britannia', rating: 4.0, numReviews: 30, tags: ['milk bread', 'soft'] },
  { name: 'English Oven Burger Buns', description: 'Soft sesame-topped burger buns. Pack of 4.', price: 60, mrp: 70, category: 'Bread & Bakery', image: 'https://images.unsplash.com/photo-1585245380649-7f618274130d?w=400&h=400&fit=crop', stock: 40, unit: 'pack', weight: '4pcs', brand: 'English Oven', rating: 4.1, numReviews: 25, tags: ['burger buns', 'buns'] },
  { name: 'Britannia Pav', description: 'Soft ladi pav for pav bhaji and vada pav.', price: 35, mrp: 38, category: 'Bread & Bakery', image: 'https://images.unsplash.com/photo-1598143158390-5028fe2b20f4?w=400&h=400&fit=crop', stock: 90, unit: 'pack', weight: '6pcs', brand: 'Britannia', rating: 4.3, numReviews: 80, tags: ['pav', 'pav bhaji'] },

  // ── Fruits & Vegetables (7 products) ──
  { name: 'Fresh Onion', description: 'Fresh red onions from Maharashtra farms. Essential for every kitchen.', price: 35, mrp: 40, category: 'Fruits & Vegetables', image: 'https://images.unsplash.com/photo-1618512496248-a07fe8376ee2?w=400&h=400&fit=crop', stock: 200, unit: 'kg', weight: '1kg', brand: 'Farm Fresh', rating: 4.1, numReviews: 50, tags: ['onion', 'vegetable', 'fresh'] },
  { name: 'Fresh Tomato', description: 'Ripe and juicy tomatoes for curries and salads.', price: 30, mrp: 35, category: 'Fruits & Vegetables', image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=400&h=400&fit=crop', stock: 150, unit: 'kg', weight: '1kg', brand: 'Farm Fresh', rating: 4.0, numReviews: 45, tags: ['tomato', 'vegetable'] },
  { name: 'Fresh Potato', description: 'Clean and fresh potatoes. Staple Indian vegetable.', price: 25, mrp: 30, category: 'Fruits & Vegetables', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=400&fit=crop', stock: 250, unit: 'kg', weight: '1kg', brand: 'Farm Fresh', rating: 4.0, numReviews: 55, tags: ['potato', 'aloo'] },
  { name: 'Fresh Green Chilli', description: 'Spicy green chillies for tempering and garnishing.', price: 10, mrp: 15, category: 'Fruits & Vegetables', image: 'https://images.unsplash.com/photo-1588252399624-9b168670df5f?w=400&h=400&fit=crop', stock: 100, unit: 'g', weight: '100g', brand: 'Farm Fresh', rating: 4.0, numReviews: 30, tags: ['green chilli', 'mirch'] },
  { name: 'Fresh Banana (Dozen)', description: 'Ripe yellow bananas. Nutritious and delicious fruit.', price: 50, mrp: 55, category: 'Fruits & Vegetables', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop', stock: 120, unit: 'pcs', weight: '12pcs', brand: 'Farm Fresh', rating: 4.2, numReviews: 60, tags: ['banana', 'fruit'] },
  { name: 'Fresh Apple (Shimla)', description: 'Sweet and crunchy Shimla apples. Rich in nutrients.', price: 180, mrp: 200, category: 'Fruits & Vegetables', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop', stock: 8, unit: 'kg', weight: '1kg', brand: 'Farm Fresh', rating: 4.4, numReviews: 40, tags: ['apple', 'fruit', 'shimla'] },
  { name: 'Fresh Ginger', description: 'Aromatic fresh ginger root for tea and cooking.', price: 20, mrp: 25, category: 'Fruits & Vegetables', image: 'https://images.unsplash.com/photo-1599242429907-de8159670f5f?w=400&h=400&fit=crop', stock: 80, unit: 'g', weight: '100g', brand: 'Farm Fresh', rating: 4.1, numReviews: 25, tags: ['ginger', 'adrak'] },

  // ── Cleaning & Household (8 products) ──
  { name: 'Vim Dishwash Liquid Gel', description: 'Powerful dishwash gel that cuts through grease easily.', price: 99, mrp: 115, category: 'Cleaning & Household', image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=400&h=400&fit=crop', stock: 100, unit: 'ml', weight: '500ml', brand: 'Vim', rating: 4.3, numReviews: 90, tags: ['dishwash', 'cleaning'] },
  { name: 'Surf Excel Easy Wash', description: 'Detergent powder for hand wash and machine wash.', price: 135, mrp: 155, category: 'Cleaning & Household', image: 'https://images.unsplash.com/photo-1584813539806-2538b8d918c6?w=400&h=400&fit=crop', stock: 120, unit: 'kg', weight: '1kg', brand: 'Surf Excel', rating: 4.4, numReviews: 110, tags: ['detergent', 'laundry'] },
  { name: 'Harpic Toilet Cleaner', description: '10x better cleaning with thick liquid formula.', price: 79, mrp: 90, category: 'Cleaning & Household', image: 'https://images.unsplash.com/photo-152874056446f-c1f6de722f5c?w=400&h=400&fit=crop', stock: 90, unit: 'ml', weight: '500ml', brand: 'Harpic', rating: 4.2, numReviews: 75, tags: ['toilet cleaner'] },
  { name: 'Lizol Floor Cleaner Citrus', description: 'Disinfectant surface cleaner with citrus fragrance.', price: 115, mrp: 132, category: 'Cleaning & Household', image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=400&fit=crop', stock: 80, unit: 'ml', weight: '500ml', brand: 'Lizol', rating: 4.3, numReviews: 60, tags: ['floor cleaner', 'disinfectant'] },
  { name: 'Colin Glass Cleaner', description: 'Streak-free glass and surface cleaner spray.', price: 82, mrp: 95, category: 'Cleaning & Household', image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&h=400&fit=crop', stock: 70, unit: 'ml', weight: '500ml', brand: 'Colin', rating: 4.1, numReviews: 40, tags: ['glass cleaner'] },
  { name: 'Scotch-Brite Scrub Pad (3 pcs)', description: 'Heavy duty scrub pads for tough stains on utensils.', price: 50, mrp: 55, category: 'Cleaning & Household', image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&h=400&fit=crop', stock: 130, unit: 'pack', weight: '3pcs', brand: 'Scotch-Brite', rating: 4.4, numReviews: 85, tags: ['scrub', 'utensil cleaner'] },
  { name: 'Comfort Fabric Conditioner', description: 'After wash fabric conditioner for soft and fragrant clothes.', price: 89, mrp: 99, category: 'Cleaning & Household', image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=400&fit=crop', stock: 60, unit: 'ml', weight: '220ml', brand: 'Comfort', rating: 4.2, numReviews: 50, tags: ['fabric conditioner'] },
  { name: 'Odonil Room Freshener Block', description: 'Continuous room freshener with long-lasting fragrance.', price: 55, mrp: 65, category: 'Cleaning & Household', image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=400&h=400&fit=crop', stock: 0, unit: 'pcs', weight: '1pc', brand: 'Odonil', rating: 4.0, numReviews: 30, tags: ['room freshener'] },

  // ── Personal Care (8 products) ──
  { name: 'Colgate Strong Teeth Toothpaste', description: 'Cavity protection toothpaste with calcium boost formula.', price: 95, mrp: 110, category: 'Personal Care', image: 'https://images.unsplash.com/photo-1559599101-f09722fb4925?w=400&h=400&fit=crop', stock: 120, unit: 'g', weight: '200g', brand: 'Colgate', rating: 4.4, numReviews: 150, tags: ['toothpaste', 'dental'] },
  { name: 'Dettol Liquid Handwash', description: 'Antibacterial handwash that kills 99.9% germs.', price: 99, mrp: 115, category: 'Personal Care', image: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=400&h=400&fit=crop', stock: 100, unit: 'ml', weight: '250ml', brand: 'Dettol', rating: 4.5, numReviews: 130, tags: ['handwash', 'antibacterial'] },
  { name: 'Dove Cream Beauty Bar', description: 'Moisturizing beauty bar with 1/4 moisturizing cream.', price: 52, mrp: 60, category: 'Personal Care', image: 'https://images.unsplash.com/photo-1607006342411-9a910c74bba2?w=400&h=400&fit=crop', stock: 90, unit: 'g', weight: '100g', brand: 'Dove', rating: 4.5, numReviews: 120, tags: ['soap', 'beauty bar', 'moisturizing'] },
  { name: 'Head & Shoulders Anti-Dandruff Shampoo', description: 'Anti-dandruff shampoo for clean and flake-free hair.', price: 190, mrp: 220, category: 'Personal Care', image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&h=400&fit=crop', stock: 75, unit: 'ml', weight: '340ml', brand: 'Head & Shoulders', rating: 4.3, numReviews: 90, tags: ['shampoo', 'anti-dandruff'] },
  { name: 'Nivea Body Lotion', description: 'Deep moisture body lotion for smooth and supple skin.', price: 230, mrp: 265, category: 'Personal Care', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop', stock: 55, unit: 'ml', weight: '400ml', brand: 'Nivea', rating: 4.4, numReviews: 75, tags: ['body lotion', 'moisturizer'] },
  { name: 'Gillette Guard Razor', description: 'Comfortable close shave with safety guard and lubristrip.', price: 65, mrp: 75, category: 'Personal Care', image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=400&fit=crop', stock: 100, unit: 'pcs', weight: '1pc', brand: 'Gillette', rating: 4.2, numReviews: 60, tags: ['razor', 'shaving'] },
  { name: 'Lux Soft Touch Soap', description: 'French rose and almond oil body soap for silky skin.', price: 38, mrp: 45, category: 'Personal Care', image: 'https://images.unsplash.com/photo-1605264964528-06403738d6dc?w=400&h=400&fit=crop', stock: 0, unit: 'g', weight: '150g', brand: 'Lux', rating: 4.1, numReviews: 55, tags: ['soap', 'body soap'] },
  { name: 'Whisper Ultra Clean Sanitary Pads', description: 'Ultra-thin sanitary pads with dry top sheet for comfort.', price: 85, mrp: 99, category: 'Personal Care', image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&h=400&fit=crop', stock: 5, unit: 'pack', weight: '7pcs', brand: 'Whisper', rating: 4.5, numReviews: 100, tags: ['sanitary pads', 'hygiene'] },
];

const productsData = rawProductsData.map((prod, idx) => ({
  _id: `prod${idx + 1}`,
  isAvailable: prod.stock > 0,
  isFeatured: prod.isFeatured || false,
  rating: prod.rating || 4.2,
  numReviews: prod.numReviews || 10,
  ...prod
}));


const couponsData = [
  { _id: 'c1', code: 'WELCOME10', discountType: 'percentage', discountValue: 10, minOrderAmount: 0, maxDiscount: 100, isActive: true, usageLimit: 1000, expiresAt: new Date('2027-12-31') },
  { _id: 'c2', code: 'FRESH50', discountType: 'flat', discountValue: 50, minOrderAmount: 500, maxDiscount: null, isActive: true, usageLimit: 500, expiresAt: new Date('2027-12-31') }
];

let db = {
  users: [],
  products: productsData,
  categories: categoriesData,
  coupons: couponsData,
  carts: [],
  orders: [],
  wishlists: []
};

function loadDb() {
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf8');
      db = JSON.parse(data);
      console.log('📂 Local mock database loaded successfully from:', dbPath);
    } else {
      const dir = path.dirname(dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
      console.log('🆕 Created and initialized new local mock database at:', dbPath);
    }

    // Dynamically compute and update product counts for each category
    if (Array.isArray(db.categories) && Array.isArray(db.products)) {
      db.categories.forEach(cat => {
        cat.productCount = db.products.filter(p => p.category === cat.name).length;
      });
      // Save it back to persist the counts
      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
    }
  } catch (err) {
    console.error('❌ Failed to load local mock database:', err);
  }
}

function saveDb() {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error('❌ Failed to save local mock database:', err);
  }
}

loadDb();

class QueryChain {
  constructor(promise) {
    this.promise = promise;
    this.populates = [];
  }
  sort() { return this; }
  skip() { return this; }
  limit() { return this; }
  populate(path, select) {
    this.populates.push({ path, select });
    return this;
  }
  select() { return this; }
  exec() {
    return this.promise.then(async (result) => {
      if (!result) return result;
      
      const applyPopulate = (doc) => {
        if (!doc) return;
        for (const pop of this.populates) {
          const path = pop.path;
          
          // 1. items.product (Cart or Order items)
          if (path === 'items.product') {
            if (Array.isArray(doc.items)) {
              doc.items.forEach(item => {
                if (item.product) {
                  const prodId = typeof item.product === 'object' ? item.product._id : item.product;
                  const foundProd = db.products.find(p => String(p._id) === String(prodId));
                  if (foundProd) {
                    item.product = { ...foundProd };
                  }
                }
              });
            }
          }
          
          // 2. products (Wishlist products array)
          else if (path === 'products') {
            if (Array.isArray(doc.products)) {
              doc.products = doc.products.map(prodId => {
                const pId = typeof prodId === 'object' ? prodId._id : prodId;
                const foundProd = db.products.find(p => String(p._id) === String(pId));
                return foundProd ? { ...foundProd } : prodId;
              });
            }
          }
          
          // 3. user (Order or admin queries)
          else if (path === 'user') {
            if (doc.user) {
              const uId = typeof doc.user === 'object' ? doc.user._id : doc.user;
              const foundUser = db.users.find(u => String(u._id) === String(uId));
              if (foundUser) {
                const selectFields = pop.select ? pop.select.split(' ') : [];
                if (selectFields.length > 0) {
                  const filteredUser = { _id: foundUser._id };
                  selectFields.forEach(f => {
                    if (f in foundUser) filteredUser[f] = foundUser[f];
                  });
                  doc.user = filteredUser;
                } else {
                  const { password, ...safeUser } = foundUser;
                  doc.user = safeUser;
                }
              }
            }
          }
        }
      };

      if (Array.isArray(result)) {
        result.forEach(applyPopulate);
      } else {
        applyPopulate(result);
      }
      
      return result;
    });
  }
  then(onFulfilled, onRejected) {
    return this.exec().then(onFulfilled, onRejected);
  }
}

function makeMockModel(modelName) {
  const collectionName = modelName === 'Category' ? 'categories' : modelName.toLowerCase() + 's';
  
  const getCollection = () => {
    if (!db[collectionName]) {
      db[collectionName] = [];
    }
    return db[collectionName];
  };

  const wrapRecord = (record) => {
    if (!record) return null;
    const instance = { ...record };
    
    instance.save = async function() {
      const col = getCollection();
      const idx = col.findIndex(item => String(item._id) === String(this._id));
      
      // Hash password if modified and is User model and not already hashed
      const isAlreadyHashed = typeof this.password === 'string' && /^\$2[ayb]\$/.test(this.password);
      if (modelName === 'User' && this.password && !isAlreadyHashed) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
      }

      if (idx !== -1) {
        col[idx] = { ...this };
      } else {
        col.push({ ...this });
      }
      saveDb();
      return wrapRecord(this);
    };

    if (modelName === 'User') {
      instance.matchPassword = async function(enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
      };
      if (!instance.addresses) instance.addresses = [];
      instance.addresses.id = function(id) {
        const addr = this.find(a => String(a._id) === String(id));
        return addr ? wrapRecord(addr) : null;
      };
    }
    return instance;
  };

  const filterItems = (col, query) => {
    if (!query || Object.keys(query).length === 0) return col;
    
    const matchCondition = (item, condition) => {
      if (!condition) return true;
      
      // Handle root-level $or
      if (condition.$or && Array.isArray(condition.$or)) {
        return condition.$or.some(subCond => matchCondition(item, subCond));
      }
      
      for (const key in condition) {
        if (key === '$or') continue;
        
        const val = condition[key];
        const itemVal = item[key];
        
        if (val && typeof val === 'object' && !Array.isArray(val) && !(val instanceof RegExp)) {
          // Object containing operators like $in, $regex, $gt, $lte, $ne, $gte
          for (const op in val) {
            const opVal = val[op];
            if (op === '$regex') {
              const options = val.$options || '';
              const regex = new RegExp(opVal, options);
              if (!regex.test(String(itemVal || ''))) return false;
            } else if (op === '$options') {
              continue;
            } else if (op === '$in') {
              if (!Array.isArray(opVal)) return false;
              const matched = opVal.some(v => String(v).toLowerCase() === String(itemVal || '').toLowerCase());
              if (!matched) return false;
            } else if (op === '$nin') {
              if (!Array.isArray(opVal)) return false;
              const matched = opVal.some(v => String(v).toLowerCase() === String(itemVal || '').toLowerCase());
              if (matched) return false;
            } else if (op === '$ne') {
              if (String(itemVal || '').toLowerCase() === String(opVal || '').toLowerCase()) return false;
            } else if (op === '$eq') {
              if (String(itemVal || '').toLowerCase() !== String(opVal || '').toLowerCase()) return false;
            } else if (op === '$gt') {
              if (!(Number(itemVal) > Number(opVal))) return false;
            } else if (op === '$gte') {
              if (!(Number(itemVal) >= Number(opVal))) return false;
            } else if (op === '$lt') {
              if (!(Number(itemVal) < Number(opVal))) return false;
            } else if (op === '$lte') {
              if (!(Number(itemVal) <= Number(opVal))) return false;
            }
          }
        } else {
          // Simple exact/regex/null comparison
          if (val instanceof RegExp) {
            if (!val.test(String(itemVal || ''))) return false;
          } else if (val === null || val === undefined) {
            if (itemVal !== null && itemVal !== undefined) return false;
          } else {
            if (String(itemVal || '').toLowerCase() !== String(val || '').toLowerCase()) return false;
          }
        }
      }
      return true;
    };

    return col.filter(item => matchCondition(item, query));
  };

  return {
    find: (query) => {
      const col = getCollection();
      const results = filterItems(col, query).map(wrapRecord);
      return new QueryChain(Promise.resolve(results));
    },
    findOne: (query) => {
      const col = getCollection();
      const result = filterItems(col, query)[0] || null;
      return new QueryChain(Promise.resolve(wrapRecord(result)));
    },
    findById: (id) => {
      const col = getCollection();
      const result = col.find(item => String(item._id) === String(id)) || null;
      return new QueryChain(Promise.resolve(wrapRecord(result)));
    },
    countDocuments: (query) => {
      const col = getCollection();
      const results = filterItems(col, query);
      return Promise.resolve(results.length);
    },
    create: async (data) => {
      const col = getCollection();
      
      const createSingle = async (itemData) => {
        const newItem = {
          _id: '_' + Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
          ...itemData
        };
        
        const isAlreadyHashed = typeof newItem.password === 'string' && /^\$2[ayb]\$/.test(newItem.password);
        if (modelName === 'User' && newItem.password && !isAlreadyHashed) {
          const salt = await bcrypt.genSalt(10);
          newItem.password = await bcrypt.hash(newItem.password, salt);
        }
        
        col.push(newItem);
        saveDb();
        return wrapRecord(newItem);
      };

      if (Array.isArray(data)) {
        const results = [];
        for (const item of data) {
          results.push(await createSingle(item));
        }
        return results;
      } else {
        return await createSingle(data);
      }
    },
    findByIdAndUpdate: async (id, update, options) => {
      const col = getCollection();
      const idx = col.findIndex(item => String(item._id) === String(id));
      if (idx === -1) return null;
      
      let updatedFields = update.$set || update;
      col[idx] = { ...col[idx], ...updatedFields };
      saveDb();
      return wrapRecord(col[idx]);
    },
    findOneAndUpdate: async (query, update, options) => {
      const col = getCollection();
      const filtered = filterItems(col, query);
      if (filtered.length === 0) {
        if (options && options.upsert) {
          const newDoc = await mockDb.create(modelName, { ...query, ...update });
          return newDoc;
        }
        return null;
      }
      const idx = col.findIndex(item => String(item._id) === String(filtered[0]._id));
      let updatedFields = update.$set || update;
      col[idx] = { ...col[idx], ...updatedFields };
      saveDb();
      return wrapRecord(col[idx]);
    },
    findByIdAndDelete: async (id) => {
      const col = getCollection();
      const idx = col.findIndex(item => String(item._id) === String(id));
      if (idx === -1) return null;
      const deleted = col.splice(idx, 1)[0];
      saveDb();
      return wrapRecord(deleted);
    },
    deleteMany: async (query) => {
      const col = getCollection();
      const filtered = filterItems(col, query);
      const remaining = col.filter(item => !filtered.includes(item));
      db[collectionName] = remaining;
      saveDb();
      return { deletedCount: filtered.length };
    }
  };
}

function createMockableModel(modelName, mongooseModel) {
  const mockModel = makeMockModel(modelName);
  
  return new Proxy(mongooseModel, {
    get(target, prop, receiver) {
      if (process.env.USE_MOCK_DB === 'true') {
        if (prop in mockModel) {
          return mockModel[prop];
        }
      }
      return Reflect.get(target, prop, receiver);
    }
  });
}

module.exports = {
  createMockableModel,
  makeMockModel,
  db
};
