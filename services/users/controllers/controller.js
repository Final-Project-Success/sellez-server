const { comparePassword } = require("../helpers/bcrypt");
const { jwtSign } = require("../helpers/jwt");
const { User } = require("../models");
class Controller {
  static async register(req, res, next) {
    try {
      const {
        username,
        email,
        password,
        address,
        profilePict,
        role,
        phoneNumber,
      } = req.body;
      const newUser = await User.create({
        username,
        email,
        password,
        address,
        profilePict,
        role,
        phoneNumber,
      });

      res.status(201).json({
        id: newUser.id,
        email: newUser.email,
        msg: "Register Success!",
      });
    } catch (err) {
      next(err);
    }
  }
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw {
          name: "Error email or password",
        };
      }

      const findUser = await User.findOne({
        where: { email },
      });

      if (!findUser || !comparePassword(password, findUser.password)) {
        throw {
          name: "Error email or password",
        };
      }

      const access_token = jwtSign({ id: findUser.id });

      res.status(200).json({ access_token, msg: "Login Success!" });
    } catch (err) {
      next(err);
    }
  }
  static async findUser(req, res, next) {
    try {
      const { id } = req.params;
      const findUser = await User.findByPk(id);

      if (!findUser) {
        throw {
          name: "User Not Found",
        };
      }

      res.status(200).json(findUser);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
