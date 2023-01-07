const app = require("../app");
const request = require("supertest");
const { sequelize, Product } = require("../models");
const { jwtSign } = require("../helpers/jwt");
const { hashPassword } = require("../helpers/bcrypt");
const { queryInterface } = sequelize;

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

const createProduct = {
  name: "Air Jordan 1 Royal Blue",
  price: 7000000,
  description:
    "The Air Jordan 1 Retro High OG 'Dark Marina Blue' dresses the iconic silhouette in classic two-tone color blocking. The all-leather upper features a black base with contrasting dark blue overlays along the forefoot, heel, collar and eyestay. A matching blue Swoosh is accompanied by a Jordan Wings logo stamped in black on the lateral collar flap. Atop the nylon tongue, a woven Nike Air tag nods to the shoe's retro cushioning technology: an Air-sole unit encapsulated in polyurethane nestled in the heel of the rubber cupsole.",
  imgUrl:
    "http://cdn.shopify.com/s/files/1/0516/0760/1336/products/3product-555088-404-Xms-2022-03-08T0958490700_1200x1200.jpg?v=1646708344",
  stock: 10,
  CategoryId: 1,
  color: "red",
  imgUrl1:
    "http://cdn.shopify.com/s/files/1/0516/0760/1336/products/3product-555088-404-Xms-2022-03-08T0958490700_1200x1200.jpg?v=1646708344",
  imgUrl2:
    "http://cdn.shopify.com/s/files/1/0516/0760/1336/products/3product-555088-404-Xms-2022-03-08T0958490700_1200x1200.jpg?v=1646708344",
  imgUrl3:
    "http://cdn.shopify.com/s/files/1/0516/0760/1336/products/3product-555088-404-Xms-2022-03-08T0958490700_1200x1200.jpg?v=1646708344",
  imgUrl4:
    "http://cdn.shopify.com/s/files/1/0516/0760/1336/products/3product-555088-404-Xms-2022-03-08T0958490700_1200x1200.jpg?v=1646708344",
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
      .send(createProduct)
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
  test("testing create Product if name is null", async () => {
    const data = {
      ...createProduct,
      name: null,
    };
    const response = await request(app)
      .post("/products")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Name is required");
  });
  test("testing create Product if name is empty", async () => {
    const data = {
      ...createProduct,
      name: "",
    };
    const response = await request(app)
      .post("/products")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Name is required");
  });
  test("testing create Product if Price is null", async () => {
    const data = {
      ...createProduct,
      price: null,
    };
    const response = await request(app)
      .post("/products")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Price is required");
  });
  test("testing create Product if Price is empty", async () => {
    const data = {
      ...createProduct,
      price: "",
    };
    const response = await request(app)
      .post("/products")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Price is required");
  });
  test("testing create Product if description is null", async () => {
    const data = {
      ...createProduct,
      description: null,
    };
    const response = await request(app)
      .post("/products")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Description is required");
  });
  test("testing create Product if description is empty", async () => {
    const data = {
      ...createProduct,
      description: "",
    };
    const response = await request(app)
      .post("/products")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Description is required");
  });
  test("testing create imgUrl if description is null", async () => {
    const data = {
      ...createProduct,
      imgUrl: null,
    };
    const response = await request(app)
      .post("/products")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Image Url is required");
  });
  test("testing create Product if img Url is empty", async () => {
    const data = {
      ...createProduct,
      imgUrl: "",
    };
    const response = await request(app)
      .post("/products")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Image Url is required");
  });
  test("testing create stock if stock is null", async () => {
    const data = {
      ...createProduct,
      stock: null,
    };
    const response = await request(app)
      .post("/products")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Stock is required");
  });
  test("testing create Product if stock is empty", async () => {
    const data = {
      ...createProduct,
      stock: "",
    };
    const response = await request(app)
      .post("/products")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Stock is required");
  });
  test("testing create Product if stock is 0", async () => {
    const data = {
      ...createProduct,
      stock: 0,
    };
    const response = await request(app)
      .post("/products")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Stock min is 1");
  });
  test("testing create stock if CategoryId is null", async () => {
    const data = {
      ...createProduct,
      CategoryId: null,
    };
    const response = await request(app)
      .post("/products")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Category id is required");
  });
  test("testing create Product if CategoryId is empty", async () => {
    const data = {
      ...createProduct,
      CategoryId: "",
    };
    const response = await request(app)
      .post("/products")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Category id is required");
  });
  test("testing create stock if color is null", async () => {
    const data = {
      ...createProduct,
      color: null,
    };
    const response = await request(app)
      .post("/products")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Color is required");
  });
  test("testing create Product if Color is empty", async () => {
    const data = {
      ...createProduct,
      color: "",
    };
    const response = await request(app)
      .post("/products")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Color is required");
  });
  test("testing create stock if Image Url 1 is null", async () => {
    const data = {
      ...createProduct,
      imgUrl1: null,
    };
    const response = await request(app)
      .post("/products")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Image url is required");
  });
  test("testing create Product if Image Url 1 is empty", async () => {
    const data = {
      ...createProduct,
      imgUrl1: "",
    };
    const response = await request(app)
      .post("/products")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Image url is required");
  });
  test("testing create stock if Image Url 2 is null", async () => {
    const data = {
      ...createProduct,
      imgUrl2: null,
    };
    const response = await request(app)
      .post("/products")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Image url is required");
  });
  test("testing create Product if Image Url 2 is empty", async () => {
    const data = {
      ...createProduct,
      imgUrl2: "",
    };
    const response = await request(app)
      .post("/products")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Image url is required");
  });
  test("testing create stock if Image Url 3 is null", async () => {
    const data = {
      ...createProduct,
      imgUrl3: null,
    };
    const response = await request(app)
      .post("/products")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Image url is required");
  });
  test("testing create Product if Image Url 3 is empty", async () => {
    const data = {
      ...createProduct,
      imgUrl3: "",
    };
    const response = await request(app)
      .post("/products")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Image url is required");
  });
  test("testing create stock if Image Url 4 is null", async () => {
    const data = {
      ...createProduct,
      imgUrl4: null,
    };
    const response = await request(app)
      .post("/products")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Image url is required");
  });
  test("testing create Product if Image Url 4 is empty", async () => {
    const data = {
      ...createProduct,
      imgUrl4: "",
    };
    const response = await request(app)
      .post("/products")
      .send(data)
      .set("access_token", access_token);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Image url is required");
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
