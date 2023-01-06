const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
class OtpController {
  static async createOTP() {
    try {
      let em = "gitasellez@gmail.com";
      let pa = "sellezpassword";
      let pwApp = "gdursqiwutbdcbyt";

      let otp = otpGenerator.generate(10, {});

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // use SSL
        auth: {
          user: em,
          pass: pwApp,
        },
      });

      var mailOptions = {
        from: em,
        to: "alfianwilfredohoris@gmail.com",
        subject: "Activation code",
        html: `<h1>Welcome </h1>
          <p>You</p>
          <img src="cid:Nyan">`,
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
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = OtpController;
