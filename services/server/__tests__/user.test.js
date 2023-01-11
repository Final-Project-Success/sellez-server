const app = require("../app");
const request = require("supertest");
const { sequelize, User, Otp } = require("../models");
const { hashPassword } = require("../helpers/bcrypt");
const { jwtSign } = require("../helpers/jwt");
const { queryInterface } = sequelize;

let access_token;
beforeAll(async () => {
  await queryInterface.bulkInsert(
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
    ],
    {}
  );
  access_token = jwtSign({ id: 1 });
});
beforeEach(() => {
  jest.restoreAllMocks();
});

const dataUser = {
  username: "user2",
  email: "user2@gmail.com",
  password: hashPassword("qwerty"),
  address: "Hacktiv8",
  role: "customer",
  phoneNumber: "081312391839",
  verified: false,
};

describe("test table Users", () => {
  test("testing Register if success", async () => {
    const response = await request(app).post("/register").send(dataUser);
    // expect(response.status).toBe(201);
    // console.log(response, "dari user test");
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
  test("testing login with oauth", async () => {
    const data = {
      username: "oauth",
      email: "oauth@gmail.com",
      password: "oauth",
      address: "oauth",
      profilePict: "oauth",
      role: "customer",
      phoneNumber: "oauth",
    };
    const response = await request(app).post("/login-oauth").send(data);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token", expect.any(String));
    expect(response.body).toHaveProperty("msg", "Login Success");
  });
  test("testing login with oauth if fail", async () => {
    jest.spyOn(User, "findOne").mockRejectedValueOnce({
      username: "oauth",
      email: "oauth@gmail.com",
      password: "oauth",
      address: "oauth",
      profilePict: "oauth",
      role: "customer",
      phoneNumber: "oauth",
    });
    const response = await request(app).post("/login-oauth").send({
      username: "oauth",
      email: "oauth@gmail.com",
      password: "oauth",
      address: "oauth",
      profilePict: "oauth",
      role: "customer",
      phoneNumber: "oauth",
    });
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("msg", "Internal Server Error");
  });
  test("testing get Users if success", async () => {
    const response = await request(app).get("/user");
    expect(response.status).toBe(200);
    response.body.forEach((el) => {
      expect(el).toHaveProperty("email", expect.any(String));
      expect(el).toHaveProperty("address", expect.any(String));
      expect(el).toHaveProperty("id", expect.any(Number));
      expect(el).toHaveProperty("phoneNumber", expect.any(String));
      expect(el).toHaveProperty("role", expect.any(String));
      expect(el).toHaveProperty("username", expect.any(String));
    });
  });
  test("testing get Users if fail", async () => {
    jest
      .spyOn(User, "findAll")
      .mockRejectedValue(() => Promise.reject({ name: "something wrong" }));
    const response = await request(app).get("/user");
    expect(response.status).toBe(500);
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
  test("testing verifyAccount if OTP is empty", async () => {
    const otp = "";
    const response = await request(app)
      .get("/verification")
      .set("access_token", access_token);
    // console.log(response.body);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Please fill your activation code"
    );
  });
  test("testing findedUser if fail", async () => {
    jest.spyOn(Otp, "findOne").mockResolvedValueOnce({ otp: "testing" });
    const response = await request(app)
      .get("/verification")
      .set("access_token", access_token)
      .send({ otp: "1111" });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Wrong Activation Code");
  });
  test("testing findedUser if fail", async () => {
    jest.spyOn(Otp, "findOne").mockResolvedValueOnce({ otp: "testing" });
    const response = await request(app)
      .get("/verification")
      .set("access_token", access_token)
      .send({ otp: "testing" });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Your Account Has Been Verified"
    );
  });
  test("testing findedUser if fail", async () => {
    jest.spyOn(Otp, "findOne").mockRejectedValueOnce({ otp: "testing" });
    const response = await request(app)
      .get("/verification")
      .set("access_token", access_token)
      .send({ otp: "testing" });
    expect(response.status).toBe(500);
  });
});

afterAll(async () => {
  await queryInterface.bulkDelete("Users", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});
