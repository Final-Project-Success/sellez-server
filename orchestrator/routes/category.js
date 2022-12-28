const Controller = require("../controllers/category");

const router = require("express").Router();

router
  .post("/", Controller.addCategory)
  .get("/", Controller.readAllCategories)
  .get("/:id", Controller.readDetailCategory)
  .put("/:id", Controller.editCategory)
  .delete("/:id", Controller.deleteCategory);

module.exports = router;
