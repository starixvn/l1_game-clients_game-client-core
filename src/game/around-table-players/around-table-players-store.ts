import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { SiteConfigs, SystemType } from "../../configs";
import { GameServiceMessage } from "../../shared";

@injectable()
export class AroundTablePlayersStore {
    constructor(@inject(SiteConfigs) protected readonly siteConfigs: SiteConfigs) {
        makeAutoObservable(this);
    }

    aroundTablePlayer: GameServiceMessage.AroundTablePlayer = null;
    aroundTablePlayers: GameServiceMessage.AroundTablePlayers = {};
    outGamePlayerId = "";
    maxBalanceDisplay = 9999;

    updateMaxBalanceDisplay() {
        if (this.siteConfigs.systemType === SystemType.SC2) {
            this.maxBalanceDisplay = 99999;
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
