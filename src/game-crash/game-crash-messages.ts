export namespace GameCrashServiceMessage {
    export class CrashMultiplierInfo {
        m: number;
        t: number;
        static eventName = "c";
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
}
