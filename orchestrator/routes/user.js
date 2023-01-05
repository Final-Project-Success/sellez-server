const Controller = require("../controllers/user");
const { authentication } = require("../middlewares/authentication");

const router = require("express").Router();

router.post("/login", Controller.login).post("/register", Controller.register);

module.exports = router;
