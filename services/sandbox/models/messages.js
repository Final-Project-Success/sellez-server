const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema({
  message: String,
  user: String,
  time: String,
});
const Message = mongoose.model("Message", messagesSchema);

const msgPrivateSchema = new mongoose.Schema({
  privatemsg: {
    room: String,
    message: {
      user: String,
      message: String,
      time: String,
    },
  },
});
const MessagePrivate = mongoose.model("MessagePrivate", msgPrivateSchema);

module.exports = { Message, MessagePrivate };
