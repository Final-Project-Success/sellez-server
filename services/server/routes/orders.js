const Controller = require("../controllers/orders");

const router = require("express").Router();

router
  .post("/", Controller.addOrders)
  .get("/", Controller.readAllOrders)
  .get("/city", Controller.destination)
  .get("/cost", Controller.cost)
  .get("/:id", Controller.readOneOrder)
  .put("/:id", Controller.checkOutOrder)
  .patch("/:id", Controller.updateStatusOrder);

module.exports = router;
