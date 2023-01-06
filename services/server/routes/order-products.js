const Controller = require("../controllers/order-products");

const router = require("express").Router();

router
  .get("/", Controller.getOrderProduct)
  .get("/:id", Controller.getDetailOrderProduct);

module.exports = router;
