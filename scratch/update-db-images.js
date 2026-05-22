import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Audited Unsplash Photo IDs mapping
const mappings = {
  // Rice & Grains
  'India Gate Basmati Rice': 'photo-1586201375761-83865001e31c',
  'Daawat Rozana Basmati Rice': 'photo-1536304997881-a372c179924b',
  'Fortune Everyday Basmati Rice': 'photo-1590080875515-8a3a8dc5735e',
  'Kohinoor Super Basmati Rice': 'photo-1626082927389-6cd097cdc6ec',
  'Tata Sampann Poha': 'photo-1601050690597-df056fb4ce78',
  '24 Mantra Organic Brown Rice': 'photo-1591814468924-cafb57c28348',
  'Lal Qilla Traditional Basmati': 'photo-1512058564366-18510be2db19',
  'Sona Masoori Rice': 'photo-1600271886742-f049cd451bba',

  // Atta & Flour
  'Aashirvaad Superior MP Atta': 'photo-1574323347407-f5e1ad6d020b',
  'Pillsbury Chakki Fresh Atta': 'photo-1509440026859-f72288b7448e',
  'Aashirvaad Multigrain Atta': 'photo-1608686207856-001b95cf60ca',
  'Fortune Chakki Atta': 'photo-1616541823729-00fe0aacd32c',
  'Rajdhani Besan': 'photo-1627483262769-04d0a1401487',
  'Aashirvaad Suji (Semolina)': 'photo-1519708227418-c8fd9a32b7a2',
  'Maida (All Purpose Flour)': 'photo-1590080876251-139d94cdf92f',

  // Pulses & Dal
  'Tata Sampann Toor Dal': 'photo-1585996746454-1c73e3a7087e',
  'Tata Sampann Moong Dal': 'photo-1626132647523-66f5bf380027',
  'Tata Sampann Chana Dal': 'photo-1547058881-aa0edd92aab3',
  'Tata Sampann Masoor Dal': 'photo-1533630988626-c918c2923e16',
  'Tata Sampann Urad Dal': 'photo-1613049117604-5823126ee2c8',
  'Rajma (Red Kidney Beans)': 'photo-1600891964599-f61ba0e24092',
  'Kabuli Chana (Chickpeas)': 'photo-1563245372-f21724e3856d',
  'Moong Sabut (Green Gram)': 'photo-1599940824399-b87987ceb72a',

  // Cooking Oils
  'Fortune Sunlite Sunflower Oil': 'photo-1474979266404-7eaacbcd87c5',
  'Fortune Soyabean Oil': 'photo-1588166524941-3bf61a9c41db',
  'Saffola Gold Oil': 'photo-1608797178974-15b35a61d121',
  'Nature Fresh Acti Heart Mustard Oil': 'photo-1590548784585-645d2b61afb2',
  'Dhara Refined Groundnut Oil': 'photo-1596755094514-f87e34085b2c',
  'Figaro Olive Oil': 'photo-1471193945509-9ad0617afabf',
  'KS Coconut Oil': 'photo-1614252368149-14a51e60058b',

  // Spices & Masala
  'MDH Deggi Mirch': 'photo-1596040033229-a9821ebd058d',
  'MDH Garam Masala': 'photo-1596040033290-7f284562c1ad',
  'Catch Turmeric Powder': 'photo-1615485290382-441e4d049cb5',
  'Catch Coriander Powder': 'photo-1615485500995-463413987bc2',
  'Everest Meat Masala': 'photo-1532336414038-cf19250c5757',
  'MDH Chana Masala': 'photo-1606787366850-de6330128bfc',
  'Catch Cumin Powder (Jeera)': 'photo-1615484477778-ca3b77940c25',
  'Everest Kitchen King Masala': 'photo-1615485291244-a82f3ef80e8e',

  // Salt & Sugar
  'Tata Salt': 'photo-1618083707368-b3823daa2726',
  'Tata Rock Salt (Sendha Namak)': 'photo-1604152135912-04a022e23696',
  'Tata Salt Lite': 'photo-1504674900247-0877df9cc836',
  'Uttam Sugar': 'photo-1581798459219-318e76aecc7b',
  'Dhampure Speciality Brown Sugar': 'photo-1601004890684-d8cbf643f5f2',
  'Trust Classic Mishri (Rock Sugar)': 'photo-1592151072895-3571d871d33c',

  // Tea & Coffee
  'Tata Tea Gold': 'photo-1576092768241-dec231879fc3',
  'Taj Mahal Tea': 'photo-1556679343-c7306c1976bc',
  'Red Label Tea': 'photo-1594631252845-29fc4cc8cfa9',
  'Wagh Bakri Premium Tea': 'photo-1563887530-623ae9f1c86e',
  'Nescafe Classic Coffee': 'photo-1559056199-641a0ac8b55e',
  'Bru Instant Coffee': 'photo-1514432324607-a09d9b4aefdd',
  'Tata Coffee Grand': 'photo-1507133750040-4a8f57021571',

  // Biscuits & Cookies
  'Parle-G Gold Biscuits': 'photo-1558961363-fa8fdf82db35',
  'Britannia Good Day Butter Cookies': 'photo-1499636136210-6f4ee915583e',
  'Britannia Marie Gold': 'photo-1590080875151-5120302b1b36',
  'Sunfeast Dark Fantasy': 'photo-1606313564200-e75d5e30476c',
  'Oreo Original Cookies': 'photo-1551024601-bec78aea704b',
  'Parle Monaco Salted Biscuit': 'photo-1589613780020-f8fdf82db35',
  'McVities Digestive Biscuits': 'photo-1590080873972-e0ac8f4ee92d',

  // Snacks & Namkeen
  'Haldiram Aloo Bhujia': 'photo-1621939514649-280e2ee25f60',
  'Haldiram Moong Dal Namkeen': 'photo-1601050690117-94f5f6fa8bd7',
  "Lay's Classic Salted Chips": 'photo-1566478989037-eec170784d0b',
  'Kurkure Masala Munch': 'photo-1613919189030-d34ef52176b6',
  'Bikaji Bikaneri Bhujia': 'photo-1605666807844-78fb683f4bd3',
  'Haldiram Mixture': 'photo-1589301760014-d929f3979dbc',
  'Act II Classic Salted Popcorn': 'photo-1578849278619-e73505e9610f',

  // Beverages
  'Coca-Cola Classic': 'photo-1622483767028-3f66f32aef97',
  'Thums Up': 'photo-1624552184280-9e9631bbeee9',
  'Frooti Mango Drink': 'photo-1534080391025-a87b8f112255',
  'Real Fruit Power Mixed Fruit': 'photo-1611080626919-7cf5a9dbab5b',
  'Paper Boat Aam Panna': 'photo-1513558161293-cdaf765ed2fd',
  'Bisleri Mineral Water': 'photo-1608889174633-41a7c2fe1f18',
  'Tang Orange Instant Drink Mix': 'photo-1613478223719-2ab802602423',

  // Dairy Products
  'Amul Taaza Toned Milk': 'photo-1628160073992-0b26db40a200',
  'Amul Gold Full Cream Milk': 'photo-1550583724-b2692b85b150',
  'Amul Butter': 'photo-1589985270826-4b7bb135bc0d',
  'Amul Cheese Slices': 'photo-1486297678162-eb2a19b0a32d',
  'Mother Dairy Dahi (Curd)': 'photo-1571244856353-fb0e521e784a',
  'Amul Fresh Paneer': 'photo-1596797038530-2c107229654b',
  'Amul Ghee': 'photo-1617470703128-26a0fc9af10f',

  // Bread & Bakery
  'Britannia Bread White': 'photo-1509440159596-0249088772ff',
  'Britannia Brown Bread': 'photo-1534482421-64566f976cfa',
  'Harvest Gold Multigrain Bread': 'photo-1589367920969-ab8e050bbb04',
  'Britannia Milk Bread': 'photo-1555507036-ab1f4038808a',
  'English Oven Burger Buns': 'photo-1585245380649-7f618274130d',
  'Britannia Pav': 'photo-1598143158390-5028fe2b20f4',

  // Fruits & Vegetables
  'Fresh Onion': 'photo-1618512496248-a07fe8376ee2',
  'Fresh Tomato': 'photo-1595855759920-86582396756a',
  'Fresh Potato': 'photo-1518977676601-b53f82aba655',
  'Fresh Green Chilli': 'photo-1588252399624-9b168670df5f',
  'Fresh Banana (Dozen)': 'photo-1571771894821-ce9b6c11b08e',
  'Fresh Apple (Shimla)': 'photo-1560806887-1e4cd0b6cbd6',
  'Fresh Ginger': 'photo-1599242429907-de8159670f5f',

  // Cleaning & Household
  'Vim Dishwash Liquid Gel': 'photo-1607344645866-009c320c5ab8',
  'Surf Excel Easy Wash': 'photo-1584813539806-2538b8d918c6',
  'Harpic Toilet Cleaner': 'photo-152874056446f-c1f6de722f5c',
  'Lizol Floor Cleaner Citrus': 'photo-1563453392212-326f5e854473',
  'Colin Glass Cleaner': 'photo-1585421514738-01798e348b17',
  'Scotch-Brite Scrub Pad (3 pcs)': 'photo-1583947215259-38e31be8751f',
  'Comfort Fabric Conditioner': 'photo-1626806787461-102c1bfaaea1',
  'Odonil Room Freshener Block': 'photo-1595981267035-7b04ca84a82d',

  // Personal Care
  'Colgate Strong Teeth Toothpaste': 'photo-1559599101-f09722fb4925',
  'Dettol Liquid Handwash': 'photo-1601597111158-2fceff292cdc',
  'Dove Cream Beauty Bar': 'photo-1607006342411-9a910c74bba2',
  'Head & Shoulders Anti-Dandruff Shampoo': 'photo-1535585209827-a15fcdbc4c2d',
  'Nivea Body Lotion': 'photo-1620916566398-39f1143ab7be',
  'Gillette Guard Razor': 'photo-1501594907352-04cda38ebc29',
  'Lux Soft Touch Soap': 'photo-1605264964528-06403738d6dc',
  'Whisper Ultra Clean Sanitary Pads': 'photo-1550572017-edd951b55104',
};

