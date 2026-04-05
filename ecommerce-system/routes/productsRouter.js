// ============================================================
// Q2 - productsRouter.js
// RESTful CRUD operations using fs.promises + async/await
// ============================================================

const express = require('express');
const fs = require('fs');
const router = express.Router();

const config = require('../config/config');

// ---------- Helper functions ----------

// Read products.json
const readProducts = async () => {
  const data = await fs.promises.readFile(config.PRODUCTS_FILE, 'utf-8');
  return JSON.parse(data);
};

// Write to products.json
const writeProducts = async (products) => {
  await fs.promises.writeFile(
    config.PRODUCTS_FILE,
    JSON.stringify(products, null, 2)
  );
};

// ============================================================
// GET all products
// ============================================================
router.get('/', async (req, res, next) => {
  try {
    const products = await readProducts();
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// ============================================================
// GET product by ID
// ============================================================
router.get('/:id', async (req, res, next) => {
  try {
    const products = await readProducts();
    const product = products.find(p => p.id === req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
});

// ============================================================
// POST create new product
// ============================================================
router.post('/', async (req, res, next) => {
  try {
    const products = await readProducts();

    const newProduct = {
      id: Date.now().toString(),
      name: req.body.name,
      price: req.body.price
    };

    products.push(newProduct);
    await writeProducts(products);

    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
});

// ============================================================
// PUT update product
// ============================================================
router.put('/:id', async (req, res, next) => {
  try {
    const products = await readProducts();

    const index = products.findIndex(p => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    products[index] = {
      ...products[index],
      ...req.body
    };

    await writeProducts(products);

    res.json(products[index]);
  } catch (err) {
    next(err);
  }
});

// ============================================================
// DELETE product
// ============================================================
router.delete('/:id', async (req, res, next) => {
  try {
    const products = await readProducts();

    const index = products.findIndex(p => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    products.splice(index, 1);

    await writeProducts(products);

    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;