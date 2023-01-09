const MessageController = require("../controllers/messageController")

const router = require("express").Router()

router.post("/msg", MessageController.addMessage)
router.get("/msg", MessageController.getMessage)

module.exports = router