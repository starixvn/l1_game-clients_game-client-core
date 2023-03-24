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
const port = 3000;
// app.get("/", (req, res) => {
//   res.send("<h1>Hello world</h1>");
// });

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("signin", (data) => {
    playerService.onSignIn(socket, data);
  });
});

app.use(express.static("public"));

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});

gameCron.startCron();
