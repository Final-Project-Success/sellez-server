const Controller = require("../controllers/orders");

const router = require("express").Router();
const { authentication } = require("../middlewares/authentication");

router
  .post("/", authentication, Controller.addOrders)
  .get("/", authentication, Controller.readAllOrders)
  .get("/city", authentication, Controller.destination)
  .get("/cost", authentication, Controller.cost)
  .post("/paid", Controller.updateStatusOrder)
  .get("/:id", authentication, Controller.readOneOrder);

module.exports = router;
