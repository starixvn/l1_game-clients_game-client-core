import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

export const events = {
    connect: "connect",
    reconnect: "reconnect",
    connectFailed: "connect_failed",
    connectError: "connect_error",
    disconnect: "disconnect",
    signedIn: "signedIn",
};

export enum Orientation {
    Landscape = 0,
    Portrait,
}

@injectable()
export class OrientationStore {
    constructor() {
        makeAutoObservable(this);
    }

    orientation = Orientation.Landscape;

    get m() {
        return this.orientation + 1;
    }
}
