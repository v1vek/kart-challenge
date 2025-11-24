const app = require("../src/app");
const { isPromoValid } = require("../src/stores/promo.store");

describe("Promo validation", () => {
  it("should return true for valid promo", () => {
    expect(isPromoValid("HAPPYHRS")).toBe(true);
  });

  it("should return false for invalid promo", () => {
    expect(isPromoValid("INVALID123")).toBe(false);
  });
});
