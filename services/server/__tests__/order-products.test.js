const app = require("../app");
const request = require("supertest");
const { sequelize, OrderProduct } = require("../models");
const { queryInterface } = sequelize;

beforeAll(() => {
  queryInterface.bulkInsert(
    "OrderProduct",
    [
      {
        ProductId: 1,
        OrderId: 1,
        quantity: 10,
        subTotal: 100000,
        price: 10000,
      },
      {
        ProductId: 2,
        OrderId: 1,
        quantity: 5,
        subTotal: 50000,
        price: 10000,
      },
    ],
    {}
  );
});

describe("test table OrderProducts", () => {
  test("testing read OrderProducts if success", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    response.body.forEach((el) => {
      expect(el).toHaveProperty("ProductId", expect.any(Integer));
      expect(el).toHaveProperty("OrderId", expect.any(Integer));
      expect(el).toHaveProperty("quantity", expect.any(Integer));
      expect(el).toHaveProperty("subTotal", expect.any(Integer));
      expect(el).toHaveProperty("price", expect.any(Integer));
    });
  });
  test("testing table read OrderProducts if error", async () => {
    jest
      .spyOn(OrderProduct, "findAll")
      .mockImplementationOnce(() =>
        Promise.reject({ name: "something wrong" })
      );
    const response = await request(app).get("/");
    expect(response.status).toBe(500);
  });
  test("testing read OrderProducts by Id", async () => {
    const response = await request(app).get("/1");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("ProductId", expect.any(Integer));
    expect(response.body).toHaveProperty("OrderId", expect.any(Integer));
    expect(response.body).toHaveProperty("quantity", expect.any(Integer));
    expect(response.body).toHaveProperty("subTotal", expect.any(Integer));
    expect(response.body).toHaveProperty("price", expect.any(Integer));
  });
  test("testing read OrderProducts if data by id not found", async () => {
    const response = await request(app).get(`/1000`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("msg", "OrderProduct Not Found");
  });
});

afterAll(async () => {
  queryInterface.bulkDelete("OrderProducts", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});
