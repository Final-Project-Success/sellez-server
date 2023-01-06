const Controller = require("../controllers/users");

const router = require("express").Router();

router
  .post("/login", Controller.login)
  .post("/register", Controller.register)
  .get("/:id", Controller.findUser);

module.exports = router;
