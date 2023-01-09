const app = require("../app");
const axios = require("axios");
const request = require("supertest");
const { sequelize, Order } = require("../models");
const { hashPassword } = require("../helpers/bcrypt");
const { jwtSign } = require("../helpers/jwt");
const redis = require("../config/connectRedis");
const { text } = require("express");
const { queryInterface } = sequelize;

let access_token;
jest.mock("axios");
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
});
beforeEach(() => {
  jest.restoreAllMocks();
  redis.del("sellez-orders");
});

const createOrder = {
  totalPrice: 50000,
  UserId: 1,
  shippingCost: 20000,
  status: false,
};
describe("test table Orders", () => {
  test("testing read Orders if User isn't logged in", async () => {
    const response = await request(app).get("/orders");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("msg", "Please Login First");
  });
  test.only("testing read Orders if success", async () => {
    const response = await request(app)
      .get("/orders")
      .set("access_token", access_token);
    expect(response.status).toBe(200);
    // expect(response.body).toBeInstanceOf(Object);
    // response.body.forEach((el) => {
    //   expect(el).toHaveProperty("UserId", expect.any(Number));
    //   expect(el).toHaveProperty("status", expect.any(Boolean));
    //   expect(el).toHaveProperty("shippingCost", expect.any(Number));
    //   expect(el).toHaveProperty("totalPrice", expect.any(Number));
    //   expect(el).toHaveProperty("createdAt", expect.any(String));
    //   expect(el).toHaveProperty("updatedAt", expect.any(String));
    // });
  });
  test("testing table read Orders if error", async () => {
    jest
      .spyOn(Order, "findAll")
      .mockImplementationOnce(() =>
        Promise.reject({ name: "something wrong" })
      );
    const response = await request(app)
      .get("/orders")
      .set("access_token", access_token);
    expect(response.status).toBe(500);
  });
  test("testing using chace", async () => {
    jest
      .spyOn(redis, "get")
      .mockImplementationOnce(() => Promise.resolve(JSON.stringify([])));
    const response = await request(app)
      .get("/orders")
      .set("access_token", access_token);
    // console.log(response.status);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });
  test("testing create Order if success", async () => {
    const response = await request(app)
      .post("/orders")
      .send(createOrder)
      .set("access_token", access_token);
    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("UserId", expect.any(Number));
    expect(response.body).toHaveProperty("status", expect.any(Boolean));
    expect(response.body).toHaveProperty("shippingCost", expect.any(Number));
    expect(response.body).toHaveProperty("totalPrice", expect.any(Number));
    expect(response.body).toHaveProperty("createdAt", expect.any(String));
    expect(response.body).toHaveProperty("updatedAt", expect.any(String));
  });
  test("testing create Order by id if totalPrice is null", async () => {
    const data = {
      ...createOrder,
      totalPrice: null,
    };
    const response = await request(app)
      .post("/orders")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Total price is required");
  });
  test("testing create Order by id if totalPrice is empty", async () => {
    const data = {
      ...createOrder,
      totalPrice: "",
    };
    const response = await request(app)
      .post("/orders")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Total price is required");
  });
  test("testing create Order by id if shippingCost is null", async () => {
    const data = {
      ...createOrder,
      shippingCost: null,
    };
    const response = await request(app)
      .post("/orders")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Shipping cost is required");
  });
  test("testing create Order by id if shippingCost is empty", async () => {
    const data = {
      ...createOrder,
      shippingCost: "",
    };
    const response = await request(app)
      .post("/orders")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Shipping cost is required");
  });
  test("testing read Order by Id", async () => {
    const response = await request(app)
      .get("/orders/1")
      .set("access_token", access_token);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("UserId", expect.any(Number));
    expect(response.body).toHaveProperty("status", expect.any(Boolean));
    expect(response.body).toHaveProperty("shippingCost", expect.any(Number));
    expect(response.body).toHaveProperty("totalPrice", expect.any(Number));
    expect(response.body).toHaveProperty("createdAt", expect.any(String));
    expect(response.body).toHaveProperty("updatedAt", expect.any(String));
  });
  test("testing read Order by id if Id not found", async () => {
    const response = await request(app)
      .get("/orders/1000")
      .set("access_token", access_token);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("msg", "Order Not Found");
  });
  test("testing edit Order by id if success", async () => {
    const data = {
      ...createOrder,
      totalPrice: 70000,
      shippingCost: 25000,
    };
    const response = await request(app)
      .put("/orders/2")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("msg", "Success to order");
  });
  test("testing edit Order by id if id not found", async () => {
    const data = {
      ...createOrder,
      totalPrice: 70000,
      shippingCost: 25000,
    };
    const response = await request(app)
      .put("/orders/1000")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("msg", "Order Not Found");
  });
  test("testing edit Order by id if totalPrice is null", async () => {
    const data = {
      ...createOrder,
      totalPrice: null,
    };
    const response = await request(app)
      .put("/orders/2")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Total price is required");
  });
  test("testing edit Order by id if totalPrice is empty", async () => {
    const data = {
      ...createOrder,
      totalPrice: "",
    };
    const response = await request(app)
      .put("/orders/2")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Total price is required");
  });
  test("testing edit Order by id if shippingCost is null", async () => {
    const data = {
      ...createOrder,
      shippingCost: null,
    };
    const response = await request(app)
      .put("/orders/2")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Shipping cost is required");
  });
  test("testing edit Order by id if shippingCost is empty", async () => {
    const data = {
      ...createOrder,
      shippingCost: "",
    };
    const response = await request(app)
      .put("/orders/2")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Shipping cost is required");
  });
  test("testing edit Order by Id in status if success", async () => {
    const data = {
      ...createOrder,
      status: true,
    };
    const response = await request(app)
      .patch("/orders/2")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("msg", "Order already paid");
  });
  test("testing edit Order by Id in status if id not found", async () => {
    const data = {
      ...createOrder,
      status: true,
    };
    const response = await request(app)
      .patch("/orders/1000")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("msg", "Order Not Found");
  });
  // test.only("testing raja ongkir destination if success", async () => {
  //   const destination = {
  //     rajaongkir: {
  //       query: [],
  //       status: {
  //         code: 200,
  //         description: "OK",
  //       },
  //       results: [
  //         {
  //           city_id: "1",
  //           province_id: "21",
  //           province: "Nanggroe Aceh Darussalam (NAD)",
  //           type: "Kabupaten",
  //           city_name: "Aceh Barat",
  //           postal_code: "23681",
  //         },
  //       ],
  //     },
  //   };
  //   const resp = { data: {} };
  //   axios.get.mockResolvedValue({ data: {} });
  //   const response = await request(app)
  //     .get("/orders/city")
  //     .set("access_token", access_token);
  //   expect(response.status).toBe(200);
  //   expect(response.body).toBeInstanceOf(Object);
  // });
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
  await queryInterface.bulkDelete("Users", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});
