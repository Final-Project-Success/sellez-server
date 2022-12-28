const router = require("express").Router();

const Controller = require("../controllers/product");

router
  .post("/", Controller.addProduct)
  .get("/", Controller.readAllProducts)
  .get("/:id", Controller.readDetailProduct)
  .put("/:id", Controller.editProduct)
  .delete("/:id", Controller.deleteProduct);

module.exports = router;
