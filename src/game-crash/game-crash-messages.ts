export namespace GameCrashServiceMessage {
    export class CrashMultiplierInfo {
        m: number;
        t: number;
        static eventName = "c";
    }

    export class CrashCashoutHalfInfo {
        win: number;
        static eventName = "halfCashOut";
    }

    export class CrashCashoutFullInfo {
        win: number;
        static eventName = "cashOut";
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
