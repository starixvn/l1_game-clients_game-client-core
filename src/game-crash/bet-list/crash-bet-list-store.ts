import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";

import { NumberUtils } from "../../exports";
import { BetStore } from "../../game/bets/bet-store";
import { RoundStore, RoundTimeStore } from "../../game/rounds";
import { MainPlayerStore } from "../../players/main-player-store";
import { CrashCashOutStore } from "../cash-out/crash-cash-out-store";
import { GameCrashServiceMessage } from "../game-crash-messages";

export interface ICrashBetList {
    [playerId: string]: any;
}

interface IPlayer {
    playerId: string;
    name: string;
    amount: number;
    cashOut?: GameCrashServiceMessage.CashOutReceive;
    halfCashOut?: GameCrashServiceMessage.CashOutReceive;
    rate?: number;
    time?: string | number | Date;
}

@injectable()
export class CrashBetListStore {
    private _betList: GameCrashServiceMessage.CrashOtherPlayerList = { players: [] };

    constructor(
        @inject(RoundStore) protected readonly roundStore: RoundStore,
        @inject(MainPlayerStore) private readonly mainPlayerStore: MainPlayerStore,
        @inject(CrashCashOutStore) private readonly crashCashOutStore: CrashCashOutStore,
        @inject(RoundTimeStore) private readonly roundTimeStore: RoundTimeStore,
        @inject(BetStore) private readonly betStore: BetStore
    ) {
        makeAutoObservable(this);
    }

    get betList(): GameCrashServiceMessage.CrashOtherPlayerList {
        return this._betList;
    }

    get roundTime(): number {
        return this.roundTimeStore.roundTime;
    }

    get mainPlayer(): GameCrashServiceMessage.CrashOtherPlayer {
        const bet = this.betStore.lastReceivedBet?.value || this.roundStore.ownBets.amount;
        const cashOut =
            this.crashCashOutStore.cashOut || (this.roundStore.ownBets.cashOut as unknown as GameCrashServiceMessage.CashOutReceive);
        const halfCashOut =
            this.crashCashOutStore.halfCashOut ||
            (this.roundStore.ownBets.halfCashOut as unknown as GameCrashServiceMessage.CashOutReceive);

        return {
            playerId: null,
            name: this.mainPlayerStore.name,
            amount: bet !== -1 ? bet : null,
            cashOut,
            halfCashOut,
        };
    }

    get noOfPlayerBet(): number {
        const countMainPlayer = this.mainPlayer.amount ? 1 : 0;
        return this._betList.players.length + countMainPlayer;
    }

    get noOfPlayerCashOut() {
        const players = [];
        this._betList.players.forEach((player: IPlayer) => {
            (player["cashOut"] || player["halfCashOut"]) && players.push(player);
        });

        const countMainPlayer = this.mainPlayer.cashOut || this.mainPlayer.halfCashOut ? 1 : 0;
        return players.length + countMainPlayer;
    }

    addBetList(data: ICrashBetList, isReceivedBetListData = false) {
        let players = [];
        Object.keys(data).forEach((key) => {
            data[key].amount = NumberUtils.getValueByCurrency(data[key].amount, this.mainPlayerStore.rate, data[key].rate);

            if (data[key].halfCashOut) {
                data[key].halfCashOut.win = NumberUtils.getValueByCurrency(data[key].win, this.mainPlayerStore.rate, data.rate);
            }

            if (data[key].cashOut) {
                data[key].cashOut.win = NumberUtils.getValueByCurrency(data[key].win, this.mainPlayerStore.rate, data.rate);
            }

            players.push(data[key]);
        });

        let playerList = [];

        if (isReceivedBetListData) {
            const newPlayers = players.concat(...this._betList.players);

            const cashOutPlayers = newPlayers.filter((player) => player.cashOut || player.halfCashOut);
            cashOutPlayers.sort((player1: IPlayer, player2: IPlayer) => {
                const time1 = new Date(player1.time).getTime();
                const time2 = new Date(player2.time).getTime();
                return time2 - time1;
            });

            const betPlayers = newPlayers.filter((player) => !player.halfCashOut && !player.cashOut);
            betPlayers.sort((player1, player2) => player2.amount - player1.amount);

            playerList = cashOutPlayers.concat(betPlayers);
        } else {
            playerList = players.concat(...this._betList.players).sort((player1, player2) => player2.amount - player1.amount);
        }

        this._betList = {
            players: playerList,
        };
    }

    resetOtherPlayerList() {
        this._betList = { players: [] };
    }

    resetMainPlayer() {
        this.betStore.lastReceivedBet = { value: -1 };
        this.crashCashOutStore.cashOut = null;
        this.crashCashOutStore.halfCashOut = null;
    }

    updateBetListCashOut(otherPlayer: GameCrashServiceMessage.CrashOtherPlayer) {
        const existedPlayer = this._betList.players.find((player) => player.playerId === otherPlayer.playerId);
        if (!existedPlayer) {
            return;
        }

        if (otherPlayer.halfCashOut) {
            existedPlayer["halfCashOut"] = otherPlayer.halfCashOut;
        }

        if (otherPlayer.cashOut) {
            existedPlayer["cashOut"] = otherPlayer.cashOut;
        }

        const newPlayers = this._betList.players.filter((player) => player.playerId !== otherPlayer.playerId);
        this._betList = {
            players: [existedPlayer, ...newPlayers],
        };
    }
}
