import { inject, injectable } from "inversify";
import { reaction } from "mobx";

import { BetStore, ILastReceivedBet } from "../../game/bets/bet-store";
import { RoundTimeStore } from "../../game/rounds/round-time-store";
import { MainPlayerStore } from "../../players/main-player-store";
import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { NumberUtils } from "../../shared/utils/number-utils";
import { CrashCashOutStore } from "../cash-out/crash-cash-out-store";
import { GameCrashServiceMessage } from "../game-crash-messages";
import { CrashBetListStore, ICrashBetList, IPlayer } from "./crash-bet-list-store";

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
        reaction(() => this.roundTimeStore.roundTime, this.reactionRoundTime.bind(this));
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

    private reactionRoundTime(roundTime: number) {
        if (roundTime <= 0 || this.roundTimeStore.isDisplayingResultState) {
            this.betListStore.isNeedEmptyBetAmount = true;
        }
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
        this.betListStore.isNeedEmptyBetAmount = false;
    }

    private reactionHalfCashOut(halfCashOut: GameCrashServiceMessage.CrashCashOut) {
        if (!halfCashOut) {
            return;
        }
        const { name, amount } = this.betListStore.mainPlayer;
        const player = { name, amount, halfCashOut };
        this.betListStore.mainPlayer = player;
        this.betListStore.isNeedEmptyBetAmount = false;
    }

    private reactionCashOut(cashOut: GameCrashServiceMessage.CrashCashOut) {
        if (!cashOut) {
            return;
        }

        const { name, amount, halfCashOut } = this.betListStore.mainPlayer;
        const player = { name, amount, halfCashOut, cashOut };
        this.betListStore.mainPlayer = player;
        this.betListStore.isNeedEmptyBetAmount = false;
    }

    private updatePlayerListByPlayerChip(players: any[]): any[] {
        const newList = players.concat(...this.betListStore.betList.players);
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

    private resetOtherPlayerList() {
        this.betListStore.betList = { players: [] };
    }

    private resetMainPlayer() {
        this.betListStore.mainPlayer = null;
    }

    updateBetListCashOut(otherPlayer: GameCrashServiceMessage.CrashOtherPlayer) {
        const { playerId, halfCashOut, cashOut } = otherPlayer;
        const existedPlayer = this.betListStore.betList.players.find((player) => player.playerId === playerId && !player.halfCashOut);

        if (!existedPlayer) {
            return;
        }

        let newCashOut = [];
        const newHalfCashOutPlayer = { ...existedPlayer };

        newCashOut = this.addHalfCashOutItem(halfCashOut, existedPlayer, newHalfCashOutPlayer, newCashOut);

        newCashOut = this.addCashOutItem(cashOut, newHalfCashOutPlayer, newCashOut, playerId);

        const playerList = this.updatePlayerList(newCashOut);

        this.betListStore.betList = {
            players: playerList,
        };
    }

    private addCashOutItem(
        cashOut: GameCrashServiceMessage.CashOutReceive,
        newHalfCashOutPlayer: {
            name: string;
            playerId?: string;
            cashOut?: GameCrashServiceMessage.CashOutReceive;
            halfCashOut?: GameCrashServiceMessage.CashOutReceive;
            rate?: number;
            amount?: number;
            win?: number;
        },
        newCashOut: any[],
        playerId: string
    ) {
        if (cashOut) {
            newHalfCashOutPlayer["cashOut"] = cashOut;

            newCashOut.push(newHalfCashOutPlayer);

            const filterPlayers = this.betListStore.betList.players.filter(
                (player) => player.playerId !== playerId || (player.playerId === playerId && player.halfCashOut)
            );

            newCashOut = newCashOut.concat(...filterPlayers);
        }
        return newCashOut;
    }

    private addHalfCashOutItem(
        halfCashOut: GameCrashServiceMessage.CashOutReceive,
        existedPlayer: GameCrashServiceMessage.CrashOtherPlayer,
        newHalfCashOutPlayer: {
            name: string;
            playerId?: string;
            cashOut?: GameCrashServiceMessage.CashOutReceive;
            halfCashOut?: GameCrashServiceMessage.CashOutReceive;
            rate?: number;
            amount?: number;
            win?: number;
        },
        newCashOut: any[]
    ) {
        if (halfCashOut) {
            existedPlayer.amount = existedPlayer.amount / 2;

            newHalfCashOutPlayer["halfCashOut"] = halfCashOut;
            newCashOut.push(newHalfCashOutPlayer);

            newCashOut = newCashOut.concat(...this.betListStore.betList.players);
        }
        return newCashOut;
    }

    private handleBetList(betList: ICrashBetList) {
        let convertedCurrencyPlayers = this.convertCurrency(betList);
        const newPlayers = convertedCurrencyPlayers.concat(...this.betListStore.betList.players);
        const playerList = this.updatePlayerList(newPlayers);

        this.betListStore.betList = {
            players: playerList,
        };
    }

    private handlePlayerChip(playerChip: GameServiceMessage.PlayerChip) {
        const data = { [playerChip.playerId]: playerChip };
        let players = this.convertCurrency(data);
        const playerList = this.updatePlayerListByPlayerChip(players);

        this.betListStore.betList = {
            players: playerList,
        };
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
