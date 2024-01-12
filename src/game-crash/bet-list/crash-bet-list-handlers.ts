import { inject, injectable } from "inversify";
import { reaction } from "mobx";

import { BetStore, ILastReceivedBet } from "../../game/bets/bet-store";
import { RoundTimeStore } from "../../game/rounds/round-time-store";
import { MainPlayerStore } from "../../players/main-player-store";
import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { NumberUtils } from "../../shared/utils/number-utils";
import { CrashCashOutStore } from "../cash-out/crash-cash-out-store";
import { GameCrashServiceMessage, LeaderBoardPlayer } from "../game-crash-messages";
import { CrashBetListStore, ICrashBetList } from "./crash-bet-list-store";

@injectable()
export class CrashBetListHandlers implements IMultipleHandlers {
    constructor(
        @inject(MainPlayerStore) private readonly mainPlayerStore: MainPlayerStore,
        @inject(CrashCashOutStore) private readonly crashCashOutStore: CrashCashOutStore,
        @inject(RoundTimeStore) private readonly roundTimeStore: RoundTimeStore,
        @inject(BetStore) private readonly betStore: BetStore,
        @inject(CrashBetListStore) protected readonly betListStore: CrashBetListStore
    ) {
        reaction(() => this.roundTimeStore.isStartRound, this.reactionPlacingBet.bind(this));
        reaction(() => this.betStore.lastReceivedBet, this.reactionLastReceivedBet.bind(this));
        reaction(() => this.crashCashOutStore.halfCashOut, this.reactionHalfCashOut.bind(this));
        reaction(() => this.crashCashOutStore.cashOut, this.reactionCashOut.bind(this));
    }

    private reactionPlacingBet(isPlacingBet: boolean) {
        if (!isPlacingBet) {
            return;
        }

        this.resetMainPlayer();
        this.resetOtherPlayerList();
    }

    private reactionLastReceivedBet(lastReceivedBet: ILastReceivedBet) {
        if (!lastReceivedBet || lastReceivedBet.value <= 0) {
            return;
        }

        const player = {
            name: this.mainPlayerStore.name,
            amount: lastReceivedBet.value,
        };
        this.betListStore.mainPlayer = player;
    }

    private reactionHalfCashOut(halfCashOut: GameCrashServiceMessage.CrashCashOut) {
        if (!halfCashOut) {
            return;
        }
        const { name, amount } = this.betListStore.mainPlayer;
        const player = { name, amount, halfCashOut };
        this.betListStore.mainPlayer = player;
    }

    private reactionCashOut(cashOut: GameCrashServiceMessage.CrashCashOut) {
        if (!cashOut) {
            return;
        }

        const { name, amount, halfCashOut } = this.betListStore.mainPlayer;
        const player = { name, amount, halfCashOut, cashOut };
        this.betListStore.mainPlayer = player;
    }

    private updatePlayerListByPlayerChip(players): any[] {
        const newList = players.concat(...this.betListStore.otherPlayers);
        return this.sortDecreasedBetAmount(newList);
    }

    private sortDecreasedBetAmount(betPlayers: any[]) {
        return betPlayers.sort((player1, player2) => player2.amount - player1.amount);
    }

    private updatePlayerList(newPlayers: any[]) {
        const cashOutPlayers = this.sortPlayersByMultiplier(newPlayers);
        const betPlayers = this.sortPlayersByBetAmount(newPlayers);
        const playerList = cashOutPlayers.concat(betPlayers);

        return playerList;
    }

    private sortPlayersByBetAmount(newPlayers: any[]) {
        const betPlayers = newPlayers.filter((player) => player.win === 0);
        return this.sortDecreasedBetAmount(betPlayers);
    }

    private sortPlayersByMultiplier(newPlayers: any[]) {
        const newList = newPlayers.filter((player) => player.win > 0);
        newList.sort((player1, player2) => player2.multiplier - player1.multiplier);

        return newList;
    }

    private convertCurrency(data: ICrashBetList) {
        const players = [];
        Object.keys(data).forEach((key) => {
            if (!data[key]) {
                return;
            }

            const { amount, rate, win, multiplier } = data[key];

            data[key].amount = NumberUtils.getValueByCurrency(amount, this.mainPlayerStore.rate, rate);
            data[key].win = NumberUtils.getValueByCurrency(win, this.mainPlayerStore.rate, rate);
            data[key].multiplier = NumberUtils.getValueByCurrency(multiplier, this.mainPlayerStore.rate, rate);

            players.push(data[key]);
        });

        return players;
    }

    private resetOtherPlayerList() {
        this.betListStore.otherPlayers = [];
    }

    private resetMainPlayer() {
        this.betListStore.mainPlayer = null;
    }

    updateBetListCashOut(otherPlayer: GameCrashServiceMessage.CrashOtherPlayer) {
        const { playerId, halfCashOut, cashOut } = otherPlayer;
        const notWinPlayer = this.betListStore.otherPlayers.find((player) => player.playerId === playerId && player.win === 0);

        if (!notWinPlayer) {
            return;
        }

        const newHalfCashOutPlayer = { ...notWinPlayer };
        let newCashOut = [];

        if (halfCashOut) {
            notWinPlayer.amount = halfCashOut.amount;
            this.addHalfCashOutItem(newHalfCashOutPlayer, halfCashOut);
            newCashOut.push(newHalfCashOutPlayer);
        }

        if (cashOut) {
            notWinPlayer.win = cashOut.win;
            notWinPlayer.multiplier = cashOut.multiplier;
        }

        newCashOut = newCashOut.concat(...this.betListStore.otherPlayers);

        const playerList = this.updatePlayerList(newCashOut);

        this.betListStore.otherPlayers = playerList;
    }

    private addHalfCashOutItem(newHalfCashOutPlayer: LeaderBoardPlayer, halfCashOut: GameCrashServiceMessage.CashOutReceive) {
        const { win, multiplier } = halfCashOut;

        newHalfCashOutPlayer.win = win;
        newHalfCashOutPlayer.multiplier = multiplier;
    }

    private handleBetList(betList: ICrashBetList) {
        let convertedCurrencyPlayers = this.convertCurrency(betList);
        const newPlayers = convertedCurrencyPlayers.concat(...this.betListStore.otherPlayers);
        const playerList = this.updatePlayerList(newPlayers);

        this.betListStore.otherPlayers = playerList;
    }

    private handlePlayerChip(playerChip: GameServiceMessage.PlayerChip) {
        const { amount, rate } = playerChip;
        playerChip[amount] = NumberUtils.getValueByCurrency(amount, this.mainPlayerStore.rate, rate);
        playerChip["multiplier"] = 0;
        playerChip["win"] = 0;
        const playerList = this.updatePlayerListByPlayerChip([playerChip]);

        this.betListStore.otherPlayers = playerList;
    }

    eventHandleList = [
        {
            name: GameCrashServiceMessage.BetList.eventName,
            handle: this.handleBetList,
        },
        {
            name: GameServiceMessage.PlayerChip.eventName,
            handle: this.handlePlayerChip,
        },
    ];
}
