const Controller = require("../controllers/order");
const { authentication } = require("../middlewares/authentication");

const router = require("express").Router();

router
  .use(authentication)
  .post("/", Controller.addOrder)
  .get("/", Controller.readAllOrders)
  .get("/:id", Controller.readDetailOrder)
  .patch("/:id", Controller.editOrder);

module.exports = router;
