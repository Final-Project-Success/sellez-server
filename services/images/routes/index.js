const Controller = require("../controllers/controller");

const router = require("express").Router();

router
  .post("/", Controller.postImage)
  .get("/", Controller.getImage)
  .get("/:ProductId", Controller.getDetailImage)
  .delete("/:ProductId", Controller.deleteImage);

module.exports = router;
