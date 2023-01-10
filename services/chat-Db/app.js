require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 10000
const http = require("http");
const mongoose = require("mongoose")
const cors = require("cors");
const router = require("./routes")
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router)
const server = http.createServer(app);
const { Server } = require("socket.io");
const Message = require("./models/messages");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

const main = async () => {
  await mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true })
  console.log(`Db conection`);
  io.listen(3001);
};
main();

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  socket.on("send_message", (messages) => {
    console.log(messages, "msg")
    Message.create(messages)
      .then(data => {
        console.log(data)
      })
      .catch(err => {
        console.log(err, "error create messages")
      })
      .finally(() => {
        io.emit("receive_message", messages)
      })
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

app.listen(`${port}`, ()=> console.log('Server up and running...'));


