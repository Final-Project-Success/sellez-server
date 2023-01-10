const app = require("../app");
const request = require("supertest");
const { sequelize, Product } = require("../models");
const { jwtSign } = require("../helpers/jwt");
const { hashPassword } = require("../helpers/bcrypt");
const redis = require("../config/connectRedis");
const cloudinary = require("cloudinary").v2;
const { queryInterface } = sequelize;
jest.setTimeout(30000);

let access_token;
beforeAll(async () => {
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
    "Users",
    [
      {
        username: "user10",
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
  await queryInterface.bulkInsert("Images", [
    {
      ProductId: 1,
      imgUrl:
        "http://cdn.shopify.com/s/files/1/0516/0760/1336/products/3product-555088-404-Xms-2022-03-08T0958490700_1200x1200.jpg?v=1646708344",
    },
    {
      ProductId: 1,
      imgUrl:
        "http://cdn.shopify.com/s/files/1/0516/0760/1336/products/3product-555088-404-Xms-2022-03-08T0958490700_1200x1200.jpg?v=1646708344",
    },
    {
      ProductId: 1,
      imgUrl:
        "http://cdn.shopify.com/s/files/1/0516/0760/1336/products/3product-555088-404-Xms-2022-03-08T0958490700_1200x1200.jpg?v=1646708344",
    },
    {
      ProductId: 1,
      imgUrl:
        "http://cdn.shopify.com/s/files/1/0516/0760/1336/products/3product-555088-404-Xms-2022-03-08T0958490700_1200x1200.jpg?v=1646708344",
    },
  ]);
});
beforeEach(() => {
  jest.restoreAllMocks();
  redis.del("sellez-products");
  jest.mock("multer", () => {
    const multer = () => {
      return {
        array: () => {
          return (req, res, next) => {
            req.files = [
              {
                url: "http://mock.url/a.png",
              },
            ];
            return next();
          };
        },
      };
    };
    return multer;
  });
});

const createProduct = {
  name: "Air Jordan 1 Royal Blue",
  price: 7000000,
  description:
    "The Air Jordan 1 Retro High OG 'Dark Marina Blue' dresses the iconic silhouette in classic two-tone color blocking. The all-leather upper features a black base with contrasting dark blue overlays along the forefoot, heel, collar and eyestay. A matching blue Swoosh is accompanied by a Jordan Wings logo stamped in black on the lateral collar flap. Atop the nylon tongue, a woven Nike Air tag nods to the shoe's retro cushioning technology: an Air-sole unit encapsulated in polyurethane nestled in the heel of the rubber cupsole.",
  stock: 10,
  CategoryId: 1,
  color: "red",
};
describe("test table Products", () => {
  test("testing read Product if Success", async () => {
    const response = await request(app).get("/products");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    response.body.forEach((el) => {
      expect(el).toHaveProperty("name", expect.any(String));
      expect(el).toHaveProperty("price", expect.any(Number));
      expect(el).toHaveProperty("description", expect.any(String));
      expect(el).toHaveProperty("imgUrl", expect.any(String));
      expect(el).toHaveProperty("stock", expect.any(Number));
      expect(el).toHaveProperty("CategoryId", expect.any(Number));
      expect(el).toHaveProperty("color", expect.any(String));
    });
  });
  test("testing read Product if error", async () => {
    jest
      .spyOn(Product, "findAll")
      .mockRejectedValue(() => Promise.reject({ name: "something wrong" }));
    const response = await request(app).get("/products");
    expect(response.status).toBe(500);
  });
  test("testing using chace", async () => {
    jest
      .spyOn(redis, "get")
      .mockImplementationOnce(() => Promise.resolve(JSON.stringify([])));
    const response = await request(app)
      .get("/products")
      .set("access_token", access_token);
    // console.log(response.status);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });
  test("testing read Product by Id", async () => {
    const response = await request(app).get("/products/1");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("name", expect.any(String));
    expect(response.body).toHaveProperty("price", expect.any(Number));
    expect(response.body).toHaveProperty("description", expect.any(String));
    expect(response.body).toHaveProperty("imgUrl", expect.any(String));
    expect(response.body).toHaveProperty("stock", expect.any(Number));
    expect(response.body).toHaveProperty("CategoryId", expect.any(Number));
    expect(response.body).toHaveProperty("color", expect.any(String));
  });
  test("testing read Product if data by id not found", async () => {
    const response = await request(app).get(`/products/1000`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("msg", "Product Not Found");
  });
  test("testing create Product if success", async () => {
    const response = await request(app)
      .post("/products")
      .field("name", createProduct.name)
      .field("price", createProduct.price)
      .field("description", createProduct.description)
      .field("CategoryId", createProduct.CategoryId)
      .field("color", createProduct.color)
      .field("stock", createProduct.stock)
      .attach("imgUrl", "__tests__/images/gambar1-1.png")
      // .attach("imgUrl", "__tests__/images/gambar1-2.png")
      // .attach("imgUrl", "__tests__/images/gambar1-3.png")
      // .attach("imgUrl", "__tests__/images/gambar1-4.png")
      .set("access_token", access_token);
    expect(response.status).toBe(201);
    expect(response.body.dataValues).toHaveProperty("name", expect.any(String));
    expect(response.body.dataValues).toHaveProperty(
      "price",
      expect.any(Number)
    );
    expect(response.body.dataValues).toHaveProperty(
      "description",
      expect.any(String)
    );
    expect(response.body.dataValues).toHaveProperty(
      "imgUrl",
      expect.any(String)
    );
    expect(response.body.dataValues).toHaveProperty(
      "stock",
      expect.any(Number)
    );
    expect(response.body.dataValues).toHaveProperty(
      "CategoryId",
      expect.any(Number)
    );
    expect(response.body.dataValues).toHaveProperty(
      "color",
      expect.any(String)
    );
  });
  test("testing create Product if name is empty", async () => {
    const response = await request(app)
      .post("/products")
      .field("name", "")
      .field("price", createProduct.price)
      .field("description", createProduct.description)
      .field("CategoryId", createProduct.CategoryId)
      .field("color", createProduct.color)
      .field("stock", createProduct.stock)
      .attach("imgUrl", "__tests__/images/gambar1-1.png")
      .attach("imgUrl", "__tests__/images/gambar1-2.png")
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Name is required");
  });
  test("testing create Product if Price is empty", async () => {
    const response = await request(app)
      .post("/products")
      .field("name", createProduct.name)
      .field("price", "")
      .field("description", createProduct.description)
      .field("CategoryId", createProduct.CategoryId)
      .field("color", createProduct.color)
      .field("stock", createProduct.stock)
      .attach("imgUrl", "__tests__/images/gambar1-1.png")
      .attach("imgUrl", "__tests__/images/gambar1-2.png")
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Price is required");
  });
  test("testing create Product if description is empty", async () => {
    const data = {
      ...createProduct,
      description: null,
    };
    const response = await request(app)
      .post("/products")
      .field("name", createProduct.name)
      .field("price", createProduct.price)
      .field("description", "")
      .field("CategoryId", createProduct.CategoryId)
      .field("color", createProduct.color)
      .field("stock", createProduct.stock)
      .attach("imgUrl", "__tests__/images/gambar1-1.png")
      .attach("imgUrl", "__tests__/images/gambar1-2.png")
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Description is required");
  });
  test("testing create Product if stock is empty", async () => {
    const response = await request(app)
      .post("/products")
      .field("name", createProduct.name)
      .field("price", createProduct.price)
      .field("description", createProduct.description)
      .field("CategoryId", createProduct.CategoryId)
      .field("color", createProduct.color)
      .field("stock", "")
      .attach("imgUrl", "__tests__/images/gambar1-1.png")
      .attach("imgUrl", "__tests__/images/gambar1-2.png")
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Stock is required");
  });
  test("testing create Product if stock is 0", async () => {
    const response = await request(app)
      .post("/products")
      .field("name", createProduct.name)
      .field("price", createProduct.price)
      .field("description", createProduct.description)
      .field("CategoryId", createProduct.CategoryId)
      .field("color", createProduct.color)
      .field("stock", 0)
      .attach("imgUrl", "__tests__/images/gambar1-1.png")
      .attach("imgUrl", "__tests__/images/gambar1-2.png")
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Stock min is 1");
  });
  test("testing create Product if CategoryId is empty", async () => {
    const response = await request(app)
      .post("/products")
      .field("name", createProduct.name)
      .field("price", createProduct.price)
      .field("description", createProduct.description)
      .field("CategoryId", "")
      .field("color", createProduct.color)
      .field("stock", createProduct.stock)
      .attach("imgUrl", "__tests__/images/gambar1-1.png")
      .attach("imgUrl", "__tests__/images/gambar1-2.png")
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Category id is required");
  });
  test("testing create Product if Color is empty", async () => {
    const response = await request(app)
      .post("/products")
      .field("name", createProduct.name)
      .field("price", createProduct.price)
      .field("description", createProduct.description)
      .field("CategoryId", createProduct.CategoryId)
      .field("color", "")
      .field("stock", createProduct.stock)
      .attach("imgUrl", "__tests__/images/gambar1-1.png")
      .attach("imgUrl", "__tests__/images/gambar1-2.png")
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Color is required");
  });
  test("testing delete Product if success", async () => {
    const response = await request(app)
      .delete("/products/2")
      .set("access_token", access_token);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "msg",
      "Product with name Air Jordan 1 Royal Blue has been deleted"
    );
  });
  test("testing delete Product if data by id not found", async () => {
    const response = await request(app)
      .delete("/products/1000")
      .set("access_token", access_token);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("msg", "Product Not Found");
  });
  test("testing User isn't logged in and wants to delete products", async () => {
    const response = await request(app).delete("/products/1");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("msg", "Please Login First");
  });
  test("testing edit Product by id if success", async () => {
    const editProduct = {
      name: "Air Jordan 1 Bred Toe",
      price: 8000000,
      description:
        "The Air Jordan 1 Retro High OG 'Patent Bred' treats the iconic colorway to a glossy makeover. Aside from the shoe's patent leather construction, the essential design DNA remains intact. The upper pairs basic black paneling with contrasting hits of Varsity Red on the toe box, Swoosh, heel overlay and collar flap. A woven Nike tag adorns the black nylon tongue, while a Wings logo is stamped on the lateral collar. The high-top rides on a sturdy rubber cupsole, enhanced with an Air-sole unit encapsulated in lightweight polyurethane.",
      imgUrl:
        "https://cdn.shopify.com/s/files/1/0516/0760/1336/products/Voila_1_f179f0c5-9c5e-43a6-9fe6-b5a252f55f5b_1000x.jpg?v=1642647113",
      stock: 20,
      CategoryId: 1,
      color: "red",
    };
    const response = await request(app)
      .put("/products/1")
      .send(editProduct)
      .set("access_token", access_token);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "msg",
      "Product with name Air Jordan 1 Bred Patent has been updated"
    );
  });
  test("testing edit Product by id if Id not found", async () => {
    const editProduct = {
      name: "Air Jordan 1 Bred Toe",
      price: 8000000,
      description:
        "The Air Jordan 1 Retro High OG 'Patent Bred' treats the iconic colorway to a glossy makeover. Aside from the shoe's patent leather construction, the essential design DNA remains intact. The upper pairs basic black paneling with contrasting hits of Varsity Red on the toe box, Swoosh, heel overlay and collar flap. A woven Nike tag adorns the black nylon tongue, while a Wings logo is stamped on the lateral collar. The high-top rides on a sturdy rubber cupsole, enhanced with an Air-sole unit encapsulated in lightweight polyurethane.",
      imgUrl:
        "https://cdn.shopify.com/s/files/1/0516/0760/1336/products/Voila_1_f179f0c5-9c5e-43a6-9fe6-b5a252f55f5b_1000x.jpg?v=1642647113",
      stock: 20,
      CategoryId: 1,
      color: "red",
    };
    const response = await request(app)
      .put("/products/1000")
      .send(editProduct)
      .set("access_token", access_token);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("msg", "Product Not Found");
  });
  test("testing User isn't logged in and wants to edit products", async () => {
    const editProduct = {
      name: "Air Jordan 1 Bred Toe",
      price: 8000000,
      description:
        "The Air Jordan 1 Retro High OG 'Patent Bred' treats the iconic colorway to a glossy makeover. Aside from the shoe's patent leather construction, the essential design DNA remains intact. The upper pairs basic black paneling with contrasting hits of Varsity Red on the toe box, Swoosh, heel overlay and collar flap. A woven Nike tag adorns the black nylon tongue, while a Wings logo is stamped on the lateral collar. The high-top rides on a sturdy rubber cupsole, enhanced with an Air-sole unit encapsulated in lightweight polyurethane.",
      imgUrl:
        "https://cdn.shopify.com/s/files/1/0516/0760/1336/products/Voila_1_f179f0c5-9c5e-43a6-9fe6-b5a252f55f5b_1000x.jpg?v=1642647113",
      stock: 20,
      CategoryId: 1,
      color: "red",
    };
    const response = await request(app).put("/products/1").send(editProduct);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("msg", "Please Login First");
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
  await queryInterface.bulkDelete("Users", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});
