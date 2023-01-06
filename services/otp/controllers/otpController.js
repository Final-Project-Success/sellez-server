const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
class OtpController {
  static async createOTP(req, res) {
    try {
      let em = "gitasellez@gmail.com"; //masukin ke dotenv
      let pa = "sellezpassword"; //masukin ke dotenv
      let pwApp = "gdursqiwutbdcbyt";

      let otp = otpGenerator.generate(10, {});

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: em,
          pass: pwApp,
        },
      });

      var mailOptions = {
        from: em,
        to: "alfianwilfredohoris@gmail.com", //nanti ini diganti jadi email usernya
        subject: "Activation code",
        html: `
        <h1>Hai, udah sabar buat belanja di SellEz kan?</h1>
          <p>Ini Activation Code kamu ya : ${otp}</p>
          <p>Kalo kamu ada pertanyaan, Please Hubungi aku dengan membalas email ini ya 😊</p>
          `,
        attachments: [
          //   {
          //     filename: "nyan cat dilelang.jpg",
          //     path: path.join(__dirname, "../assets/nyan cat dilelang.jpg"),
          //     cid: "Nyan", //my mistake was putting "cid:logo@cid" here!
          //   },
        ],
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      res.json({ message: "Success send Activation Code" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
module.exports = OtpController;
