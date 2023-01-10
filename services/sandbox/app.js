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
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// var socketById = io.sockets.sockets.get(id);
const main = async () => {
  await mongoose.connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`Db connection`);
  io.listen(3001);
};
main();

io.on("connection", async (socket) => {
  console.log(`User Connected: ${socket.id}`);
  let users = await User.findAll();
  // console.log(users, `<<<< `);
  // ==== chat admin-cust =======
  // socket.on("conversation", (payload) => {
  //   console.log(payload, `<<++++++`);
  //   users = users.filter(
  //     (el) => el.id !== payload.id && el.role !== payload.role
  //   );
  //   socket.emit("listUser", users);
  //   console.log(users, `users`);
  // });
  socket.on("join_room", (msg) => {
    socket.join(msg);
    console.log(`User with ID: ${socket.id} joined room: ${msg}`);
  });

  socket.on("send_msgprivate", ({ room, user, time, message }) => {
    console.log(room, user, time, message , `<<<<<< INI DATA`);
    MessagePrivate.create({privatemsg: {
      room,
      message :{
        user,
        message,
        time
      }
    }})
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err, "error create messages");
      })
      .finally(() => {
        socket.to(room).emit("receive_msgprivate",message);
      });
  });
  // socket.on("send_msgprivate", ({ senderId, text, receiverId }) => {
  //   MessagePrivate.create({senderId, text, receiverId})
  //     .then((data) => {
  //       console.log(data);
  //     })
  //     .catch((err) => {
  //       console.log(err, "error create messages");
  //     })
  //     .finally(() => {
  //       io.emit("receive_msgprivate", { senderId, text, receiverId });
  //     });
  // });
  // batas
  socket.on("send_message", (messages) => {
    // console.log(messages, "msg")
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
