import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { UMInfo, SSOResponse, Response } from "sc-user-service-client/dist/auth";

@injectable()
export class AuthStore {
    isAuthenticated: boolean = false;
    username: string | null = null;
    language: string | null = null;
    session: string | null = null;
    system: number = 0;
    memberName: string | null = null;
    isUM: boolean = false;
    umInfo: UMInfo | null = null;
    isAuthorized?: boolean = null;
    isSessionTimeout: boolean = false;
    browserUserAgent: string;
    isDisabledAccount: boolean = false;
    errorCode: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setUM(umInfo: UMInfo) {
        this.isUM = true;
        this.umInfo = umInfo;
    }

    setAuthSSOStore(response: SSOResponse) {
        this.isAuthenticated = response.isAuthenticated;
        this.username = response.username;
        this.language = response.language;
        this.session = response.ss;
        this.system = response.system;
        this.memberName = response.memberName;
    }

    signOut() {
        this.username = null;
        this.session = null;
        this.isAuthenticated = false;
        this.isSessionTimeout = true;
    }
}
