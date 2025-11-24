const request = require("supertest");
const app = require("../src/app");

describe("Product API", () => {
  describe("GET /product", () => {
    it("should return 200 and an array of products", async () => {
      const res = await request(app).get("/product");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);

      if (res.body.length > 0) {
        const product = res.body[0];

        expect(product).toHaveProperty("id");
        expect(product).toHaveProperty("name");
        expect(product).toHaveProperty("price");
        expect(product).toHaveProperty("category");
      }
    });
  });

  describe("GET /product/:id", () => {
    it("should return a product for valid ID", async () => {
      // NOTE: using id "10" because it's in the mock product file
      const res = await request(app).get("/product/10");

      expect(res.status).toBe(200);

      expect(res.body).toHaveProperty("id", "10");
      expect(res.body).toHaveProperty("name");
      expect(res.body).toHaveProperty("price");
      expect(res.body).toHaveProperty("category");
    });

    it("should return 404 for product not found", async () => {
      const res = await request(app).get("/product/999999");

      expect(res.status).toBe(404);
      expect(res.body.code).toBe(404);
      expect(res.body.type).toBe("NOT_FOUND");
    });

    it("should return 400 for invalid ID format", async () => {
      const res = await request(app).get("/product/abc");

      expect(res.status).toBe(400);
      expect(res.body.code).toBe(400);
      expect(res.body.type).toBe("VALIDATION_ERROR");
    });
  });
});
