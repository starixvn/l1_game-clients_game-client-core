import { inject, injectable } from "inversify";
import { ISessionInfo } from "../auth";
import { IHandler } from "../shared";
import { GameUtils, StorageManager, localStorageKeys } from "../shared/utils";
import { AppStore } from "./app-store";

export namespace AppHandlers {
    @injectable()
    export class BackToOperatorLobby implements IHandler<void> {
        constructor(@inject(AppStore) private readonly appStore: AppStore) {}
        handle() {
            const returnUrl = this.appStore.urlInfo?.returnUrl;
            if (returnUrl) {
                const decodedReturnUrl = GameUtils.base64Decode(returnUrl);
                if (this.appStore.isDirectMode) {
                    window.location.replace(decodedReturnUrl);
                } else {
                    const sessionInfo = StorageManager.get(localStorageKeys.session) as ISessionInfo;
                    const soundSetting = StorageManager.get(localStorageKeys.soundSetting);
                    const params = {
                        ss: sessionInfo?.session,
                        time: new Date(sessionInfo?.ssoTime).getTime(),
                        musicEnable: soundSetting["musicEnable"] ?? true,
                        sfxEnable: soundSetting["sfxEnable"] ?? true,
                    };
                    const urlParams = new URLSearchParams();
                    Object.keys(params).forEach((key) => params[key] !== undefined && urlParams.append(key, params[key]));
                    const encodedQueryString = GameUtils.base64Encode(urlParams.toString());
                    window.location.replace(`${decodedReturnUrl}?params=${encodedQueryString}`);
                }
            }
        }
    }
}
