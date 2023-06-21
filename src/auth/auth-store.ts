import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { SSOResponse } from "sc-user-service-client/dist/auth";
import { URLParams } from "../shared/constants/url-params";
import { StorageManager, localStorageKeys } from "../shared/utils";

export interface ISessionInfo {
    isAuthenticated: boolean;
    username: string;
    language: string;
    session: string;
    system: number;
    memberName?: string;
    ssoTime?: Date;
}

@injectable()
export class AuthStore {
    isAuthenticated = false;
    username = "";
    language = "";
    session = "";
    system = 0;
    memberName = "";
    isAuthorized?: boolean = null;
    browserUserAgent = "";
    isDisabledAccount = false;
    errorCode = "";
    ssoErrorMessage = "";
    ssoTime: Date;

    constructor() {
        makeAutoObservable(this);
    }

    getSessionInfo(): ISessionInfo {
        return {
            isAuthenticated: this.isAuthenticated,
            username: this.username,
            language: this.language,
            session: this.session,
            system: this.system,
            memberName: this.memberName,
            ssoTime: this.ssoTime,
        };
    }

    signOut() {
        this.username = null;
        this.session = null;
        this.isAuthenticated = false;
        StorageManager.remove(localStorageKeys.session);
    }

    setAuthSSOStore(response: SSOResponse) {
        this.session = response.ss;
        this.setAuthStore(response);
    }

    setAuthStoreFromStorage(response: ISessionInfo) {
        this.session = response.session;
        this.setAuthStore(response);
    }

    setAuthStoreFromUrlParam(urlParams: URLSearchParams) {
        const sessionInfo: ISessionInfo = {
            isAuthenticated: true,
            session: urlParams.get(URLParams.session),
            username: urlParams.get(URLParams.username),
            language: urlParams.get(URLParams.language),
            system: +urlParams.get(URLParams.appType),
        };
        this.setAuthStoreFromStorage(sessionInfo);
    }

    private setAuthStore(response: ISessionInfo | SSOResponse) {
        this.isAuthenticated = response.isAuthenticated;
        this.username = response.username;
        this.language = response.language;
        this.system = +response.system;
        response.memberName && (this.memberName = response.memberName);
        this.ssoTime = new Date();
    }
}
