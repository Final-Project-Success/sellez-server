const mongoose = require("mongoose");
const io = require("socket.io")(3001);
const mongoDB = "mongodb+srv://UserDB:UserDB@cluster0.nyxrtgh.mongodb.net/test";
io.on("connection", (socket) => {
  console.log("a user connected");
  
});
