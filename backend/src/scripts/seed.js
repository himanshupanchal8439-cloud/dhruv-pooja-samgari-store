require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');

function img(keyword, seed) {
  return `https://loremflickr.com/500/500/${keyword}?lock=${seed}`;
}

const categories = [
  {
    name: 'Puja Thali Sets',
    slug: 'puja-thali-sets',
    description: 'Complete thali sets for daily and festival puja',
    image: img('thali', 101),
  },
  {
    name: 'Incense & Dhoop',
    slug: 'incense-dhoop',
    description: 'Agarbatti, dhoop sticks and cones',
    image: img('incense', 102),
  },
  {
    name: 'Idols & Murtis',
    slug: 'idols-murtis',
    description: 'Brass, marble and clay idols of deities',
    image: img('ganesha', 103),
  },
  {
    name: 'Havan Samagri',
    slug: 'havan-samagri',
    description: 'Havan kund, samidha and havan essentials',
    image: img('fire', 104),
  },
  {
    name: 'Diyas & Candles',
    slug: 'diyas-candles',
    description: 'Oil diyas, decorative diyas and candles',
    image: img('diya', 105),
  },
];

const productsByCategory = {
  'puja-thali-sets': [
    { name: 'Brass Puja Thali Set (7 pcs)', price: 899, mrp: 1299, stock: 40, keyword: 'thali' },
    { name: 'Silver Plated Wedding Thali', price: 1499, stock: 20, keyword: 'silver' },
    { name: 'Copper Puja Thali with Bell', price: 749, mrp: 999, stock: 35, keyword: 'copper' },
  ],
  'incense-dhoop': [
    { name: 'Sandalwood Agarbatti (Pack of 12)', price: 199, mrp: 299, stock: 100, keyword: 'incense' },
    { name: 'Rose Dhoop Cones (Box of 24)', price: 149, stock: 80, keyword: 'incense' },
    { name: 'Premium Hawan Dhoop Sticks', price: 249, mrp: 349, stock: 60, keyword: 'incense' },
  ],
  'idols-murtis': [
    { name: 'Brass Ganesh Idol (6 inch)', price: 1299, mrp: 1799, stock: 15, keyword: 'ganesha' },
    { name: 'Marble Laxmi Idol (8 inch)', price: 2499, stock: 10, keyword: 'statue' },
    { name: 'Panchmukhi Hanuman Idol', price: 1799, mrp: 2299, stock: 12, keyword: 'hanuman' },
  ],
  'havan-samagri': [
    { name: 'Havan Kund (Steel, 10 inch)', price: 649, stock: 25, keyword: 'bowl' },
    { name: 'Havan Samagri Combo Pack', price: 399, mrp: 599, stock: 50, keyword: 'spices' },
    { name: 'Pure Cow Ghee Havan Diya', price: 299, stock: 45, keyword: 'ghee' },
  ],
  'diyas-candles': [
    { name: 'Brass Oil Diya Set (Pack of 5)', price: 349, mrp: 499, stock: 55, keyword: 'diya' },
    { name: 'Decorative Rangoli Diyas (Set of 12)', price: 449, mrp: 699, stock: 30, keyword: 'rangoli' },
    { name: 'Scented Festival Candles (Pack of 6)', price: 249, stock: 70, keyword: 'candle' },
  ],
};

function rating(seed) {
  return { ratingAverage: 3.8 + ((seed * 37) % 12) / 10, ratingCount: 3 + ((seed * 53) % 40) };
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const categoryDocs = {};
  for (const cat of categories) {
    const doc = await Category.findOneAndUpdate({ slug: cat.slug }, cat, { upsert: true, returnDocument: 'after' });
    categoryDocs[cat.slug] = doc;
  }
  console.log(`Seeded ${categories.length} categories.`);

  let productCount = 0;
  let seedSeed = 200;
  for (const [catSlug, products] of Object.entries(productsByCategory)) {
    const category = categoryDocs[catSlug];
    for (const p of products) {
      const slug = slugify(p.name);
      seedSeed += 1;
      await Product.findOneAndUpdate(
        { slug },
        {
          name: p.name,
          slug,
          description: `${p.name} — authentic quality puja essential from Vasishtha Pooja Samagri Store.`,
          category: category._id,
          price: p.price,
          compareAtPrice: p.mrp || null,
          stock: p.stock,
          images: [img(p.keyword, seedSeed)],
          isActive: true,
          metaTitle: p.name,
          metaDescription: `Buy ${p.name} online at Vasishtha Pooja Samagri Store.`,
          ...rating(seedSeed),
        },
        { upsert: true, returnDocument: 'after' }
      );
      productCount += 1;
    }
  }
  console.log(`Seeded ${productCount} products.`);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
