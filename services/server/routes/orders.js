const Controller = require("../controllers/orders");

const router = require("express").Router();

router
  .post("/", Controller.addOrders)
  .get("/", Controller.readAllOrders)
  .get("/city", Controller.destination)
  .get("/cost", Controller.cost)
  .post("/paid", Controller.updateStatusOrder)
  .get("/:id", Controller.readOneOrder);

module.exports = router;
