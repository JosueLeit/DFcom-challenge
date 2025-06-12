const express = require('express');
const mongoose = require('mongoose');

const productsRoutes = require('./routes/products');
const reviewsRoutes = require('./routes/reviews');

const app = express();

app.use(express.json());

app.use('/products', productsRoutes);
app.use('/reviews', reviewsRoutes);

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/backend';
mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

module.exports = app;

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server running on port ${port}`));
}
