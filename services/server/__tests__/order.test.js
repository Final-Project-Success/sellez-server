const app = require("../app");
const axios = require("axios");
const request = require("supertest");
const { sequelize, Order, Product } = require("../models");
const { hashPassword } = require("../helpers/bcrypt");
const { jwtSign } = require("../helpers/jwt");
const redis = require("../config/connectRedis");
const { text } = require("express");
const { queryInterface } = sequelize;
jest.setTimeout(50000);

let product = [];
let access_token;
jest.mock("axios");
beforeAll(async () => {
  queryInterface.bulkInsert(
    "Users",
    [
      {
        username: "user1",
        email: "user1@gmail.com",
        password: hashPassword("qwerty"),
        address: "Hacktiv8",
        role: "customer",
        phoneNumber: "081312391839",
      },
      {
        username: "user2",
        email: "user2@gmail.com",
        password: hashPassword("qwerty"),
        address: "Hacktiv8",
        role: "admin",
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
  queryInterface.bulkInsert(
    "Orders",
    [
      {
        UserId: 1,
        totalPrice: 50000,
        shippingCost: 20000,
        status: false,
        invoice: "test",
      },
    ],
    {}
  );
  product = await Product.bulkCreate([
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
      quantity: 10,
    },
  ]);
});
beforeEach(() => {
  jest.restoreAllMocks();
});

describe("test table Orders", () => {
  test("testing read Orders if User isn't logged in", async () => {
    const response = await request(app).get("/orders");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("msg", "Please Login First");
  });
  test("testing read Orders if success", async () => {
    const response = await request(app)
      .get("/orders")
      .set("access_token", access_token);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    response.body.forEach((el) => {
      expect(el).toHaveProperty("UserId", expect.any(Number));
      expect(el).toHaveProperty("status", expect.any(String));
      expect(el).toHaveProperty("shippingCost", expect.any(Number));
      expect(el).toHaveProperty("totalPrice", expect.any(Number));
      expect(el).toHaveProperty("createdAt", expect.any(String));
      expect(el).toHaveProperty("updatedAt", expect.any(String));
    });
  });
  test("testing read Orders from admin if success", async () => {
    let access_token = jwtSign({ id: 2 });
    const response = await request(app)
      .get("/orders/admin")
      .set("access_token", access_token);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    response.body.forEach((el) => {
      expect(el).toHaveProperty("UserId", expect.any(Number));
      expect(el).toHaveProperty("status", expect.any(String));
      expect(el).toHaveProperty("shippingCost", expect.any(Number));
      expect(el).toHaveProperty("totalPrice", expect.any(Number));
      expect(el).toHaveProperty("createdAt", expect.any(String));
      expect(el).toHaveProperty("updatedAt", expect.any(String));
    });
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
  test("testing table read Orders from admin if error", async () => {
    let access_token = jwtSign({ id: 2 });

    jest
      .spyOn(Order, "findAll")
      .mockImplementationOnce(() =>
        Promise.reject({ name: "something wrong" })
      );
    const response = await request(app)
      .get("/orders/admin")
      .set("access_token", access_token);
    expect(response.status).toBe(500);
  });
  test("testing create Order if success", async () => {
    const createOrder = {
      totalPrice: 50000,
      shippingCost: 20000,
      products: JSON.stringify(
        product.map((el) => {
          return {
            ...el.dataValues,
            cartQuantity: 2,
          };
        })
      ),
    };
    const response = await request(app)
      .post("/orders")
      .send(createOrder)
      .set("access_token", access_token);
    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("invoice_url", expect.any(String));
  });
  test("testing create Order by id if totalPrice is null", async () => {
    const createOrder = {
      totalPrice: null,
      shippingCost: 20000,
      products: JSON.stringify(
        product.map((el) => {
          return {
            ...el.dataValues,
            cartQuantity: 2,
          };
        })
      ),
    };
    const response = await request(app)
      .post("/orders")
      .send(createOrder)
      .set("access_token", access_token);
    expect(response.status).toBe(500);
  });
  test("testing create Order by id if totalPrice is empty", async () => {
    const createOrder = {
      totalPrice: "",
      shippingCost: 20000,
      products: JSON.stringify(
        product.map((el) => {
          return {
            ...el.dataValues,
            cartQuantity: 2,
          };
        })
      ),
    };
    const response = await request(app)
      .post("/orders")
      .send(createOrder)
      .set("access_token", access_token);
    expect(response.status).toBe(500);
  });
  test("testing read Order by Id", async () => {
    const response = await request(app)
      .get("/orders/1")
      .set("access_token", access_token);
    // console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("UserId", expect.any(Number));
    expect(response.body).toHaveProperty("status", expect.any(String));
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
  test("testing update status order if success", async () => {
    const response = await request(app)
      .post("/orders/paid")
      .set("x-callback-token", process.env.XENDIT_X)
      .send({ status: "PAID", id: "test", paid_amount: 50000 });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Update to PAID Success");
  });
  test("testing update status order if process.env error", async () => {
    const response = await request(app)
      .post("/orders/paid")
      .set("x-callback-token", "ERORR")
      .send({ status: "PAID", id: "test", paid_amount: 50000 });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "You are not authorized");
  });
  test("testing update status order if data not found", async () => {
    const response = await request(app)
      .post("/orders/paid")
      .set("x-callback-token", process.env.XENDIT_X)
      .send({ status: "PAID", id: "asd", paid_amount: 50000 });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Data not found");
  });
  test("testing update status order if Paid amount not same with amount", async () => {
    const response = await request(app)
      .post("/orders/paid")
      .set("x-callback-token", process.env.XENDIT_X)
      .send({ status: "PAID", id: "test", paid_amount: 70000 });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Paid amount not same with amount"
    );
  });
  test("testing update status order if Update to Expired Success", async () => {
    const response = await request(app)
      .post("/orders/paid")
      .set("x-callback-token", process.env.XENDIT_X)
      .send({ status: "EXPIRED", id: "test", paid_amount: 50000 });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Update to Expired Success"
    );
  });
  test("testing update status order if error", async () => {
    const response = await request(app)
      .post("/orders/paid")
      .set("x-callback-token", process.env.XENDIT_X)
      .send({ status: "EXPIRED", id: "not-found", paid_amount: 70000 });
    expect(response.status).toBe(500);
  });
  test("testing raja ongkir destination if success", async () => {
    const destination = {
      rajaongkir: {
        query: [],
        status: {
          code: 200,
          description: "OK",
        },
        results: [
          {
            city_id: "1",
            province_id: "21",
            province: "Nanggroe Aceh Darussalam (NAD)",
            type: "Kabupaten",
            city_name: "Aceh Barat",
            postal_code: "23681",
          },
        ],
      },
    };
    axios.get.mockResolvedValue({ data: destination });
    const response = await request(app)
      .get("/orders/city")
      .set("access_token", access_token);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("rajaongkir");
  });
  test("testing raja ongkir destination if error", async () => {
    const destination = {
      rajaongkir: {
        query: [],
        status: {
          code: 200,
          description: "OK",
        },
        results: [
          {
            city_id: "1",
            province_id: "21",
            province: "Nanggroe Aceh Darussalam (NAD)",
            type: "Kabupaten",
            city_name: "Aceh Barat",
            postal_code: "23681",
          },
        ],
      },
    };
    axios.get.mockRejectedValue({ data: destination });
    const response = await request(app)
      .get("/orders/city")
      .set("access_token", access_token);
    expect(response.status).toBe(500);
  });
  test("testing raja ongkir cost if success", async () => {
    const cost = {
      rajaongkir: {
        query: {
          origin: "22",
          destination: "114",
          weight: 2000,
          courier: "jne",
        },
        status: {
          code: 200,
          description: "OK",
        },
        origin_details: {
          city_id: "22",
          province_id: "9",
          province: "Jawa Barat",
          type: "Kabupaten",
          city_name: "Bandung",
          postal_code: "40311",
        },
        destination_details: {
          city_id: "114",
          province_id: "1",
          province: "Bali",
          type: "Kota",
          city_name: "Denpasar",
          postal_code: "80227",
        },
        results: [
          {
            code: "jne",
            name: "Jalur Nugraha Ekakurir (JNE)",
            costs: [
              {
                service: "OKE",
                description: "Ongkos Kirim Ekonomis",
                cost: [
                  {
                    value: 44000,
                    etd: "2-3",
                    note: "",
                  },
                ],
              },
              {
                service: "REG",
                description: "Layanan Reguler",
                cost: [
                  {
                    value: 48000,
                    etd: "1-2",
                    note: "",
                  },
                ],
              },
              {
                service: "YES",
                description: "Yakin Esok Sampai",
                cost: [
                  {
                    value: 70000,
                    etd: "1-1",
                    note: "",
                  },
                ],
              },
            ],
          },
        ],
      },
    };
    axios.post.mockResolvedValue({ data: cost });
    const response = await request(app)
      .post("/orders/cost")
      .set("access_token", access_token)
      .send({
        origin: 1,
        destination: 2,
        weight: 2000,
        courier: "jne",
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("rajaongkir");
  });
  test("testing raja ongkir cost if success", async () => {
    const cost = {
      rajaongkir: {
        query: {
          origin: "22",
          destination: "114",
          weight: 2000,
          courier: "jne",
        },
        status: {
          code: 200,
          description: "OK",
        },
        origin_details: {
          city_id: "22",
          province_id: "9",
          province: "Jawa Barat",
          type: "Kabupaten",
          city_name: "Bandung",
          postal_code: "40311",
        },
        destination_details: {
          city_id: "114",
          province_id: "1",
          province: "Bali",
          type: "Kota",
          city_name: "Denpasar",
          postal_code: "80227",
        },
        results: [
          {
            code: "jne",
            name: "Jalur Nugraha Ekakurir (JNE)",
            costs: [
              {
                service: "OKE",
                description: "Ongkos Kirim Ekonomis",
                cost: [
                  {
                    value: 44000,
                    etd: "2-3",
                    note: "",
                  },
                ],
              },
              {
                service: "REG",
                description: "Layanan Reguler",
                cost: [
                  {
                    value: 48000,
                    etd: "1-2",
                    note: "",
                  },
                ],
              },
              {
                service: "YES",
                description: "Yakin Esok Sampai",
                cost: [
                  {
                    value: 70000,
                    etd: "1-1",
                    note: "",
                  },
                ],
              },
            ],
          },
        ],
      },
    };
    axios.post.mockRejectedValue({ data: cost });
    const response = await request(app)
      .post("/orders/cost")
      .set("access_token", access_token)
      .send({
        origin: 1,
        destination: 2,
        weight: 2000,
        courier: "jne",
      });
    expect(response.status).toBe(500);
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
  await queryInterface.bulkDelete("Users", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});
