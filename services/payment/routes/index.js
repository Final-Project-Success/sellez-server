const express = require("express");
const app = express();
let payment = require("./payment");

app.use("/payments", payment);

module.exports = app;
