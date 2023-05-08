import { inject, injectable } from "inversify";
import { IHandler } from "../shared";
import { GameUtils } from "../shared/utils";
import { AppStore } from "./app-store";

export namespace AppHandlers {
    @injectable()
    export class BackToOperatorLobby implements IHandler<void> {
        constructor(@inject(AppStore) private readonly appStore: AppStore) {}
        handle() {
            const returnUrl = this.appStore.urlInfo.returnUrl;
            if (returnUrl) {
                window.location.replace(GameUtils.base64Decode(returnUrl));
            }
        }
    }
}
