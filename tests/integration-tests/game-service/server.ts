import { PlayerService } from "./player-service";
import * as express from "express";
import * as http from "http";
import { Server } from "socket.io";
import { GameCron } from "./game-cron";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const gameCron = new GameCron(io);
const playerService = new PlayerService(gameCron);
app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("signin", (data) => {
    playerService.onSignIn(socket, data);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});

gameCron.startCron();
