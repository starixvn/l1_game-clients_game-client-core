import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { UMInfo } from "sc-user-service-client/dist/auth";
import { ISessionInfo } from "../auth/auth-store";
import { AppTypes } from "../shared/constants/app-type";
import { StorageManager, localStorageKeys } from "../shared/utils";

interface IUrlInfo {
    returnUrl?: string;
    ref?: string;
    directGameId?: string;
}

interface IDirectMode {
    session: string;
    isDirectMode: boolean;
    urlInfo: IUrlInfo;
}

@injectable()
export class AppStore {
    isUM = false;
    umInfo: UMInfo | null = null;
    isSessionTimeout = false;
    isDirectMode = false;
    isApp = false;
    urlInfo: IUrlInfo = {};

    constructor() {
        makeAutoObservable(this);
    }

    setUM(umInfo: UMInfo) {
        this.isUM = true;
        this.umInfo = umInfo;
    }

    setURLStore(urlParams: URLSearchParams) {
        const queryStrings = {
            ref: "ref",
            gameId: "gameId",
            returnUrl: "rurl",
            app: "appType",
        };

        if (urlParams.has(queryStrings.ref) && urlParams.has(queryStrings.gameId) && urlParams.get(queryStrings.gameId) !== "0") {
            const gameId = urlParams.get(queryStrings.gameId);
            const refData = urlParams.get(queryStrings.ref);
            if (this.validateRefData(refData)) {
                this.isDirectMode = true;

                this.urlInfo.ref = refData;
                this.urlInfo.directGameId = gameId;
                if (urlParams.has(queryStrings.returnUrl) && urlParams.get(queryStrings.returnUrl) !== "") {
                    this.urlInfo.returnUrl = urlParams.get(queryStrings.returnUrl);
                }
            }
        }

        if (urlParams.has(queryStrings.app) && urlParams.get(queryStrings.app) === AppTypes.App.toString()) {
            this.isApp = true;
        }
    }

    validateRefData(refData) {
        const directRef = ["d_direct", "m_direct", "d_operator_opendirectly", "m_operator_opendirectly"];
        return directRef.some((data) => data === refData);
    }

    saveDirectModeInfo() {
        const sessionInfo = StorageManager.get(localStorageKeys.session) as ISessionInfo;
        const data: IDirectMode = {
            session: sessionInfo.session,
            isDirectMode: this.isDirectMode,
            urlInfo: this.urlInfo,
        };
        StorageManager.set(localStorageKeys.directMode, data);
    }

    loadDirectMode() {
        const data = StorageManager.get(localStorageKeys.directMode) as IDirectMode;
        if (data) {
            const sessionInfo = StorageManager.get(localStorageKeys.session) as ISessionInfo;
            if (sessionInfo.session === data.session) {
                this.isDirectMode = data.isDirectMode;
                this.urlInfo = data.urlInfo;
            }
        }
    }
}
