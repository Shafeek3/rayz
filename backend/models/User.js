const mongoose = require('mongoose');

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
  orders: { type: Array, default: [] }
});

module.exports = mongoose.model('User', userSchema);