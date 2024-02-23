import { GameServiceMessage } from "../shared";

export namespace GameCrashServiceMessage {
    export class CrashMultiplierInfo {
        m: number;
        t: number;
        static eventName = "c";
    }

    export class CrashCashOut {
        amount: number;
        win: number;
        multiplier: number;
        reachMaxWin: boolean;
        cashOutWin: number;
        static cashOutEventName = "cashOut";
        static halfCashOutEventName = "halfCashOut";
    }

    export class CrashOtherPlayer {
        name: string;

        playerId?: string;

        cashOut?: CashOutReceive;

        halfCashOut?: CashOutReceive;

        rate?: number;

        amount?: number;

        win?: number;

        static eventName = "otherPlayer";
    }

    export class CashOutReceive {
        amount: number;
        win: number;
        multiplier: number;
    }

    export class BetList {
        static eventName = "betList";
    }

    export class CrashOwnBets extends GameServiceMessage.OwnBets {
        amount: number;
        autoCashOut: number;
        name: string;
        playerId: string;
        rate: number;
        time: string;
        cashOut?: CrashCashOut;
        halfCashOut?: CrashCashOut;
    }
}

export namespace GameCrashEmitMessage {
    export class Bet {
        username: string;
        m: number;
        freeBet: boolean;
        amount: number;
        roundId: number;
        autoCashOut: number;
        clientSendTime: Date;
        static eventName = "bet";
    }

    export class CashOut {
        username: string;
        m: number;
        freeBet: boolean;
        amount: number;
        roundId: number;
        halfCashOut: number;
        clientSendTime: Date;
        static eventName = "cashOut";
    }

    export class HalfCashOut {
        username: string;
        multiplier: number;
        roundId: number;
        halfCashOut: boolean;
        clientSendTime: Date;
        static eventName = "halfCashOut";
    }
}

export interface PFClientSetting {
    randomClientSeedEnabled: boolean;
    manualClientSeed: string;
    randomClientSeed: string;
}

export interface IGameCrashUserSettings {
    betAmount: number;
    enableAutoCashOut: boolean;
    autoCashOutMultiplier: number;
}

export interface IGameCrashPermanentUserSettings {
    pf?: PFClientSetting;
}

export interface LeaderBoardPlayer {
    playerId: string;
    name: string;
    amount: number;
    win: number;
    multiplier: number;
}

export const ButtonState = {
    PLACE_BET: "PLACE_BET",
    BET_NEXT_ROUND: "BET_NEXT_ROUND",
    CANCEL_BET: "CANCEL_BET",
    BET_ACCEPTED: "BET_ACCEPTED",
    CASH_OUT: "CASH_OUT",
};

export const RocketState = {
    CRASHED: "CRASHED",
    FLYING: "FLYING",
    ONLAND: "ONLAND",
};
