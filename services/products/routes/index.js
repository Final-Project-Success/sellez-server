const Controller = require("../controllers/controller");

const router = require("express").Router();

router
  .post("/", Controller.postProduct)
  .get("/", Controller.getProduct)
  .get("/:id", Controller.getDetailProduct)
  .put("/:id", Controller.updateProduct)
  .delete("/:id", Controller.deleteProduct);

module.exports = router;
