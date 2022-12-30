const CategoryController = require("../controllers/CategoryController");

const router = require("express").Router();

router.get("/categories", CategoryController.getCategory);
router.post("/categories", CategoryController.postCategory);
router.patch("/categories/:id", CategoryController.updateCategory);
router.delete("/categories/:id", CategoryController.deleteCategory);

module.exports = router;
