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

      let otp = otpGenerator.generate(10, {});

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // use SSL
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      var mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Activation code",
        html: `<h1>Hai </h1>
          <p>Udah ga sabar kan buat belanja belanja di SellEz? Berikut Activation code kamu : ${otp}</p>`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      res.status(201).json({
        id: newUser.id,
        email: newUser.email,
        msg: "Register Success! Open Your Email to Activate Your Account",
      });
    } catch (err) {
      next(err);
    }
  }
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      console.log(req.body);
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
  static async oauthLogin(req, res, next) {
    try {
      const { email, username, profilePict } = req.body;
      const [user, created] = await User.findOrCreate({
        where: { email },
        defaults: {
          username,
          email,
          password: "oauth",
          address: "oauth",
          profilePict,
          role: "customer",
          phoneNumber: "oauth",
        },
        hooks: false,
      });

      const access_token = jwtSign({ id: user ? user.id : created.id });

      res.status(200).json({ access_token, msg: "Login Success" });
    } catch (err) {
      next(err);
    }
  }
  static async verifyAccount(req, res, next) {}
}

module.exports = Controller;
