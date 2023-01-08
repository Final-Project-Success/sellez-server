const app = require("../app");
const request = require("supertest");
const { sequelize, OrderProduct } = require("../models");
const { hashPassword } = require("../helpers/bcrypt");
const { jwtSign } = require("../helpers/jwt");
const { queryInterface } = sequelize;

let access_token;
beforeAll(async () => {
  queryInterface.bulkInsert(
    "Users",
    [
      {
        username: "user1",
        email: "user1111@gmail.com",
        password: hashPassword("qwerty"),
        address: "Hacktiv8",
        profilePict:
          "https://www.smartfren.com/app/uploads/2021/11/featured-image-37.png",
        role: "customer",
        phoneNumber: "081312391839",
      },
    ],
    {}
  );
  access_token = jwtSign({ id: 1 });
  await queryInterface.bulkInsert(
    "Categories",
    [
      {
        name: "Running Shoes",
      },
    ],
    {}
  );
  await queryInterface.bulkInsert(
    "Products",
    [
      {
        name: "Air Jordan 1 Bred Patent",
        price: 8000000,
        description:
          "The Air Jordan 1 Retro High OG 'Patent Bred' treats the iconic colorway to a glossy makeover. Aside from the shoe's patent leather construction, the essential design DNA remains intact. The upper pairs basic black paneling with contrasting hits of Varsity Red on the toe box, Swoosh, heel overlay and collar flap. A woven Nike tag adorns the black nylon tongue, while a Wings logo is stamped on the lateral collar. The high-top rides on a sturdy rubber cupsole, enhanced with an Air-sole unit encapsulated in lightweight polyurethane.",
        imgUrl:
          "https://cdn.shopify.com/s/files/1/0516/0760/1336/products/Voila_1_f179f0c5-9c5e-43a6-9fe6-b5a252f55f5b_1000x.jpg?v=1642647113",
        stock: 20,
        CategoryId: 1,
        color: "red",
      },
    ],
    {}
  );
  queryInterface.bulkInsert("Orders", [
    {
      totalPrice: 100000,
      UserId: 1,
      shippingCost: 20000,
      status: false,
    },
  ]);
  queryInterface.bulkInsert(
    "OrderProducts",
    [
      {
        ProductId: 1,
        OrderId: 1,
        quantity: 10,
        subTotal: 100000,
        price: 10000,
      },
    ],
    {}
  );
});

const createOrderProduct = {
  ProductId: 1,
  OrderId: 1,
  quantity: 5,
  subTotal: 50000,
  price: 10000,
};

describe("test table OrderProducts", () => {
  test("testing read OrderProducts if success", async () => {
    const response = await request(app)
      .get("/order-products")
      .set("access_token", access_token);
    // console.log(response.status);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    response.body.forEach((el) => {
      expect(el).toHaveProperty("ProductId", expect.any(Number));
      expect(el).toHaveProperty("OrderId", expect.any(Number));
      expect(el).toHaveProperty("quantity", expect.any(Number));
      expect(el).toHaveProperty("subTotal", expect.any(Number));
      expect(el).toHaveProperty("price", expect.any(Number));
    });
  });
  test("testing read OrderProducts if User isn't logged in", async () => {
    const response = await request(app).get("/order-products");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("msg", "Please Login First");
  });
  test("testing table read OrderProducts if error", async () => {
    jest
      .spyOn(OrderProduct, "findAll")
      .mockImplementationOnce(() =>
        Promise.reject({ name: "something wrong" })
      );
    const response = await request(app)
      .get("/order-products")
      .set("access_token", access_token);
    expect(response.status).toBe(500);
  });
  test("testing read OrderProducts by Id", async () => {
    const response = await request(app)
      .get("/order-products/1")
      .set("access_token", access_token);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("ProductId", expect.any(Number));
    expect(response.body).toHaveProperty("OrderId", expect.any(Number));
    expect(response.body).toHaveProperty("quantity", expect.any(Number));
    expect(response.body).toHaveProperty("subTotal", expect.any(Number));
    expect(response.body).toHaveProperty("price", expect.any(Number));
  });
  test("testing read OrderProducts if data by id not found", async () => {
    const response = await request(app)
      .get("/order-products/1000")
      .set("access_token", access_token);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("msg", "OrderProduct Not Found");
  });
  test("testing create OrderProducts if success", async () => {
    const response = await request(app)
      .post("/order-products")
      .send(createOrderProduct)
      .set("access_token", access_token);
    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("ProductId", expect.any(Number));
    expect(response.body).toHaveProperty("OrderId", expect.any(Number));
    expect(response.body).toHaveProperty("quantity", expect.any(Number));
    expect(response.body).toHaveProperty("subTotal", expect.any(Number));
    expect(response.body).toHaveProperty("price", expect.any(Number));
  });
  test("testing create OrderProducts if ProductId is empty", async () => {
    const data = {
      ...createOrderProduct,
      ProductId: "",
    };
    const response = await request(app)
      .post("/order-products")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Product id is required");
  });
});

afterAll(async () => {
  await queryInterface.bulkDelete("Categories", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  await queryInterface.bulkDelete("Products", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  await queryInterface.bulkDelete("Orders", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  await queryInterface.bulkDelete("OrderProducts", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  await queryInterface.bulkDelete("Users", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});
