const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const port = 3001;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID : ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    console.log(data, `<<<< data send message`);
    socket.to(data.room).emit("receive_message", data);
    // socket.broadcast.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
