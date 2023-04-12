import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { UMInfo, SSOResponse, Response } from "sc-user-service-client/dist/auth";

@injectable()
export class AuthStore {
    isAuthenticated: boolean = false;
    username: string | null = null;
    language: string | null = null;
    ss: string | null = null;
    system: number = 0;
    memberName: string | null = null;
    isUM: boolean = false;
    umInfo: UMInfo | null = null;
    isAuthorized?: boolean = null;
    isSessionTimeout: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    updateUM(umInfo: UMInfo) {
        this.isUM = true;
        this.umInfo = umInfo;
    }

    updateAuthSSOStore(authData: SSOResponse) {
        this.isAuthenticated = authData.isAuthenticated;
        this.username = authData.username;
        this.language = authData.language;
        this.ss = authData.ss;
        this.system = authData.system;
        this.memberName = authData.memberName;
    }

    signOut() {}
}
