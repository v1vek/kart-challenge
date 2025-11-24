const fs = require('fs');
const path = require('path');

function loadValidPromos() {
  const filePath = path.join(__dirname, '..', 'data', 'valid_promos.txt');

  const promos = fs
    .readFileSync(filePath, 'utf8')
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((p) => p.trim().toUpperCase());

  return new Set(promos);
}

module.exports = {
  loadValidPromos,
};