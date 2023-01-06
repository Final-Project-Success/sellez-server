const Controller = require("../controllers/order");

const router = require("express").Router();

router
  .post("/", Controller.addOrder)
  .get("/", Controller.readAllOrders)
  .get("/:id", Controller.readDetailOrder)
  .patch("/:id", Controller.editOrder);

module.exports = router;
