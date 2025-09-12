const express = require('express');
const Product = require('../models/Product');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const adminOnly = require('../middleware/admin');
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

    const products = await Product.find({ category: category.toLowerCase(), ...priceFilter }).sort(sortOption);

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { sort, minPrice, maxPrice } = req.query;
    let sortOption = {};
    let filter = {};

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

    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };

    const products = await Product.find(filter).sort(sortOption);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add or update rating and comment
router.post("/:id/rate", authMiddleware, async (req, res) => {
  const { rating, comment } = req.body;
  const userId = req.user._id;
 

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: "Rating must be 1-5" });
  }

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Remove previous rating by this user
    product.ratings = product.ratings.filter(
      (r) => r.user.toString() !== userId.toString()
    );

    // Push new rating
    product.ratings.push({
      user: userId,
      rating,
      comment,
    });

    await product.save();

    // Repopulate so frontend immediately gets username
    await product.populate("ratings.user", "name");

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get single product with populated user names in ratings
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('ratings.user', 'name');
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});



// Add a product
router.post('/admin/add', authMiddleware, adminOnly, async (req, res) => {
  const { name, price, image, category, description } = req.body;
  const product = await Product.create({ name, price, image, category, description });
  res.json({ success: true, product });
});

// Edit a product
router.put('/admin/edit/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, price, image, category, description, isBestSeller, isNewArrival } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, image, category, description, isBestSeller, isNewArrival },
      { new: true }
    );
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (err) {
    console.error("Edit product error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Delete a product
router.delete('/admin/delete/:id', authMiddleware, adminOnly, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Clear all products
router.delete('/admin/clear', authMiddleware, adminOnly, async (req, res) => {
  await Product.deleteMany({});
  res.json({ success: true });
});

module.exports = router;
