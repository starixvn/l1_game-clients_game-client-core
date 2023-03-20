import * as express from "express";
import * as http from "http";
import { Server } from "socket.io";
import { GameCron } from "./game-cron";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const gameName = "sedie";
const gameCron = new GameCron(io);

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

io.on("connection", (socket) => {
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

gameCron.startCron();
