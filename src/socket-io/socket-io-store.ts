import { injectable, inject } from "inversify";
import { makeAutoObservable } from "mobx";

@injectable()
export class SocketIOStore {
    constructor() {
        makeAutoObservable(this);
    }

    connection: any = {};

    // connection: {
    //   status
    // }
}
