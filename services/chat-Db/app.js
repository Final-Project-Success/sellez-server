require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 10000;
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./routes");
const { User } = require("../server/models");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
const server = http.createServer(app);
const { Server } = require("socket.io");
const { Message, MessagePrivate } = require("./models/messages");

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

const main = async () => {
  await mongoose.connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`Db conection`);
  io.listen(3001);
};
main();

io.on("connection", async (socket) => {
  console.log(`User Connected: ${socket.id}`);
  let users = await User.findAll();
  // ==== chat admin-cust =======
  socket.on("conversation", (payload) => {
    // console.log(payload, `<<++++++`);
    users = users.filter((el) => el.role !== payload.role);
    socket.emit("listUser", users);
    // console.log(users, `users`);
  });
  socket.on("join_room", async (room) => {
    // console.log(room, `<<<room `);
    socket.join(room);
    const getChat = await MessagePrivate.find({
      "privatemsg.room": room,
    });
    io.in(room).emit(
      "loadChat",
      getChat.map((el) => el.privatemsg.message)
    );
    console.log(`User with ID: ${socket.id} joined room: ${room}`);
  });

  socket.on("send_msgprivate", ({ room, user, time, message }) => {
    // console.log(room, user, time, message, `<<<<<< INI DATA`);
    MessagePrivate.create({
      privatemsg: {
        room,
        message: {
          user,
          message,
          time,
        },
      },
    })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err, "error create messages");
      })
      .finally(() => {
        socket
          .to(room)
          .emit("receive_msgprivate", { room, user, time, message });
      });
  });
  socket.on("send_message", async (messages) => {
    console.log(messages, "msg");
    // const getChat = Message.find()
    // console.log(getChat, `<<<<<< getchat`);
    Message.create(messages)
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err, "error create messages");
      })
      .finally(() => {
        io.emit("receive_message", messages);
      });
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

app.listen(`${port}`, () => console.log("Server up and running..."));

module.exports = { server, io };
