const cron = require("cron");

class GameCron {
  constructor(io) {
    this.io = io;
  }

  gameName = "sedie";
  roundId = 0;

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
    console.log("cron started");
    const job = new cron.CronJob(
      "* * * * * *",
      () => this.proceed().catch(console.log),
      (e) => {
        console.log(e);
        job.start();
      }
    );

    job.start();
  }

  async proceed() {
    if (this.gameData.remainingTime === this.durations.wholeRound) {
      console.log("Check game status");
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
      this.gameData.roundId += 1;
      console.log("Settle round");
      this.publishStartGame();
    }

    console.log(
      `Round: ${this.gameData.roundId}, Remaining time: ${this.gameData.remainingTime}`
    );
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
    // remainingTime: this.gameData.remainingTime,
    // snr: true,
    this.io.sockets.emit("snr", true);
    console.log("snr");
  }
  publishStartPlacingBetStatus() {
    //spb: true,
    this.io.sockets.emit("spb", true);
    console.log("spb");
  }

  publishEndPlacingBetStatus() {
    this.io.sockets.emit("epb", true);
    console.log("epb");
    //epb: true,
  }

  resetForNewRound() {
    this.gameData.ingame = {};
    this.gameData.totalBets = {};
  }

  emitToAllClients(data) {
    this.io.sockets.emit(this.gameName, data);
  }
}



module.exports = GameCron;
