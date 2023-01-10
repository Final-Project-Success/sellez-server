const { comparePassword } = require("../helpers/bcrypt");
const { jwtSign } = require("../helpers/jwt");
const { User, Otp } = require("../models");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");

class Controller {
  static async register(req, res, next) {
    try {
      const { username, email, password, address, role, phoneNumber } =
        req.body;
      const newUser = await User.create({
        username,
        email,
        password,
        address,
        role,
        phoneNumber,
      });

      let createdOTP = otpGenerator.generate(10, {});
      console.log(createdOTP);

      const registerOTP = await Otp.create({
        UserId: newUser.id,
        otp: createdOTP,
      });

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
          <p>Udah ga sabar kan buat belanja belanja di SellEz? Berikut Activation code kamu : ${createdOTP}</p>`,
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
        msg: "Register Success! Open Your Email to get Your Activation Code  ",
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

      res.status(200).json({
        access_token,
        username: findUser.username,
        email: findUser.email,
        role: findUser.role,
        msg: "Login Success!",
      });
    } catch (err) {
      next(err);
    }
  }
  static async oauthLogin(req, res, next) {
    try {
      const { email, username } = req.body;

      const [user, created] = await User.findOrCreate({
        where: { email },
        defaults: {
          username,
          email,
          password: "oauth",
          address: "oauth",
          role: "customer",
          phoneNumber: "oauth",
          verified: true,
        },
        hooks: false,
      });

      const access_token = jwtSign({ id: user ? user.id : created.id });

      res.status(200).json({
        access_token,
        role: user ? user.role : created.role,
        email: user ? user.email : created.email,
        username: user ? user.username : created.username,
        msg: "Login Success",
      });
    } catch (err) {
      next(err);
    }
  }
  static async verifyAccount(req, res, next) {
    try {
      let { otp } = req.body;
      if (!otp) {
        res.status(401).json({ message: "Please fill your activation code" });
      }
      let findedUser = await Otp.findOne({ where: { UserId: req.User.id } });
      if (otp !== findedUser.otp) {
        res.status(401).json({ message: "Wrong Activation Code" });
      } else {
        let updatedUser = await User.update(
          { verified: true },
          { where: { id: req.User.id } }
        );
        res.status(200).json({ message: "Your Account Has Been Verified" });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = Controller;
