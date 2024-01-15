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
        reaction(() => this.roundTimeStore.isStartRound, this.reactionStartRound.bind(this));
        reaction(() => this.betStore.lastReceivedBet, this.reactionLastReceivedBet.bind(this));
        reaction(() => this.crashCashOutStore.halfCashOut, this.reactionHalfCashOut.bind(this));
        reaction(() => this.crashCashOutStore.cashOut, this.reactionCashOut.bind(this));
    }

    private reactionStartRound(isStartRound: boolean) {
        if (!isStartRound) {
            return;
        }

        this.resetLeaderBoard();
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

    private sortDecreasedBetAmount(betPlayers: LeaderBoardPlayer[]) {
        return betPlayers.sort((player1, player2) => player2.amount - player1.amount);
    }

    private sortByMultiplierBetAmount(newPlayers: LeaderBoardPlayer[]) {
        const cashOutPlayers = this.sortPlayersByMultiplier(newPlayers);
        const notCashOutPlayers = this.sortPlayersByBetAmount(newPlayers);
        cashOutPlayers.push(...notCashOutPlayers);

        return cashOutPlayers;
    }

    private sortPlayersByBetAmount(players: LeaderBoardPlayer[]) {
        const list = players.filter((player) => player.win === 0);
        return this.sortDecreasedBetAmount(list);
    }

    private sortPlayersByMultiplier(newPlayers: LeaderBoardPlayer[]) {
        const list = newPlayers.filter((player) => player.win > 0);
        list.sort((player1, player2) => player2.multiplier - player1.multiplier);

        return list;
    }

    private generateLeaderBoardPlayers(data: ICrashBetList): LeaderBoardPlayer[] {
        const players: LeaderBoardPlayer[] = [];
        Object.keys(data).forEach((key) => {
            const { amount, rate, halfCashOut, cashOut, playerId, name } = data[key];
            const newPlayer: LeaderBoardPlayer = {
                playerId,
                name,
                amount,
                win: 0,
                multiplier: 0,
            };

            newPlayer.amount = NumberUtils.getValueByCurrency(amount, this.mainPlayerStore.rate, rate);
            if (cashOut) {
                this.convertAmountAndWinValue(cashOut, rate);
                this.updateCashOutRow(newPlayer, cashOut);
            }
            if (halfCashOut) {
                this.convertAmountAndWinValue(halfCashOut, rate);

                const halfCashOutPlayer = this.updateAmountAndAddHalfCashOut(halfCashOut, newPlayer);
                players.push(halfCashOutPlayer);
            }

            players.push(newPlayer);
        });

        return players;
    }

    convertAmountAndWinValue(cashOut: GameCrashServiceMessage.CashOutReceive, rate: number) {
        const { amount, win } = cashOut;

        cashOut.win = NumberUtils.getValueByCurrency(win, this.mainPlayerStore.rate, rate);
        cashOut.amount = NumberUtils.getValueByCurrency(amount, this.mainPlayerStore.rate, rate);
    }

    private resetLeaderBoard() {
        this.betListStore.otherPlayers = [];
        this.betListStore.mainPlayer = null;
    }

    handleNewOtherCashOut(otherPlayer: GameCrashServiceMessage.CrashOtherPlayer) {
        const { playerId, halfCashOut, cashOut } = otherPlayer;
        const notWinPlayer = this.betListStore.otherPlayers.find((player) => player.playerId === playerId && player.win === 0);

        if (!notWinPlayer) {
            return;
        }

        if (halfCashOut) {
            const newHalfCashOutPlayer = this.updateAmountAndAddHalfCashOut(halfCashOut, notWinPlayer);
            this.betListStore.otherPlayers.push(newHalfCashOutPlayer);
        } else if (cashOut) {
            this.updateCashOutRow(notWinPlayer, cashOut);
        }

        this.betListStore.otherPlayers = this.sortByMultiplierBetAmount(this.betListStore.otherPlayers);
    }

    private updateCashOutRow(notWinPlayer: LeaderBoardPlayer, cashOut: GameCrashServiceMessage.CashOutReceive) {
        notWinPlayer.amount = cashOut.amount;
        notWinPlayer.win = cashOut.win;
        notWinPlayer.multiplier = cashOut.multiplier;
    }

    private updateAmountAndAddHalfCashOut(halfCashOut: GameCrashServiceMessage.CashOutReceive, notWinPlayer: LeaderBoardPlayer) {
        const { amount } = halfCashOut;
        notWinPlayer.amount = amount;

        return this.createHalfCashOut(notWinPlayer, halfCashOut);
    }

    private createHalfCashOut(notWinPlayer: LeaderBoardPlayer, halfCashOut: GameCrashServiceMessage.CashOutReceive) {
        return { ...notWinPlayer, ...halfCashOut };
    }

    private handleBetList(betList: ICrashBetList) {
        const list = this.generateLeaderBoardPlayers(betList);
        this.betListStore.otherPlayers = this.sortByMultiplierBetAmount(list);
    }

    private handlePlayerChip(playerChip: GameServiceMessage.PlayerChip) {
        const { amount, rate, playerId, name } = playerChip;

        const newPlayerBet: LeaderBoardPlayer = {
            playerId,
            name,
            amount: NumberUtils.getValueByCurrency(amount, this.mainPlayerStore.rate, rate),
            multiplier: 0,
            win: 0,
        };
        this.betListStore.otherPlayers.push(newPlayerBet);

        this.betListStore.otherPlayers = this.sortPlayersByBetAmount(this.betListStore.otherPlayers);
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
