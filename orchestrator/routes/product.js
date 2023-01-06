const router = require("express").Router();

const Controller = require("../controllers/product");

router
  .get("/", Controller.readAllProducts)
  .post("/", Controller.addProduct)
  .get("/:id", Controller.readDetailProduct)
  .put("/:id", Controller.editProduct)
  .delete("/:id", Controller.deleteProduct);

module.exports = router;
