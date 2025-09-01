const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  isBestSeller: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  category: String,
  description: String,
});

module.exports = mongoose.model('Product', productSchema);
