const Controller = require("../controllers/orders");

const router = require("express").Router();
const {
  authentication,
  authenticationAdmin,
} = require("../middlewares/authentication");

router
  .get("/", authentication, Controller.readAllOrders)
  .post("/", authentication, Controller.addOrders)
  .get("/admin", authenticationAdmin, Controller.readAllOrdersAdmin)
  .post("/paid", Controller.updateStatusOrder)
  .get("/city", authentication, Controller.destination)
  .get("/cost", authentication, Controller.cost)
  .get("/:id", authentication, Controller.readOneOrder);

module.exports = router;
