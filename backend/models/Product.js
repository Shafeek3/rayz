const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  isBestSeller: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  category: String,
  description: String,
    ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String }
    }
  ]
});

module.exports = mongoose.model('Product', productSchema);
