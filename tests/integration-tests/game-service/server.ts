import { PlayerService } from "./player-service";
import * as express from "express";
import * as http from "http";
import { Server } from "socket.io";
import { SedieGameService } from "./sedie-game-service";
import { DragonTigerGameService } from "./dragon-tiger-game-service";
import * as cors from "cors";
import userRouter from "./user-service-router";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const sedieGameService = new SedieGameService(io);
const dragonTigerGameService = new DragonTigerGameService(io);
const playerService = new PlayerService(
  io,
  sedieGameService,
  dragonTigerGameService
);
const port = 3000;

app.use(
  cors({
    origin: "*",
  })
);

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("signin", (data) => {
    playerService.onSignIn(socket, data);
  });
});

app.use("/user", userRouter);
app.use(express.static("public"));

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});

sedieGameService.startCron();
dragonTigerGameService.startCron();
