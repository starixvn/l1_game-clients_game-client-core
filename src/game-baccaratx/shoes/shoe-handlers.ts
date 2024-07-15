import { inject, injectable } from "inversify";
import { reaction } from "mobx";
import { FairnessStore } from "../../features/provably-fair/cut-card-game/fairness-store";
import { ConnectionHandlers } from "../../game/connection/connection-handlers";
import { RoundHistoryStore } from "../../game/round-histories";
import { RoundTimeStore } from "../../game/rounds";
import { RoundUIHandlers } from "../../game/rounds/round-ui-handlers";
import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { ExtraFeeHandlers } from "../extra-fee";
import { BaccaratMultipliersHandler } from "../multiplier/baccarat-multipliers-handler";
import { CutCardHandler } from "./../../features/provably-fair/cut-card-game/cut-card-handler";
import { PopupsClosedStore } from "./../../game/popups-closed/popups-closed-store";
import { ShoeStore } from "./shoe-store";

@injectable()
export class ShoeHandlers implements IMultipleHandlers {
    constructor(
        @inject(CutCardHandler) protected readonly cutCardHandler: CutCardHandler,
        @inject(ShoeStore) protected readonly shoeStore: ShoeStore,
        @inject(ConnectionHandlers.RetryGameHandler) protected readonly retryGameHandler: ConnectionHandlers.RetryGameHandler,
        @inject(FairnessStore) protected readonly fairnessStore: FairnessStore,
        @inject(RoundHistoryStore) protected readonly roundHistoryStore: RoundHistoryStore,
        @inject(BaccaratMultipliersHandler) protected readonly baccaratMultipliersHandler: BaccaratMultipliersHandler,
        @inject(ExtraFeeHandlers) protected readonly extraFeeHandlers: ExtraFeeHandlers,
        @inject(RoundUIHandlers.StartingRoundHandler) protected readonly startingRoundHandler: RoundUIHandlers.StartingRoundHandler,
        @inject(PopupsClosedStore) protected readonly popupsClosed: PopupsClosedStore,
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore
    ) {
        reaction(
            () => this.roundTimeStore.isStartRound,
            (isStartRound) => {
                if (isStartRound) {
                    this.shoeStore.newShoePhase = false;
                }
            }
        );
    }

    handleNewShoeHash(newShoeHash: string) {
        this.shoeStore.shoeHash = newShoeHash;
        this.shoeStore.newShoePhase = true;
        this.popupsClosed.forceClosed = {};
        this.resetForNewShoe();
        this.handleShowPopups();
    }
    handleShowPopups() {
        if (!this.fairnessStore.dontShowAgain) {
            this.fairnessStore.isShowFairnessSettingsPopup = true;
        } else {
            this.fairnessStore.showWaitingScreen = true;
        }
    }

    resetForNewShoe() {
        this.extraFeeHandlers.resetExtraFee();
        this.roundHistoryStore.clearRoundHistories();
        this.baccaratMultipliersHandler.handleForNewShoe();
        this.startingRoundHandler.resetForNewRound();
    }

    handleShoeInfo(shoeInfo: GameServiceMessage.ShoeInfo) {
        this.shoeStore.shoeInfo = {
            ...shoeInfo,
            roundTime: this.roundTimeStore.roundTime,
            animated: shoeInfo.new || shoeInfo.newShoePhase,
        };
        this.shoeStore.shoeHash = shoeInfo.hashValue;

        if (!!shoeInfo.newShoePhase) {
            console.log("new shoe time is ", this.roundTimeStore.roundTime);

            this.shoeStore.newShoePhase = true;
            this.handleShowPopups();
            return;
        }

        this.cutCardHandler.resetCutCardInfo();
        this.fairnessStore.isShowFairnessSettingsPopup = false;
        this.fairnessStore.showWaitingScreen = false;
    }

    eventHandleList = [
        {
            name: GameServiceMessage.NewShoeHash.eventName,
            handle: this.handleNewShoeHash,
        },
        {
            name: GameServiceMessage.ShoeInfo.eventName,
            handle: this.handleShoeInfo,
        },
    ];

    sendCardIndex(index: number) {
        this.shoeStore.shoeInfo.currentIndex = index;
    }
}
