import { inject, injectable } from "inversify";
import * as _ from "lodash";
import { MainPlayerStore } from "../../players/main-player-store";
import { GameServiceMessage } from "../../shared";
import { SettlementStore as SettlementStoreBase } from "../../game/settlements";
import { makeObservable, observable } from "mobx";

@injectable()
export class SettlementStore extends SettlementStoreBase {
    drawId = 0;

    constructor(
        @inject(MainPlayerStore) protected readonly mainPlayerStore: MainPlayerStore,
        drawId = 0
    ) {
        super(mainPlayerStore);
        makeObservable(this, {
            drawId: observable
        });

        this.drawId = drawId;
    }

    setSettlementStore(finish: GameServiceMessage.Finish | undefined) {
        super.setSettlementStore(finish);
        finish?.drawId && (this.drawId = finish.drawId);
    }

}
