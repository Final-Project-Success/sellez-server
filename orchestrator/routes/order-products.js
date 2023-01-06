const Controller = require("../controllers/order-products");
const { authentication } = require("../middlewares/authentication");

const router = require("express").Router();

router
  .use(authentication)
  .post("/", Controller.postOrderProduct)
  .get("/", Controller.getOrderProduct)
  .get("/:id", Controller.getDetailOrderProduct)
  .delete("/:id", Controller.deleteOrderProduct);

module.exports = router;
