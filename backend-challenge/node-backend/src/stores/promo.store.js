const { loadValidPromos } = require('../services/promo.service');
const logger = require('../config/logger');

let promoSet = null;
let initialized = false;

async function initPromoStore() {
  if (initialized) return;

  logger.info("Loading valid promo codes");

  promoSet = loadValidPromos();
  initialized = true;

  logger.info(`Promo store ready with: (${promoSet.size} valid promo codes)`);
}

function isPromoValid(code) {
  if (!promoSet) {
    throw new Error("Promo store not initialized");
  }

  if (!code) return false;

  return promoSet.has(code.trim().toUpperCase());
}

module.exports = {
  initPromoStore,
  isPromoValid,
};