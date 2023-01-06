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
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    response.body.forEach((el) => {
      expect(el).toHaveProperty("name", expect.any(String));
    });
  });
  test("testing table read Categorues if error", async () => {
    jest
      .spyOn(Category, "findAll")
      .mockImplementationOnce(() =>
        Promise.reject({ name: "something wrong" })
      );
    const response = await request(app).get("/");
    expect(response.status).toBe(500);
  });
  test("testing read Categories by Id", async () => {
    const response = await request(app).get("/1");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("name", expect.any(String));
  });
  test("testing read Categories if data by id not found", async () => {
    const response = await request(app).get(`/1000`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("msg", "Category Not Found");
  });
  test("testing create Categories if success", async () => {
    const response = await request(app).post("/").send(createCategories);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id", response.body.id);
    expect(response.body).toHaveProperty("name", createCategories.name);
  });
  test("testing create Categories if name is null", async () => {
    const noname = {
      name: null,
    };
    const response = await request(app).post("/").send(noname);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Name is required");
  });
  test("testing create Categories if name is empty", async () => {
    const noname = {
      name: "",
    };
    const response = await request(app).post("/").send(noname);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Name is required");
  });
  test("testing delete Categories if success", async () => {
    const response = await request(app).delete("/3");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "msg",
      "Category with name Men Shoes has been deleted"
    );
  });
  test("testing delete Categories if data by id not found", async () => {
    const response = await request(app).delete("/1000");
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("msg", "Category Not Found");
  });
  test("testing edit Categories by Id if success", async () => {
    const editName = {
      name: "Casual Shoes",
    };
    const response = await request(app).patch("/1").send(editName.name);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("msg", "Category has been updated");
  });
  test("testing edit Catagories by Id if Id not found", async () => {
    const editName = {
      name: "Casual Shoes",
    };
    const response = await request(app).patch("/1000").send(editName.name);
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
