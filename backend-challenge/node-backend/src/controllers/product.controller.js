const ProductStore = require('../stores/product.store');
const ApiError = require('../utils/ApiError');

function listProducts(req, res) {
  return res.status(200).json(ProductStore.getAllProducts());
}

function getProduct(req, res) {
  const { productId } = req.params;

  // Validate ID format
  if (!/^\d+$/.test(productId)) {
    throw new ApiError(400, "VALIDATION_ERROR", "productId must be a valid integer");
  }

  const product = ProductStore.getProductById(productId);

  if (!product) {
    throw new ApiError(404, "NOT_FOUND", `Product ${productId} not found`);
  }

  return res.status(200).json(product);
}

module.exports = {
  listProducts,
  getProduct
};