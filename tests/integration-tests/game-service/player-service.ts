import { Socket } from "socket.io-client";
import { GameCron } from "./game-cron";

export class PlayerService {
  sessionName = "ricky-ss";

  constructor(private gameCron: GameCron) {}

  onSignIn(socket: any, message: any) {
    if (message.ss == this.sessionName) {
      console.log(message);
      this.sendPlayerInformation(socket);
      this.sendInGame(socket);
    }
  }

  private sendPlayerInformation(socket: Socket) {
    socket.emit(this.gameCron.gameName, {
      user: {
        red: 10000,
        avatarId: 1,
      },
      userStakeLevel: { minBet: 10, maxBet: 15 },
    });
  }

  private sendInGame(socket: Socket) {
    const gameData = this.gameCron.gameData;
    socket.emit("signedIn");
    socket.emit("message", { toGame: this.gameCron.gameName });
    socket.emit(this.gameCron.gameName, {
      roundId: gameData.roundId,
      remainingTime: gameData.remainingTime,
    });

    console.log("send ingame");
  }
}
