const Controller = require("../controllers/orders");

const router = require("express").Router();
const { authentication } = require("../middlewares/authentication");

router
  .get("/", Controller.readAllOrders)
  .get("/admin", Controller.readAllOrdersAdmin)
  .post("/", authentication, Controller.addOrders)
  .post("/paid", Controller.updateStatusOrder)
  .get("/city", authentication, Controller.destination)
  .get("/cost", authentication, Controller.cost)
  .get("/:id", authentication, Controller.readOneOrder);

module.exports = router;
