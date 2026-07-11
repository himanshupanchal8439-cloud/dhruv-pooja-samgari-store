require('dns').setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');
const Product = require('../models/Product');

const LOCAL_URI = 'mongodb://localhost:27017/dhruv-pooja-samagri';
const PROD_URI = process.env.PROD_MONGO_URI;
const OLD_HOST = 'http://localhost:5000';
const NEW_HOST = 'https://dhruv-pooja-backend.onrender.com';

(async () => {
  const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
  const prodConn = await mongoose.createConnection(PROD_URI).asPromise();

  const LocalProduct = localConn.model('Product', Product.schema);
  const ProdProduct = prodConn.model('Product', Product.schema);

  const localProducts = await LocalProduct.find({}).lean();
  let updated = 0;
  for (const lp of localProducts) {
    const images = (lp.images || []).map((u) => u.replace(OLD_HOST, NEW_HOST));
    const videos = (lp.videos || []).map((u) => u.replace(OLD_HOST, NEW_HOST));
    const res = await ProdProduct.updateOne({ slug: lp.slug }, { $set: { images, videos } });
    if (res.matchedCount) updated++;
    console.log(lp.slug, '->', images, res.matchedCount ? 'OK' : 'NOT FOUND IN PROD');
  }
  console.log(`Updated ${updated} of ${localProducts.length} products.`);

  await localConn.close();
  await prodConn.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
