const Controller = require("../controllers/controller");

const router = require("express").Router();

router
  .post("/login", Controller.login)
  .post("/register", Controller.register)
  .get("/:id", Controller.findUser);

module.exports = router;
