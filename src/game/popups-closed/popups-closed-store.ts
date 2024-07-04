import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

@injectable()
export class PopupsClosedStore {
    constructor() {
        makeAutoObservable(this);
    }
    forceClosed = null;
}
