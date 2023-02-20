const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const GameCron = require("./game-cron");
const gameName = "sedie";
app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("event-name", (data) => {
    console.log(data);
  });

  setInterval(() => {
    socket.emit(gameName, {
      user: {
        name: "Test user",
        red: 2321,
        avatarId: 1,
      },
      userStakeLevel: { minBet: 10, maxBet: 15 },
    });
  }, 5000);
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});

const gameCron = new GameCron(io);
gameCron.startCron(io);
