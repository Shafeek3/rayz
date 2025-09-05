const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Best sellers
router.get('/best-sellers', async (req, res) => {
  try {
    const products = await Product.find({ isBestSeller: true });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// New arrivals
router.get('/new-arrivals', async (req, res) => {
  try {
    const { sort, minPrice, maxPrice } = req.query;
    let sortOption = {};

    switch (sort) {
      case 'priceAsc':
        sortOption = { price: 1 };
        break;
      case 'priceDesc':
        sortOption = { price: -1 };
        break;
      case 'nameAsc':
        sortOption = { name: 1 };
        break;
      case 'nameDesc':
        sortOption = { name: -1 };
        break;
      default:
        sortOption = {};
    }

    let priceFilter = {};
    if (minPrice) priceFilter.price = { ...priceFilter.price, $gte: Number(minPrice) };
    if (maxPrice) priceFilter.price = { ...priceFilter.price, $lte: Number(maxPrice) };

    const products = await Product.find({ isNewArrival: true, ...priceFilter }).sort(sortOption);

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Generic category route with sorting and price filtering
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { sort, minPrice, maxPrice } = req.query;
    let sortOption = {};

    // Sorting logic
    switch (sort) {
      case 'priceAsc':
        sortOption = { price: 1 };
        break;
      case 'priceDesc':
        sortOption = { price: -1 };
        break;
      case 'nameAsc':
        sortOption = { name: 1 };
        break;
      case 'nameDesc':
        sortOption = { name: -1 };
        break;
      default:
        sortOption = {};
    }

    // Price filter
    let priceFilter = {};
    if (minPrice) priceFilter.price = { ...priceFilter.price, $gte: Number(minPrice) };
    if (maxPrice) priceFilter.price = { ...priceFilter.price, $lte: Number(maxPrice) };

    const products = await Product.find({ category: category.toLowerCase(), ...priceFilter }).sort(sortOption);

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { sort, minPrice, maxPrice} = req.query;
    let sortOption = {};
    

    // Sorting logic
    switch (sort) {
      case 'priceAsc':
        sortOption = { price: 1 };
        break;
      case 'priceDesc':
        sortOption = { price: -1 };
        break;
      case 'nameAsc':
        sortOption = { name: 1 };
        break;
      case 'nameDesc':
        sortOption = { name: -1 };
        break;
      default:
        sortOption = {};
    }

    // --- Combine price filter into filter object ---
    if (minPrice !== '') filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice !== '') filter.price = { ...filter.price, $lte: Number(maxPrice) };
    // ----------------------------------------------
 

    const products = await Product.find(filter).sort(sortOption);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});



module.exports = router;