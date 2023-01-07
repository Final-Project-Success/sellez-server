const app = require("../app");
const request = require("supertest");
const { sequelize, Category } = require("../models");
const { queryInterface } = sequelize;

beforeAll(() => {
  queryInterface.bulkInsert(
    "Categories",
    [
      {
        name: "Running Shoes",
      },
      {
        name: "Woman Shoes",
      },
    ],
    {}
  );
});

const createCategories = {
  name: "Men Shoes",
};

describe("test table Categories", () => {
  test("testing read Categories if success", async () => {
    const response = await request(app).get("/categories");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    response.body.forEach((el) => {
      expect(el).toHaveProperty("name", expect.any(String));
    });
  });
  test("testing table read Categories if error", async () => {
    jest
      .spyOn(Category, "findAll")
      .mockImplementationOnce(() =>
        Promise.reject({ name: "something wrong" })
      );
    const response = await request(app).get("/categories");
    expect(response.status).toBe(500);
  });
  test("testing read Categories by Id", async () => {
    const response = await request(app).get("/categories/1");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("name", expect.any(String));
  });
  test("testing read Categories if data by id not found", async () => {
    const response = await request(app).get(`/categories/1000`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("msg", "Category Not Found");
  });
  test("testing create Categories if success", async () => {
    const response = await request(app)
      .post("/categories")
      .send(createCategories);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id", response.body.id);
    expect(response.body).toHaveProperty("name", createCategories.name);
  });
  test("testing create Categories if name is null", async () => {
    const noname = {
      name: null,
    };
    const response = await request(app).post("/categories").send(noname);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Name is required");
  });
  test("testing create Categories if name is empty", async () => {
    const noname = {
      name: "",
    };
    const response = await request(app).post("/categories").send(noname);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Name is required");
  });
  test("testing delete Categories if success", async () => {
    const response = await request(app).delete("/categories/3");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Category with name Men Shoes has been deleted"
    );
  });
  test("testing delete Categories if data by id not found", async () => {
    const response = await request(app).delete("/categories/1000");
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("msg", "Category Not Found");
  });
  test("testing edit Categories by Id if success", async () => {
    const editName = {
      name: "Casual Shoes",
    };
    const response = await request(app)
      .patch("/categories/1")
      .send(editName.name);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Category has been updated"
    );
  });
  test("testing edit Catagories by Id if Id not found", async () => {
    const editName = {
      name: "Casual Shoes",
    };
    const response = await request(app)
      .patch("/categories/1000")
      .send(editName.name);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("msg", "Category Not Found");
  });
});

afterAll(async () => {
  queryInterface.bulkDelete("Categories", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});
