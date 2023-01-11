const router = require("express").Router();
const categoryRouter = require("./categories");
const orderRouter = require("./orders");
const productRouter = require("./products");
const userRouter = require("./users");
const orderProductRouter = require("./order-products");
const {
  authenticationAdmin,
  authentication,
} = require("../middlewares/authentication");

router
  .use("/", userRouter)
  .use("/products", productRouter)
  .use("/categories", categoryRouter)
  .use("/orders", orderRouter)
  .use(authentication)
  .use("/order-products", orderProductRouter);

module.exports = router;
