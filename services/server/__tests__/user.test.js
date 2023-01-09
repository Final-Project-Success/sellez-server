const app = require("../app");
const request = require("supertest");
const { sequelize } = require("../models");
const { hashPassword } = require("../helpers/bcrypt");
const { queryInterface } = sequelize;

beforeAll(() => {
  queryInterface.bulkInsert(
    "Users",
    [
      {
        username: "user1",
        email: "user1@gmail.com",
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
});

const dataUser = {
  username: "user2",
  email: "user2@gmail.com",
  password: hashPassword("qwerty"),
  address: "Hacktiv8",
  profilePict:
    "https://www.smartfren.com/app/uploads/2021/11/featured-image-37.png",
  role: "customer",
  phoneNumber: "081312391839",
};

describe("test table Users", () => {
  test("testing Register if success", async () => {
    const response = await request(app).post("/register").send(dataUser);
    expect(response.status).toBe(201);
  });
  test("testing Register if email already used", async () => {
    const dataUser1 = {
      ...dataUser,
      email: "user2@gmail.com",
    };
    const response = await request(app).post("/register").send(dataUser1);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Email must be unique");
  });
  test("testing Register if email is null", async () => {
    const dataUser1 = {
      ...dataUser,
      email: null,
    };
    const response = await request(app).post("/register").send(dataUser1);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Email is required");
  });
  test("testing Register if email is empty", async () => {
    const dataUser1 = {
      ...dataUser,
      email: "",
    };
    const response = await request(app).post("/register").send(dataUser1);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Email is required");
  });
  test("testing Register if ins't email format", async () => {
    const dataUser1 = {
      ...dataUser,
      email: "user",
    };
    const response = await request(app).post("/register").send(dataUser1);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Format must be email");
  });
  test("testing Register if username is null", async () => {
    const dataUser1 = {
      ...dataUser,
      username: null,
    };
    const response = await request(app).post("/register").send(dataUser1);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Username is required");
  });
  test("testing Register if username is empty", async () => {
    const dataUser1 = {
      ...dataUser,
      username: "",
    };
    const response = await request(app).post("/register").send(dataUser1);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Username is required");
  });
  test("testing Register if password is null", async () => {
    const dataUser1 = {
      ...dataUser,
      password: null,
    };
    const response = await request(app).post("/register").send(dataUser1);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Password is required");
  });
  test("testing Register if password is empty", async () => {
    const dataUser1 = {
      ...dataUser,
      password: "",
    };
    const response = await request(app).post("/register").send(dataUser1);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Password is required");
  });
  test("testing Register if address is null", async () => {
    const dataUser1 = {
      ...dataUser,
      address: null,
    };
    const response = await request(app).post("/register").send(dataUser1);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Address is required");
  });
  test("testing Register if address is empty", async () => {
    const dataUser1 = {
      ...dataUser,
      address: "",
    };
    const response = await request(app).post("/register").send(dataUser1);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Address is required");
  });
  test("testing Register if Profile Pict is null", async () => {
    const dataUser1 = {
      ...dataUser,
      profilePict: null,
    };
    const response = await request(app).post("/register").send(dataUser1);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Profile pict is required");
  });
  test("testing Register if Profile Pict is empty", async () => {
    const dataUser1 = {
      ...dataUser,
      profilePict: "",
    };
    const response = await request(app).post("/register").send(dataUser1);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Profile pict is required");
  });
  test("testing Register if phoneNumber is null", async () => {
    const dataUser1 = {
      ...dataUser,
      phoneNumber: null,
    };
    const response = await request(app).post("/register").send(dataUser1);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Phone number is required");
  });
  test("testing Register if phoneNumber is empty", async () => {
    const dataUser1 = {
      ...dataUser,
      phoneNumber: "",
    };
    const response = await request(app).post("/register").send(dataUser1);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("msg", "Phone number is required");
  });
  test("testing if login success", async () => {
    const response = await request(app).post("/login").send(dataUser);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token", expect.any(String));
  });
  test("testing login if email doesn't match", async () => {
    const data = {
      ...dataUser,
      email: "user1000@gmail.com",
    };
    const response = await request(app).post("/login").send(data);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "msg",
      "Error invalid email or password"
    );
  });
  test("testing login if email doesn't match", async () => {
    const data = {
      ...dataUser,
      email: "",
    };
    const response = await request(app).post("/login").send(data);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "msg",
      "Error invalid email or password"
    );
  });
  test("testing login if password doesn't match", async () => {
    const data = {
      ...dataUser,
      password: "",
    };
    const response = await request(app).post("/login").send(data);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "msg",
      "Error invalid email or password"
    );
  });
  test("testing login if password doesn't match", async () => {
    const data = {
      ...dataUser,
      password: "user1000@gmail.com",
    };
    const response = await request(app).post("/login").send(data);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "msg",
      "Error invalid email or password"
    );
  });
  //   test("testing find User by Id", async () => {
  //     const response = await request(app).get("/1");
  //     expect(response.status).toBe(200);
  //     expect(response.body).toBeInstanceOf(Object);
  //   });
  //   test("testing find User by Id not found", async () => {
  //     const response = await request(app).get("/1000");
  //     expect(response.status).toBe(404);
  //     expect(response.body).toHaveProperty("msg", "User Not Found");
  //   });
  // test("testing User isn't logged in and wants to hit endpoint products", async () => {
  //   const data = {
  //     ...dataUser,
  //     username: "user1000@gmail.com",
  //     password: "user1000@gmail.com",
  //   };
  //   const response = await request(app).get("/products/1").send(data);
  //   expect(response.status).toBe(404);
  //   expect(response.body).toHaveProperty("msg", "User Not Found");
  // });
});

afterAll(async () => {
  queryInterface.bulkDelete("Users", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});
