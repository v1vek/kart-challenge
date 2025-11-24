const ApiError = require('../utils/ApiError');
const { isPromoValid } = require('../stores/promo.store');
const { getProductById } = require('../stores/product.store');

function placeOrder(req, res, next) {
  try {
    const { couponCode, items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      throw new ApiError(400, "VALIDATION_ERROR", "items is required");
    }

    // Build full product list
    const products = [];
    let total = 0;

    for (const item of items) {
      const product = getProductById(item.productId);

      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      if (!item.quantity || item.quantity <= 0)
        throw new ApiError(400, "VALIDATION_ERROR", "quantity must be > 0");

      total += product.price * item.quantity;
      products.push({
        ...product,
        quantity: item.quantity,
      });
    }

    // Discounts
    let discount = 0;
    if (couponCode) {
      if (!isPromoValid(couponCode)) throw new ApiError(422, "INVALID_COUPON", "Invalid coupon code");
      discount = Math.round(total * 0.1 * 100) / 100; // Example: 10% discount
    }

    return res.json({
      id: crypto.randomUUID(),
      total: total - discount, // final cost
      discounts: discount,
      items,
      products,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  placeOrder,
};