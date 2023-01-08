// const express = require("express");
// const app = express();
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");
// const port = 3001;
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log(`User Connected: ${socket.id}`);

//   socket.on("send_message", (data) => {
//     io.emit("receive_message", data);
//   });

//   socket.on("disconnect", () => {
//     console.log(`User Disconnected: ${socket.id}`);
//   });
// });

// server.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

// io.on("connection", (socket) => {
//   console.log(`User Connected: ${socket.id}`);

//   socket.on("send_message", (data) => {
//     io.emit("receive_message", data);
//   });

//   socket.on("disconnect", () => {
//     console.log(`User Disconnected: ${socket.id}`);
//   });
// });

// server.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });
// const { Server } = require("socket.io");
// const port = 3001;

require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const client = process.env.URI;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const server = http.createServer(app);
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/mongo-adapter");
const { MongoClient } = require("mongodb");

const DB = "chat";
const COLLECTION = "socket.io-adapter-events";

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

const mongoClient = new MongoClient(client, {
  useUnifiedTopology: true,
});

const main = async () => {
  await mongoClient.connect();
  try {
    await mongoClient.db(DB).createCollection(COLLECTION, {
      capped: true,
      size: 1e6,
    });
    // const database = mongoClient.db('chat')
    // const messages = database.collection('messages')
    // const query = {message: 'hello'}
    // const message = await messages.findOne(query)
    // console.log(message);
  } catch (e) {
    // collection already exists
    await client.close();
  }
  const mongoCollection = mongoClient.db(DB).collection(COLLECTION);

  io.adapter(createAdapter(mongoCollection));
  io.listen(3001);
};

main();
