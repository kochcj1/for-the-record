const request = require("supertest");
const app = require("../src/server.cjs");

describe("GET /health", () => {
  it("Responds with a 200 status code and expected body", async () => {
    const response = await request(app)
      .get("/health")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(response.body.message).toEqual("OK");
    expect(response.body.mongodb).toEqual("OK");
  });
});
