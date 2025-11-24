const express = require('express');
const productController = require('../controllers/product.controller');

const router = express.Router();

router
  .route('/')
  .get(productController.listProducts);

router
  .route('/:productId')
  .get(productController.getProduct);

module.exports = router;
