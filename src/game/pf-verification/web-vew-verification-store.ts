import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

@injectable()
export class WebViewPFVerificationStore {
    url = "";

    openVerificationPopup = false;

    constructor() {
        makeAutoObservable(this);
    }
}
