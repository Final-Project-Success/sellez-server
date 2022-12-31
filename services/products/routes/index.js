const ProductController = require("../controllers/productContoller");

const router = require("express").Router();

router.get("/products", ProductController.getProduct);
router.post("/products", ProductController.postProduct);
router.put("/products/:id", ProductController.updateProduct);
router.delete("/products/:id", ProductController.deleteProduct);

module.exports = router;