const updateFile = (filePath) => {
  const absolutePath = path.resolve(__dirname, '..', filePath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`File not found: ${absolutePath}`);
    return false;
  }

  let content = fs.readFileSync(absolutePath, 'utf8');
  let matchCount = 0;

  // Let's split content into lines, find the product name lines, and replace the image URLs
  const lines = content.split('\n');
  const updatedLines = lines.map(line => {
    // Check if the line has a name property
    const nameMatch = line.match(/name:\s*['"]([^'"]+)['"]/);
    if (nameMatch) {
      const name = nameMatch[1];
      if (mappings[name]) {
        const rawId = mappings[name];
        const photoId = rawId.startsWith('photo-') ? rawId : `photo-${rawId}`;
        const newImage = `https://images.unsplash.com/photoId?w=400&h=400&fit=crop`.replace('photoId', photoId);
        // Replace the image url
        let newLine = line.replace(/(image:\s*['"])([^'"]+)(['"])/, `$1${newImage}$3`);
        
        // If image property is not formatted with quotes, try replacing the entire image property:
        if (newLine === line) {
          newLine = line.replace(/(image:\s*images\.[a-zA-Z0-9_]+)/, `image: '${newImage}'`);
        }
        
        if (newLine !== line) {
          matchCount++;
          return newLine;
        }
      }
    }
    return line;
  });

  fs.writeFileSync(absolutePath, updatedLines.join('\n'), 'utf8');
  console.log(`✅ Successfully updated ${matchCount} products in: ${filePath}`);
  return true;
};

// Execute updates
console.log('Starting image mappings update...');
updateFile('backend/config/mockDb.js');
updateFile('backend/seed.js');
console.log('Update finished!');
