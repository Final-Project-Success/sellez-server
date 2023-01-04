const Controller = require("../controllers/controller");

const router = require("express").Router();

router
  .post("/", Controller.postOrderProduct)
  .get("/", Controller.getOrderProduct)
  .get("/:id", Controller.getDetailOrderProduct)
  .delete("/:id", Controller.deleteOrderProduct);

module.exports = router;
