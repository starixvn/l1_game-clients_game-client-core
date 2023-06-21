import { inject, injectable } from "inversify";
import { ISessionInfo } from "../auth";
import { UserSettingData } from "../game/user-settings/user-setting-store";
import { IHandler } from "../shared";
import { GameUtils, StorageManager, localStorageKeys, sentryLogger } from "../shared/utils";
import { AppStore } from "./app-store";

export namespace AppHandlers {
    @injectable()
    export class BackToOperatorLobby implements IHandler<void> {
        constructor(@inject(AppStore) private readonly appStore: AppStore) {}
        handle() {
            const returnUrl = this.appStore.urlInfo?.returnUrl;
            if (returnUrl) {
                try {
                    const decodedReturnUrl = GameUtils.base64Decode(returnUrl);
                    if (this.appStore.isDirectMode) {
                        window.location.replace(decodedReturnUrl);
                    } else {
                        const sessionInfo = StorageManager.get(localStorageKeys.session) as ISessionInfo;
                        const playerSetting = StorageManager.get(localStorageKeys.playerSetting) as UserSettingData;
                        const params = {
                            ss: sessionInfo?.session,
                            time: new Date(sessionInfo?.ssoTime).getTime(),
                            musicEnable: playerSetting?.musicEnable ?? true,
                            sfxEnable: playerSetting?.sfxEnable ?? true,
                            username: sessionInfo?.username,
                            isAuthenticated: sessionInfo?.isAuthenticated,
                            memberName: sessionInfo?.memberName,
                        };
                        const urlParams = new URLSearchParams();
                        Object.keys(params).forEach((key) => params[key] !== undefined && urlParams.append(key, params[key]));
                        const encodedQueryString = GameUtils.base64Encode(urlParams.toString());
                        console.log("--------------------encodedQueryString", `${decodedReturnUrl}?params=${encodedQueryString}`);

                        window.location.replace(`${decodedReturnUrl}?params=${encodedQueryString}`);
                    }
                } catch (err) {
                    sentryLogger.logError(err);
                }
            }
        }
    }
}
