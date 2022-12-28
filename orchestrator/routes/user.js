const Controller = require("../controllers/user");

const router = require("express").Router();

router
  .post("/register", Controller.register)
  .post("/login", Controller.login)
  .put("/:id", Controller.editProduct);

module.exports = router;
