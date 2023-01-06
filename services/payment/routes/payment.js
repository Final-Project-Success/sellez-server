const express = require("express");
const app = express();
let PaymentController = require("../controllers/paymentController");
const authentication = require("../middlewares/authentication");

app.get("/invoice", authentication, PaymentController.createInvoice);
app.get("/payout", authentication, PaymentController.createPayout);

module.exports = app;
