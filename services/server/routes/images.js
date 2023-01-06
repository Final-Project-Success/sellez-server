const Controller = require("../controllers/images");

const router = require("express").Router();

router
  .get("/", Controller.getImage)
  .post("/:ProductId", Controller.postImage)
  .get("/:ProductId", Controller.getDetailImage)
  .delete("/:ProductId", Controller.deleteImage);

module.exports = router;
