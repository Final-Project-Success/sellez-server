const Controller = require("../controllers/orders");

const router = require("express").Router();
const { authentication } = require("../middlewares/authentication");

router
  .post("/paid", Controller.updateStatusOrder)
  .get("/", authentication, Controller.readAllOrders)
  .post("/", Controller.addOrders)
  .get("/city", Controller.destination)
  .get("/cost", Controller.cost)
  .get("/:id", Controller.readOneOrder);

module.exports = router;
