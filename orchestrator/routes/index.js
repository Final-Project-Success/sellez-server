const router = require("express").Router();
const categoryRouter = require("./category");
const orderRouter = require("./order");
const productRouter = require("./product");
const userRouter = require("./user");
const orderProductRouter = require("./order-products");

router
  .use("/", userRouter)
  .use("/products", productRouter)
  .use("/categories", categoryRouter)
  .use("/order-products", orderProductRouter)
  .use("/orders", orderRouter);

module.exports = router;
