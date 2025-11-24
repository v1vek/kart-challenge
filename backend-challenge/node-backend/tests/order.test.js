const request = require("supertest");
const app = require("../src/app");

describe("POST /order", () => {
  it("should reject missing api_key", async () => {
    const res = await request(app)
      .post("/order")
      .send({ items: [] });

    expect(res.status).toBe(401);
    expect(res.body.type).toBe("UNAUTHORIZED");
  });

  it.only("should reject invalid coupon", async () => {
    const res = await request(app)
      .post("/order")
      .set("api_key", "apitest")
      .send({
        couponCode: "INVALID123",
        items: [{ productId: "10", quantity: 1 }]
      });

    expect(res.status).toBe(422);
    expect(res.body.type).toBe("INVALID_COUPON");
  });

  it("should place a valid order", async () => {
    const res = await request(app)
      .post("/order")
      .set("api_key", "apitest")
      .send({
        couponCode: "HAPPYHRS",
        items: [{ productId: "10", quantity: 2 }]
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.total).toBeDefined();
  });
});
