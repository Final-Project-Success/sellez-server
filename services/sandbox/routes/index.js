const MessageController = require("../controllers/messageController")

const router = require("express").Router()

router.post("/msg", MessageController.addMessage)
router.get("/msg", MessageController.getMessage)
router.post("/client", MessageController.addClientMessage)
router.get("/client", MessageController.getClientMessage)


module.exports = router