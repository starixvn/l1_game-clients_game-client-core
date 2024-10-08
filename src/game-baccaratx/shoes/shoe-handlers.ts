import { inject, injectable } from "inversify";
import { reaction } from "mobx";
import { DialogsStore } from "../../game/dialogs/dialogs-store";
import { RoundHistoryStore } from "../../game/round-histories";
import { RoundStore, RoundTimeStore } from "../../game/rounds";
import { RoundUIHandlers } from "../../game/rounds/round-ui-handlers";
import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { FairnessHandler } from "../cut-card-pf";
import { FairnessStore } from "../cut-card-pf/fairness-store";
import { ExtraFeeHandlers } from "../extra-fee";
import { BaccaratMultipliersHandler } from "../multiplier/baccarat-multipliers-handler";
import { ShoeStore } from "./shoe-store";

@injectable()
export class ShoeHandlers implements IMultipleHandlers {
    constructor(
        @inject(FairnessHandler) protected readonly fairnessHandler: FairnessHandler,
        @inject(ShoeStore) protected readonly shoeStore: ShoeStore,
        @inject(FairnessStore) protected readonly fairnessStore: FairnessStore,
        @inject(RoundHistoryStore) protected readonly roundHistoryStore: RoundHistoryStore,
        @inject(BaccaratMultipliersHandler) protected readonly baccaratMultipliersHandler: BaccaratMultipliersHandler,
        @inject(ExtraFeeHandlers) protected readonly extraFeeHandlers: ExtraFeeHandlers,
        @inject(RoundUIHandlers.StartingRoundHandler) protected readonly startingRoundHandler: RoundUIHandlers.StartingRoundHandler,
        @inject(DialogsStore) protected readonly dialogsStore: DialogsStore,
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(RoundStore) protected readonly roundStore: RoundStore
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
        this.shoeStore.shoeInfo = null;
        this.shoeStore.shoeHash = newShoeHash;
        this.shoeStore.newShoePhase = true;
        this.dialogsStore.forceClosed = {};
        this.resetForNewShoe();
        this.roundStore.setClientRoundId(this.roundStore.clientRoundId + 1);
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
        this.fairnessStore.showNoticeCutCardFailed = false;
    }

    handleShoeInfo(shoeInfo: GameServiceMessage.ShoeInfo) {
        const notFinalCutCardIndex = !shoeInfo.cutCardIndex;
        this.shoeStore.shoeInfo = {
            ...shoeInfo,
            roundTime: this.roundTimeStore.roundTime,
            animated: shoeInfo.new || (shoeInfo.newShoePhase && !!shoeInfo.cutCardIndex),
        };
        this.shoeStore.shoeHash = shoeInfo.hashValue;

        if (!!shoeInfo.newShoePhase) {
            this.shoeStore.newShoePhase = true;
            if (notFinalCutCardIndex) {
                this.handleShowPopups();
            }
            return;
        }
        this.fairnessStore.isShowFairnessSettingsPopup = false;
        this.fairnessStore.showWaitingScreen = false;

        this.fairnessHandler.resetCutCardInfo();
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
}
