const app = require("../app");
const request = require("supertest");
const { sequelize } = require("../models");
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
        role: "customer",
        phoneNumber: "081312391839",
      },
    ],
    {}
  );
  access_token = jwtSign({ id: 100 });
});

describe("test authentication", () => {
  test("testing authentication", async () => {
    const response = await request(app)
      .delete("/categories/3")
      .set("access_token", access_token);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("msg", "Please Login First");
  });
  // test("testing authentication if not admin", async () => {
  //   const response = await request(app)
  //     .delete("/categories/3")
  //     .set("access_token", access_token);
  //   expect(response.status).toBe(401);
  //   expect(response.body).toHaveProperty("msg", "Please Login First");
  // });
});

afterAll(async () => {
  queryInterface.bulkDelete("Users", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});
