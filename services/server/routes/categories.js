const Controller = require("../controllers/categories");
const { authentication } = require("../middlewares/authentication");

const router = require("express").Router();

router
  .post("/", Controller.postCategory)
  .get("/", Controller.getCategory)
  .get("/:id", Controller.getDetailCategory)
  .use(authentication)
  .patch("/:id", Controller.updateCategory)
  .delete("/:id", Controller.deleteCategory);

module.exports = router;
