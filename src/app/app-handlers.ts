import { inject, injectable } from "inversify";
import { ISessionInfo } from "../auth";
import { AutoCashOutStore } from "../game-crash/auto-cash-out/auto-cash-out-store";
import { BetInputStore } from "../game-crash/bet-input/bet-input-store";
import { PlayerSelectionHandlers } from "../game/player-selections";
import { IHandler } from "../shared";
import { BrowserDomUtils, GameUtils, StorageManager, localStorageKeys, sentryLogger } from "../shared/utils";
import { AppStore } from "./app-store";

export namespace AppHandlers {
    @injectable()
    export class BackToOperatorLobby implements IHandler<void> {
        constructor(
            @inject(AppStore) private readonly appStore: AppStore,
            @inject(PlayerSelectionHandlers.ClearHandlers)
            private readonly playerSelectionClearHandler: PlayerSelectionHandlers.ClearHandlers
        ) {}

        handle() {
            this.playerSelectionClearHandler.handle();
            if (this.appStore.urlInfo?.returnUrl) {
                try {
                    this.appStore.isLoading = true;
                    if (this.appStore.isDirectMode) {
                        BrowserDomUtils.replaceParentLocation(GameUtils.base64Decode(this.appStore.urlInfo.returnUrl));
                    } else {
                        const params = this.getParamAuthorize();
                        BrowserDomUtils.postMessageToParent({ ...params, backLobby: true });
                    }
                } catch (err) {
                    sentryLogger.logError(err);
                }
            }
        }

        handleOpenGame(gameId: number) {
            this.playerSelectionClearHandler.handle();
            const params = this.getParamAuthorize(gameId);
            BrowserDomUtils.postMessageToParent({ ...params, backLobby: true });
        }

        private getParamAuthorize(gameId?: number) {
            const sessionInfo = StorageManager.get(localStorageKeys.session) as ISessionInfo;
            return {
                ss: sessionInfo?.session,
                time: new Date(sessionInfo?.ssoTime).getTime(),
                username: sessionInfo?.username,
                isAuthenticated: sessionInfo?.isAuthenticated,
                memberName: sessionInfo?.memberName,
                language: sessionInfo?.language,
                gameId,
            };
        }
    }

    @injectable()
    export class UserGesturePage implements IHandler<boolean> {
        constructor(@inject(AppStore) private readonly appStore: AppStore) {}

        handle(isUserGesture: boolean) {
            this.appStore.isUserGesture = isUserGesture;
        }

        handleTouchScreen(isTouchedScreen: boolean) {
            this.appStore.isTouchedScreen = isTouchedScreen;
        }
    }

    @injectable()
    export class ClearGameSetting implements IHandler<void> {
        constructor(
            @inject(BetInputStore) protected readonly betInputStore: BetInputStore,
            @inject(AutoCashOutStore) protected readonly autoCashOutStore: AutoCashOutStore
        ) {}

        handle() {
            StorageManager.remove(localStorageKeys.userSetting);
            this.betInputStore.initBetAmount();
            this.autoCashOutStore.loadMultiplierFromStorage();
        }
    }
}
