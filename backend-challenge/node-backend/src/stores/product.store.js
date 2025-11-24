const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');

let products = null;

function initProductStore() {
  if (products) return;

  const file = path.join(__dirname, '..', 'data', 'products.json');
  const raw = fs.readFileSync(file, 'utf8');
  products = JSON.parse(raw);

  logger.info(`Loaded ${products.length} products.`);
}

function getAllProducts() {
  if (!products) initProductStore();
  return products;
}

function getProductById(id) {
  if (!products) initProductStore();
  return products.find(p => p.id === String(id));
}

module.exports = {
  initProductStore,
  getAllProducts,
  getProductById,
};
