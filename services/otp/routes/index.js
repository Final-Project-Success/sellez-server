const express = require("express");
const OtpController = require("../controllers/otpController");
const app = express();

app.post("/otp", OtpController.createOTP);

module.exports = app;
