import { Server } from "socket.io";
import { SedieGameService } from "./sedie-game-service";
import { DragonTigerGameService } from "./dragon-tiger-game-service";

export class PlayerService {
  players = [
    {
      sessionName: "player-ss-sedie",
      user: {
        red: 10000,
        avatarId: 1,
      },
      userStakeLevel: { minBet: 10, maxBet: 15 },
      room: SedieGameService.gameName,
    },
    {
      sessionName: "player-ss-dragon-tiger",
      user: {
        red: 2000,
        avatarId: 2,
      },
      userStakeLevel: { minBet: 1, maxBet: 15 },
      room: DragonTigerGameService.gameName,
    },
  ];

  constructor(
    private io: Server,
    private sedieGameService: SedieGameService,
    private dragonTigerGameService: DragonTigerGameService
  ) {}

  onSignIn(socket, message: any) {
    const player = this.players.find(
      (player) => player.sessionName == message.ss
    );

    if (player && player.room === SedieGameService.gameName) {
      console.log(message);
      socket.join(player.room);
      this.sedieGameService.sendPlayerInformation(player, socket);
      this.sedieGameService.sendInGame(socket);
    }

    if (player && player.room === DragonTigerGameService.gameName) {
      console.log(message);
      socket.join(player.room);
      this.dragonTigerGameService.sendPlayerInformation(player, socket);
      this.dragonTigerGameService.sendInGame(socket);
    }
  }
}
