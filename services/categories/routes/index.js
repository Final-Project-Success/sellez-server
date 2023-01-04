const Controller = require("../controllers/controller");

const router = require("express").Router();

router
  .post("/", Controller.postCategory)
  .get("/", Controller.getCategory)
  .get("/:id", Controller.getDetailCategory)
  .patch("/:id", Controller.updateCategory)
  .delete("/:id", Controller.deleteCategory);

module.exports = router;
