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

        playerId: string;

        cashOut?: CashOutReceive;

        halfCashOut?: CashOutReceive;

        rate?: number;

        amount?: number;
        
        win?: number;

        static eventName = "otherPlayer";
    }

    export type CashOutReceive = {
        amount: number;
        win: number;
        multiplier: number;
    };

    export interface CrashOtherPlayerList {
        players: CrashOtherPlayer[];
    }

    export class BetList {
        static eventName = "betList";
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
