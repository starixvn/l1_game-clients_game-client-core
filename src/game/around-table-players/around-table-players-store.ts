import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { SiteConfigs } from "../../configs";
import { GameServiceMessage } from "../../shared";
import { SystemConfigs } from "./../../configs/system-configs";

@injectable()
export class AroundTablePlayersStore {
    constructor(@inject(SiteConfigs) protected readonly siteConfigs: SiteConfigs) {
        makeAutoObservable(this);
    }

    aroundTablePlayer: GameServiceMessage.AroundTablePlayer = null;
    aroundTablePlayers: GameServiceMessage.AroundTablePlayers = {};
    outGamePlayerId = "";
    maxBalanceDisplay = SystemConfigs.SG.maxBalanceDisplay;

    updateMaxBalanceDisplay() {
        if (this.siteConfigs.systemType === SystemConfigs.VG.name) {
            this.maxBalanceDisplay = SystemConfigs.VG.maxBalanceDisplay;
        }
    }

    updateAroundTablePlayer(aroundTablePlayer: GameServiceMessage.AroundTablePlayer) {
        if (aroundTablePlayer?.id) {
            this.aroundTablePlayer = aroundTablePlayer;
            this.aroundTablePlayers[aroundTablePlayer.id] = aroundTablePlayer;
        }
    }

    removeAroundTablePlayer(aroundTablePlayer: GameServiceMessage.OutGame) {
        if (aroundTablePlayer?.playerId) {
            this.outGamePlayerId = aroundTablePlayer.playerId;
            delete this.aroundTablePlayers[aroundTablePlayer.playerId];
        }
    }

    resetAroundTablePlayersStore() {
        this.aroundTablePlayer = null;
        this.aroundTablePlayers = {};
    }
}
