

export namespace GameTurnBaseServiceMessage {
    export class Bet {

        static eventName = "bet";
    }

    export interface PFClientSetting {
        randomClientSeedEnabled: boolean;
        manualClientSeed: string;
        randomClientSeed: string;
    }

    export interface IGameCrashPermanentUserSettings {
        pf?: PFClientSetting;
    }

}
