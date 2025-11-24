const request = require("supertest");
const app = require("../src/app");

describe("API Key Middleware", () => {
  it("should return 401 if missing api_key", async () => {
    const res = await request(app).post("/order").send({});

    expect(res.status).toBe(401);
    expect(res.body.type).toBe("UNAUTHORIZED");
  });

  it("should return 403 if invalid api_key", async () => {
    const res = await request(app)
      .post("/order")
      .set("api_key", "wrongkey")
      .send({});

    expect(res.status).toBe(403);
    expect(res.body.type).toBe("FORBIDDEN");
  });

  it("should pass authentication with correct key", async () => {
    const res = await request(app)
      .post("/order")
      .set("api_key", "apitest")
      .send({
        items: [{ productId: "10", quantity: 1 }]
      });

    // Status depends on other validations
    expect(res.status).not.toBe(401);
    expect(res.status).not.toBe(403);
  });
});
