import { inject, injectable } from "inversify";
import { reaction } from "mobx";

import { BetStore, ILastReceivedBet } from "../../game/bets/bet-store";
import { RoundTimeStore } from "../../game/rounds/round-time-store";
import { MainPlayerStore } from "../../players/main-player-store";
import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { NumberUtils } from "../../shared/utils/number-utils";
import { CrashCashOutStore } from "../cash-out/crash-cash-out-store";
import { GameCrashServiceMessage } from "../game-crash-messages";
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

    private updatePlayerListByPlayerChip(players: any[]): any[] {
        const newList = players.concat(...this.betListStore.betList);
        return this.sortDecreasedBetAmount(newList);
    }

    private sortDecreasedBetAmount(betPlayers: any[]) {
        return betPlayers.sort((player1, player2) => player2.amount - player1.amount);
    }

    private updatePlayerList(newPlayers: any[]) {
        const cashOutPlayers = this.sortCashOutPlayersByTime(newPlayers);
        const betPlayers = this.sortPlayersByBetAmount(newPlayers);
        const playerList = cashOutPlayers.concat(betPlayers);

        return playerList;
    }

    private sortPlayersByBetAmount(newPlayers: any[]) {
        const betPlayers = newPlayers.filter((player) => !player.halfCashOut && !player.cashOut);
        return this.sortDecreasedBetAmount(betPlayers);
    }

    private sortCashOutPlayersByTime(newPlayers: any[]) {
        const cashOutPlayers = newPlayers.filter((player) => player.cashOut || player.halfCashOut);
        cashOutPlayers.sort((player1, player2) => {
            const time1 = new Date(player1.time).getTime();
            const time2 = new Date(player2.time).getTime();
            return time2 - time1;
        });

        return cashOutPlayers;
    }

    convertCurrencyCashOut(player: GameCrashServiceMessage.CrashOtherPlayer) {
        const { halfCashOut, cashOut, rate } = player;

        halfCashOut && this.getValueByCurrency(halfCashOut, rate);
        cashOut && this.getValueByCurrency(cashOut, rate);

        return player;
    }

    getValueByCurrency(cashOut: GameCrashServiceMessage.CashOutReceive, rate: number) {
        const { amount, win } = cashOut;

        cashOut.win = NumberUtils.getValueByCurrency(win, this.mainPlayerStore.rate, rate);
        cashOut.amount = NumberUtils.getValueByCurrency(amount, this.mainPlayerStore.rate, rate);

        return cashOut;
    }

    private convertCurrency(data: ICrashBetList) {
        const players = [];
        Object.keys(data).forEach((key) => {
            if (!data[key]) {
                return;
            }

            const { amount, rate } = data[key];

            data[key].amount = NumberUtils.getValueByCurrency(amount, this.mainPlayerStore.rate, rate);
            data[key] = this.convertCurrencyCashOut(data[key]);

            players.push(data[key]);
        });

        return players;
    }

    private resetOtherPlayerList() {
        this.betListStore.betList = [];
    }

    private resetMainPlayer() {
        this.betListStore.mainPlayer = null;
    }

    updateBetListCashOut(otherPlayer: GameCrashServiceMessage.CrashOtherPlayer) {
        const { playerId, halfCashOut, cashOut } = otherPlayer;
        const existedPlayer = this.betListStore.betList.find((player) => player.playerId === playerId && !player.halfCashOut);

        if (!existedPlayer) {
            return;
        }

        const newHalfCashOutPlayer = { ...existedPlayer };
        let newCashOut = [];

        if (halfCashOut) {
            newCashOut = this.addHalfCashOutItem(halfCashOut, existedPlayer, newHalfCashOutPlayer, newCashOut);
        }

        if (cashOut) {
            existedPlayer["cashOut"] = cashOut;
        }

        newCashOut = newCashOut.concat(...this.betListStore.betList);

        const playerList = this.updatePlayerList(newCashOut);

        this.betListStore.betList = playerList;
    }

    private addHalfCashOutItem(
        halfCashOut: GameCrashServiceMessage.CashOutReceive,
        existedPlayer: GameCrashServiceMessage.CrashOtherPlayer,
        newHalfCashOutPlayer: GameCrashServiceMessage.CrashOtherPlayer,
        newCashOut: any[]
    ) {
        existedPlayer.amount = halfCashOut.amount;

        newHalfCashOutPlayer["halfCashOut"] = halfCashOut;
        newCashOut.push(newHalfCashOutPlayer);

        return newCashOut;
    }

    private handleBetList(betList: ICrashBetList) {
        let convertedCurrencyPlayers = this.convertCurrency(betList);
        const newPlayers = convertedCurrencyPlayers.concat(...this.betListStore.betList);
        const playerList = this.updatePlayerList(newPlayers);

        this.betListStore.betList = playerList;
    }

    private handlePlayerChip(playerChip: GameServiceMessage.PlayerChip) {
        const data = { [playerChip.playerId]: playerChip };
        let players = this.convertCurrency(data);
        const playerList = this.updatePlayerListByPlayerChip(players);

        this.betListStore.betList = playerList;
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
