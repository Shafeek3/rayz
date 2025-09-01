// routes/search.js
// routes/search.js

const express = require('express');
const Product = require('../models/Product');
const router = express.Router();


router.get("/suggestions", async (req, res) => {
  const q = req.query.q || "";
  if (!q) return res.json([]);

  try {
    const results = await Product.find(
      { name: { $regex: q, $options: "i" } },
      "name _id" // return only name and _id
    ).limit(10);

    res.json(results.map(item => ({ id: item._id, name: item.name })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/", async (req, res) => {
  const q = req.query.q || "";
  try {
    const results = await Product.find(
      { name: { $regex: q, $options: "i" } }
    ); 

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

