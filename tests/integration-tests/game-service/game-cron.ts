import { CronJob } from "cron";
import { IGameServiceMessage } from "../../../src/models/game-messages";

export class GameCron {
  constructor(io) {
    this.io = io;
  }

  gameName = "sedie";

  durations = {
    wholeRound: 39,
    placingBets: 30,
    lockingBet: 5,
    shakeThePlateDuration: 2,
  };

  gameData = {
    remainingTime: 0,
    totalBets: {},
    roundId: 0,
    delayStartTime: 0,
    disabled: false,
    gameConfigs: {},
    realPlayers: {},
    ingame: {},
    admins: {},
  };

  io;

  startCron() {
    const job = new CronJob(
      "* * * * * *",
      () => this.proceed().catch(console.log),
      () => {
        job.start();
      }
    );

    job.start();
  }

  async proceed() {
    if (this.gameData.remainingTime === this.durations.wholeRound) {
      this.publishStartGame();
    }

    if (!this.gameData.disabled) {
      this.gameData.remainingTime--;
    }

    if (this.isStartingTime(this.gameData.remainingTime, this.durations)) {
      this.resetForNewRound();
    }

    if (this.gameData.remainingTime === this.durations.placingBets) {
      this.publishStartPlacingBetStatus();
    }

    if (this.gameData.remainingTime === this.durations.lockingBet - 1) {
      this.publishEndPlacingBetStatus();
    }

    if (this.gameData.remainingTime < 0) {
      this.gameData.remainingTime = this.durations.wholeRound;
      this.publishEndRound();
      this.gameData.roundId += 1;
    }

    //this.publishRemainingTime();
  }

  isStartingTime(remainingTime, durations) {
    return remainingTime === durations.placingBets;
  }

  publishDisableGameStatus() {
    // const disabledMessage = this.gameData.umMessages ?? {};
    // const payload = { um: true, um_message: disabledMessage };
    // this.publishToAllUsers(payload);
    // this.publishToAllAdmins(payload);
  }

  publishStartGame() {
    this.emitToAllClients({
      snr: true,
      roundId: this.gameData.roundId,
      remainingTime: this.gameData.remainingTime,
    });
  }
  publishStartPlacingBetStatus() {
    this.emitToAllClients({
      spb: true,
    });
  }

  publishEndPlacingBetStatus() {
    this.emitToAllClients({
      epb: true,
    });
  }

  publishRemainingTime() {
    this.emitToAllClients({
      remainingTime: this.gameData.remainingTime,
    });
  }

  publishEndRound() {
    this.emitToAllClients({
      finish: true,
    });
  }

  resetForNewRound() {
    this.gameData.ingame = {};
    this.gameData.totalBets = {};
  }

  emitToAllClients(data) {
    console.log(data);
    this.io.sockets.emit(this.gameName, data);
  }
}
