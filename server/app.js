const express = require('express');
const app = express(); // ← Add this line!
const cors = require('cors');
//const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv/config');
const authJwt = require('./helper/jwt.js');

app.use(cors());
app.options('*', cors());
app.use(express.json());
//app.use(authJwt());

// middleware
app.use(bodyParser.json());

// Routes
const categoryRoutes = require('./routes/category');
const subCatRoutes = require('./routes/subCat');
const productRoutes = require('./routes/products')
const productWeightRoutes = require('./routes/productWeight')
const productRamsRoutes = require('./routes/productRams');
const productSizeRoutes = require('./routes/productSize');
const userRoutes = require('./routes/user');
const cartRoutes = require('./routes/cart');
const productReviewsRoutes = require('./routes/productReviews');
const myListRoutes = require('./routes/myList');
const ordersRoutes = require('./routes/orders');
const checkoutRoutes = require('./routes/checkout');
const homeBannerRoutes = require('./routes/homeBanner');
const searchRoutes = require('./routes/search');
const newsletterRoutes=require("./routes/newsletter");

app.use("/uploads", express.static("uploads"));
app.use('/api/category', categoryRoutes);
app.use('/api/subCat', subCatRoutes);
app.use('/api/products', productRoutes);
app.use('/api/productWeight', productWeightRoutes);
app.use('/api/productRams', productRamsRoutes);
app.use('/api/productSize', productSizeRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/productReviews', productReviewsRoutes);
app.use('/api/my-list', myListRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/homeBanner', homeBannerRoutes);
app.use('/api/search', searchRoutes);

app.use('/api/user', userRoutes);
app.use("/api/newsletter",newsletterRoutes);

//database
mongoose.connect(process.env.CONNECTION_STRING)
.then(()=>{
  console.log('Database Connetion is ready...')
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
     console.log(`Server running on http://localhost:${PORT}`);
  });
})
.catch((err)=>{
  console.log(err);
})





