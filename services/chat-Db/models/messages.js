const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema(
  {
    message: String,
    user: String,
    time: String
  },
);
const Message = mongoose.model("Message", messagesSchema);

module.exports = Message;
