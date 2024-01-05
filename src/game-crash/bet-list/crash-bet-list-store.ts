import { inject, injectable } from "inversify";
import { makeAutoObservable, reaction } from "mobx";

import { NumberUtils } from "../../exports";
import { BetStore, ILastReceivedBet } from "../../game/bets/bet-store";
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
    private _mainPlayer: GameCrashServiceMessage.CrashOtherPlayer = null;
    private _isNeedEmptyBetAmount = false;

    constructor(
        @inject(RoundStore) protected readonly roundStore: RoundStore,
        @inject(MainPlayerStore) private readonly mainPlayerStore: MainPlayerStore,
        @inject(CrashCashOutStore) private readonly crashCashOutStore: CrashCashOutStore,
        @inject(RoundTimeStore) private readonly roundTimeStore: RoundTimeStore,
        @inject(BetStore) private readonly betStore: BetStore
    ) {
        makeAutoObservable(this);
        reaction(() => this.roundTimeStore.isPlacingBet, this.reactionPlacingBet.bind(this));
        reaction(() => this.roundTimeStore.roundTime, this.reactionRoundTime.bind(this));
        reaction(() => this.betStore.lastReceivedBet, this.reactionLastReceivedBet.bind(this));
        reaction(() => this.crashCashOutStore.halfCashOut, this.reactionHalfCashOut.bind(this));
        reaction(() => this.crashCashOutStore.cashOut, this.reactionCashOut.bind(this));
    }

    private reactionPlacingBet(isStartPlacingBet: boolean) {
        if (!isStartPlacingBet) {
            return;
        }

        this.resetMainPlayer();
        this.resetOtherPlayerList();
    }

    private reactionRoundTime(roundTime: number) {
        if (roundTime <= 0 || this.roundTimeStore.isShowAnimationResult || this.roundTimeStore.isShowResult) {
            this.isNeedEmptyBetAmount = true;
        }
    }

    private reactionLastReceivedBet(lastReceivedBet: ILastReceivedBet) {
        if (!lastReceivedBet) {
            return;
        }

        const bet = lastReceivedBet.value;
        if (bet > 0) {
            const player = {
                name: this.mainPlayerStore.name,
                amount: bet,
            };
            this.mainPlayer = player;
        }

        this.isNeedEmptyBetAmount = false;
    }

    private reactionHalfCashOut(halfCashOut: GameCrashServiceMessage.CrashCashOut) {
        if (!halfCashOut) {
            return;
        }
        const player = {
            name: this.mainPlayer.name,
            amount: this.mainPlayer.amount,
            halfCashOut,
        };
        this.mainPlayer = player;
        this.isNeedEmptyBetAmount = false;
    }

    private reactionCashOut(cashOut: GameCrashServiceMessage.CrashCashOut) {
        if (!cashOut) {
            return;
        }
        const player = {
            name: this.mainPlayer.name,
            amount: this.mainPlayer.amount,
            halfCashOut: this.mainPlayer.halfCashOut,
            cashOut,
        };
        this.mainPlayer = player;
        this.isNeedEmptyBetAmount = false;
    }

    set isNeedEmptyBetAmount(value: boolean) {
        this._isNeedEmptyBetAmount = value;
    }

    get isNeedEmptyBetAmount() {
        return this._isNeedEmptyBetAmount;
    }

    get betList(): GameCrashServiceMessage.CrashOtherPlayerList {
        return this._betList;
    }

    set mainPlayer(value: GameCrashServiceMessage.CrashOtherPlayer) {
        this._mainPlayer = value;
    }

    get mainPlayer(): GameCrashServiceMessage.CrashOtherPlayer {
        return this._mainPlayer;
    }

    get noOfPlayerBet(): number {
        const countMainPlayer = this.mainPlayer?.amount ? 1 : 0;
        return this._betList.players.length + countMainPlayer;
    }

    get noOfPlayerCashOut() {
        const players = [];
        this._betList.players.forEach((player: IPlayer) => {
            (player.cashOut || player.halfCashOut) && players.push(player);
        });

        const countMainPlayer = this.mainPlayer?.cashOut || this.mainPlayer?.halfCashOut ? 1 : 0;
        return players.length + countMainPlayer;
    }

    addBetList(data: ICrashBetList, isReceivedBetListData = false) {
        let players = this.convertCurrency(data);
        let playerList = [];
        if (isReceivedBetListData) {
            playerList = this.updatePlayerListByBetList(players, playerList);
        } else {
            playerList = this.updateBetListByOtherPlayerCashOut(players);
        }

        this._betList = {
            players: playerList,
        };
    }

    private updateBetListByOtherPlayerCashOut(players: any[]): any[] {
        return players.concat(...this._betList.players).sort((player1, player2) => player2.amount - player1.amount);
    }

    private updatePlayerListByBetList(players: any[], playerList: any[]) {
        const newPlayers = players.concat(...this._betList.players);
        const cashOutPlayers = this.sortCashOutPlayersByTime(newPlayers);
        const betPlayers = this.sortBetPlayersByAmount(newPlayers);
        playerList = cashOutPlayers.concat(betPlayers);

        return playerList;
    }

    private sortBetPlayersByAmount(newPlayers: any[]) {
        const betPlayers = newPlayers.filter((player) => !player.halfCashOut && !player.cashOut);
        betPlayers.sort((player1, player2) => player2.amount - player1.amount);

        return betPlayers;
    }

    private sortCashOutPlayersByTime(newPlayers: any[]) {
        const cashOutPlayers = newPlayers.filter((player) => player.cashOut || player.halfCashOut);
        cashOutPlayers.sort((player1: IPlayer, player2: IPlayer) => {
            const time1 = new Date(player1.time).getTime();
            const time2 = new Date(player2.time).getTime();
            return time2 - time1;
        });

        return cashOutPlayers;
    }

    private convertCurrency(data: ICrashBetList) {
        const players = [];
        Object.keys(data).forEach((key) => {
            if (!data[key]) {
                return;
            }

            const { amount, rate, halfCashOut, cashOut } = data[key];

            data[key].amount = NumberUtils.getValueByCurrency(amount, this.mainPlayerStore.rate, rate);

            if (halfCashOut) {
                data[key].halfCashOut.win = NumberUtils.getValueByCurrency(halfCashOut.win, this.mainPlayerStore.rate, rate);
            }

            if (cashOut) {
                data[key].cashOut.win = NumberUtils.getValueByCurrency(cashOut.win, this.mainPlayerStore.rate, rate);
            }

            players.push(data[key]);
        });

        return players;
    }

    resetOtherPlayerList() {
        this._betList = { players: [] };
    }

    resetMainPlayer() {
        this.mainPlayer = null;
    }

    updateBetListCashOut(otherPlayer: GameCrashServiceMessage.CrashOtherPlayer) {
        const { playerId, halfCashOut, cashOut } = otherPlayer;
        const existedPlayer = this._betList.players.find((player) => player.playerId === playerId);
        if (!existedPlayer) {
            return;
        }

        if (halfCashOut) {
            existedPlayer["halfCashOut"] = halfCashOut;
        }

        if (cashOut) {
            existedPlayer["cashOut"] = cashOut;
        }

        const newPlayers = this._betList.players.filter((player) => player.playerId !== playerId);

        this._betList = {
            players: [existedPlayer, ...newPlayers],
        };
    }
}
