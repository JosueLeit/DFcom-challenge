const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/product');
const Review = require('../models/review');

const router = express.Router();

router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.sendStatus(404);
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.sendStatus(404);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.sendStatus(404);
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id/average-rating', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(id) } },
      { $group: { _id: '$product', averageRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    if (result.length === 0) {
      return res.json({ averageRating: null, count: 0 });
    }
    res.json({ averageRating: result[0].averageRating, count: result[0].count });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
