const Controller = require("../controllers/orders");

const router = require("express").Router();
const { authentication } = require("../middlewares/authentication");

router
  .get("/", authentication, Controller.readAllOrders)
  .post("/", authentication, Controller.addOrders)
  .post("/paid", Controller.updateStatusOrder)
  .use(authentication)
  .get("/city", Controller.destination)
  .get("/cost", Controller.cost)
  .get("/:id", Controller.readOneOrder);

module.exports = router;
