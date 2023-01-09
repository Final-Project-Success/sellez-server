const Message = require("../models/messages")
class MessageController {
    static async addMessage(req,res){
        try {
            const message = await Message.save()
            res.status(201).json(message)
        } catch (error) {
            res.status(400).json({message: error.message})
        }
    }
    static async getMessage(req,res,next){
        try {
            const msg = await Message.find()
            res.json(msg)
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }
}

module.exports = MessageController