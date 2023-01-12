const io = require("socket.io-client");
const mongoose = require("mongoose");
const request = require("supertest");
require("dotenv").config();
const { io: server } = require("../app");
jest.setTimeout(50000);

let socket;
describe("Suite of unit tests", function () {
  server.attach(3001);
  /* Connecting to the database before each test. */
  beforeEach((done) => {
    //    mongoose.connect(process.env.URI);
    jest.mock("mongoose", () => {
      return jest.fn((uri) => {
        return {
          messages: {
            message: "test",
            user: "udin",
            time: "15.15",
          },
          privatemsg: {
            room: "room-admin@gmail.com",
            message: {
              message: "test",
              user: "udin",
              time: "15.15",
            },
          },
        };
      });
    });
    // Setup
    socket = io("http://localhost:3001");
    console.log(socket, `<< socket`);
    socket.on("connect", function () {
      console.log("worked...");
      done();
    });
    socket.on("disconnect", function () {
      console.log("disconnected...");
    });
  });
  afterEach((done) => {
    //  mongoose.connection.close();

    // Cleanup
    if (socket.connected) {
      console.log("disconnecting...");
      socket.disconnect();
    } else {
      // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
      console.log("no connection to break...");
    }
    done();
  });

  afterAll(function (done) {
    socket.disconnect();
    server.close();
    done();
  });

  describe("Chat live", function () {
    test("should work", (done) => {
      socket.emit("send_message", {
        user: "Udin",
        message: "Hello world",
        time: "15.15",
      });

      socket.on("send_message", (messages) => {
        try {
          expect(messages).toHaveProperty("name");
          expect(messages).toHaveProperty("message");
          expect(messages).toHaveProperty("time");
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });

  //   describe("Chat private msg", function () {
  //     test("should work", (done) => {
  //       socket.emit("send_message", {
  //         room: "room-udin",
  //         user: "Udin",
  //         message: "Hello world",
  //         time: "15.15",
  //       });

  //       socket.on("send_msgprivate", (messages) => {
  //         try {
  //           expect(messages).toHaveProperty(Object);
  //           // expect(messages).toHaveProperty("message");
  //           // expect(messages).toHaveProperty("time");
  //           done();
  //         } catch (err) {
  //           done(err);
  //         }
  //       });
  //     });
  //   });
});

/* Closing database connection after each test. */
// afterEach(async () => {
// //   await mongoose.connection.close();
//   // Cleanup
//   if (socket.connected) {
//     console.log("disconnecting...");
//     socket.disconnect();
//   } else {
//     // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
//     console.log("no connection to break...");
//   }
//   done();
// });

// afterAll(function (done) {
//   socket.disconnect();
//   server.close();
//   done();
// });

// describe("Chat live", function () {
//   test.only("should work", (done) => {
//     socket.emit("send_message", {
//       user: "Udin",
//       message: "Hello world",
//       time: "15.15",
//     });

//     socket.on("send_message", (messages) => {
//       try {
//         expect(messages).toHaveProperty("name");
//         expect(messages).toHaveProperty("message");
//         expect(messages).toHaveProperty("time");
//         done();
//       } catch (err) {
//         done(err);
//       }
//     });
//   });
// });

// describe("Chat private msg", function () {
//   test("should work", (done) => {
//     socket.emit("send_message", {
//       room: "room-udin",
//       user: "Udin",
//       message: "Hello world",
//       time: "15.15",
//     });

//     socket.on("send_msgprivate", (messages) => {
//       try {
//         expect(messages).toHaveProperty(Object);
//         // expect(messages).toHaveProperty("message");
//         // expect(messages).toHaveProperty("time");
//         done();
//       } catch (err) {
//         done(err);
//       }
//     });
//   });
// });
// });
