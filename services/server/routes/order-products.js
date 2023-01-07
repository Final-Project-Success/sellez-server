const Controller = require("../controllers/order-products");
const authorizationOrder = require("../middlewares/authorization");

const router = require("express").Router();

router
  .post("/", authorizationOrder, Controller.postOrderProduct)
  .get("/", Controller.getOrderProduct)
  .get("/:id", Controller.getDetailOrderProduct);

module.exports = router;
