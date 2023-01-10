const Controller = require("../controllers/users");
const { authentication } = require("../middlewares/authentication");
// const authentication = require("../middlewares/authentication");
const cloudinary = require("cloudinary").v2
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require('multer');
const router = require("express").Router();

cloudinary.config({
  cloud_name: "dqschoc1m",
  api_key: "632682329878361",
  api_secret: "ye8aEWOo7ilmDtWr7k0wUVmkEX8",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "JKT48",
  },
});

const upload = multer({ storage: storage });

router
  .post("/login", Controller.login)
  .post("/register", upload.single("profilePict"),Controller.register)
  .post("/login-oauth", Controller.oauthLogin)
  .get("/otp", authentication, Controller.getOTP);

module.exports = router;
