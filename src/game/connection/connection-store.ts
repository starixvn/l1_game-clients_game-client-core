import { inject, injectable } from "inversify";
import { ISessionInfo } from "../../auth";
import { GameClientEmitMessage, Mediator } from "../../shared";
import { StorageManager, localStorageKeys } from "../../shared/utils";
import { GameSetting } from "../game-configs";
import { SocketConnectionStore } from "../../socket-connection";

export const GameServiceEvent = {
    signedIn: "signedIn",
};
@injectable()
export class ConnectionStore extends SocketConnectionStore {
    constructor(@inject(Mediator) protected readonly mediator: Mediator, @inject(GameSetting) protected readonly gameSetting: GameSetting) {
        super(mediator);
    }
    signedIn = false;

    initBaseListener() {
        if (this.connection) {
            super.initBaseListener();
            this.connection.on(GameServiceEvent.signedIn, this.onSignedIn.bind(this));
        }
    }

    onConnected() {
        super.onConnected();
        this.connection.onAny(this.onHandleData.bind(this));
        this.signIn();
    }

    onHandleData(event: string, value: any) {
        if (event?.toLocaleLowerCase() === this.gameSetting?.name.toLocaleLowerCase() || event?.toLocaleLowerCase() === "message") {
            Object.entries(value).forEach((entry) => {
                const [key, value] = entry;
                this.mediator.emit(key, value);
            });
        } else {
            this.mediator.emit(event, value);
        }
    }

    signIn() {
        const payload = new GameClientEmitMessage.Signin();
        const sessionInfo = StorageManager.get(localStorageKeys.session) as ISessionInfo;
        payload.ss = sessionInfo?.session;
        payload.username = sessionInfo?.username;
        payload.system = sessionInfo?.system;

        this.send(GameClientEmitMessage.Signin.eventName, payload);
    }

    onSignedIn() {
        this.signedIn = true;
    }

    send(eventName: string, data: any) {
        this.connection?.emit(eventName, data);
    }
}
