const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: Array,
  total: Number,
  status: { type: String, default: "Placed" }, // Placed, Shipped, Delivered, Cancelled
  date: { type: Date, default: Date.now },
  address: String // <-- add this line
});

const userSchema = new mongoose.Schema({
  contact: { type: String, required: true, unique: true }, // email or phone
  name: String,
  mobile: String,
  postcode: String,
  place: String,
  landmark: String,
  district: String,
  state: String,
  country: String,
  address: String,
  cart: { type: Array, default: [] },
   orders: { type: [orderSchema], default: [] },
   isAdmin: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);