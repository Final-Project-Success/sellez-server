const Controller = require("../controllers/users");
const authentication = require("../middlewares/authentication");
const router = require("express").Router();

router
  .post("/login", Controller.login)
  .post("/register", Controller.register)
  .post("/login-oauth", Controller.oauthLogin)
  .get("/user", Controller.getUsers)
  .get("/verification", authentication, Controller.verificationEmail);


module.exports = router;
