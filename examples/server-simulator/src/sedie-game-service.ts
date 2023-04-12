import { CronJob } from "cron";
import { Socket } from "socket.io-client";
import { Server } from "socket.io";

export class SedieGameService {
    constructor(io: Server) {
        this.io = io;
    }

    static gameName = "sedie";

    durations = {
        wholeRound: 39,
        placingBets: 30,
        lockingBet: 5,
        shakeThePlateDuration: 2
    };

    gameData = {
        remainingTime: 0,
        totalBets: {},
        roundId: 0,
        delayStartTime: 0,
        disabled: false,
        gameConfigs: {
            groupId: "61765beed2b6510001f18bd6",
            minBet: 1,
            maxBet: 3000,
            maxBetPerChoices: {
                even: 3000,
                odd: 3000,
                red3: 2000,
                white3: 2000,
                red4: 500,
                white4: 500,
                red2: 2000
            },
            chips: ["1", "5", "10", "50", "100", "200", "500", "1000", "2000"],
            enableFreeBet: false,
            stakeLevels: [],
            odds: {
                even: 1.96,
                odd: 1.96,
                red3: 3.75,
                white3: 3.75,
                red4: 14.4,
                white4: 14.4,
                red2: 2.4
            },
            originalOdds: {
                even: 1.96,
                odd: 1.96,
                red3: 3.75,
                white3: 3.75,
                red4: 14.4,
                white4: 14.4,
                red2: 2.4
            },
            boostedChoices: []
        },
        realPlayers: {},
        ingame: {},
        admins: {}
    };

    io: Server;

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

    sendPlayerInformation(player: any, socket: Socket) {
        socket.emit(SedieGameService.gameName, player.user);
        socket.emit(SedieGameService.gameName, player.userStakeLevel);
    }

    sendInGame(socket: Socket) {
        const gameData = this.gameData;
        socket.emit("signedIn");
        socket.emit("message", { toGame: SedieGameService.gameName });
        socket.emit(SedieGameService.gameName, {
            roundId: gameData.roundId,
            remainingTime: gameData.remainingTime,
            gameConfigs: gameData.gameConfigs
        });

        console.log(`${SedieGameService.gameName} send ingame`);
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
            remainingTime: this.gameData.remainingTime
        });
    }
    publishStartPlacingBetStatus() {
        this.emitToAllClients({
            spb: true
        });
    }

    publishEndPlacingBetStatus() {
        this.emitToAllClients({
            epb: true
        });
    }

    publishRemainingTime() {
        this.emitToAllClients({
            remainingTime: this.gameData.remainingTime
        });
    }

    publishEndRound() {
        this.emitToAllClients({
            finish: true
        });
    }

    resetForNewRound() {
        this.gameData.ingame = {};
        this.gameData.totalBets = {};
    }

    emitToAllClients(data) {
        console.log({
            game: SedieGameService.gameName,
            ...data
        });
        this.io.to(SedieGameService.gameName).emit(SedieGameService.gameName, data);
    }
}
