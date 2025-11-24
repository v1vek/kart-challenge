const express = require('express');
const auth = require('../middlewares/auth');
const orderController = require('../controllers/order.controller');

const router = express.Router();

router.post('/', auth, orderController.placeOrder);

module.exports = router;
