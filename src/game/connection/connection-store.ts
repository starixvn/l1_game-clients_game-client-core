import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { Socket, io } from "socket.io-client/dist/socket.io.js";
import { io as ioMsgPack } from "socket.io-client/dist/socket.io.msgpack.min.js";
import { ISessionInfo } from "../../auth";
import { SiteConfigs } from "../../configs/site-configs";
import { GameClientEmitMessage, Mediator } from "../../shared";
import { SocketEvents } from "../../shared/constants/socket-event";
import { BrowserDomUtils, StorageManager, UrlUtils, localStorageKeys, sentryLogger } from "../../shared/utils";
import { GameSetting } from "../game-configs";

export const events = {
    ...SocketEvents,
    ...{
        signedIn: "signedIn",
    },
};

export interface ISocketOption {
    socketUri: string;
    proxyRoute?: string;
    forceNew?: boolean;
    enableMsgpackParser?: boolean;
    transports?: string[];
    upgrade?: boolean;
    path?: string;
    extraHeaders?: object;
}

@injectable()
export class ConnectionStore {
    constructor(
        @inject(Mediator) protected readonly mediator: Mediator,
        @inject(GameSetting) protected readonly gameSetting: GameSetting,
        @inject(SiteConfigs) protected readonly siteConfigs: SiteConfigs
    ) {
        makeAutoObservable(this);
    }

    connection: Socket = null;
    isConnected: boolean = null;
    isConnectFailed = false;
    signedIn = false;

    initConnection(customizeOptions?: ISocketOption) {
        this.reset();

        const gameId = this.gameSetting.id;
        const socketUri = UrlUtils.buildServerUrl("http", `${this.siteConfigs.websocket.proxyPath}`, gameId, this.siteConfigs);
        const optionsDefault: ISocketOption = {
            path: UrlUtils.getProxyRoute(this.siteConfigs),
            socketUri,
            transports: ["websocket"],
            upgrade: false,
            forceNew: true,
        };
        const options = { ...optionsDefault, ...customizeOptions };

        if (this.siteConfigs.enableMsgpackParserAllGames) {
            this.connection = ioMsgPack(options.socketUri, options);
        } else {
            this.connection = io(options.socketUri, options);
        }

        this.initBaseListener();
    }

    initBaseListener() {
        if (this.connection) {
            this.connection.on(events.connect, this.onConnected.bind(this));
            this.connection.on(events.signedIn, this.onSignedIn.bind(this));
            this.connection.on(events.connectError, this.onConnectFailed.bind(this));
            this.connection.on(events.connectFailed, this.onConnectFailed.bind(this));
            this.connection.on(events.disconnect, this.onDisconnected.bind(this));
        }
    }

    onConnected() {
        this.isConnected = true;
        this.isConnectFailed = false;
        this.connection.onAny(this.onHandleData.bind(this));
        this.signIn();
    }

    onHandleData(event: string, data: any) {
        if (event?.toLocaleLowerCase() === this.gameSetting?.name.toLocaleLowerCase() || event?.toLocaleLowerCase() === "message") {
            Object.entries(data).forEach((entry) => {
                const [key, value] = entry;
                this.mediator.emit(key, value);
            });
        } else {
            this.mediator.emit(event, data);
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

    onConnectFailed(error?: Error) {
        this.isConnectFailed = true;
        this.onDisconnected();
        error && sentryLogger.logError(error);
    }

    onDisconnected(reason = "") {
        this.setConnectFailed(reason);
        this.isConnected = false;
        this.signedIn = false;
        this.connection.disconnect();
    }

    setConnectFailed(reason = "") {
        if (!reason || reason === "io server disconnect") {
            BrowserDomUtils.postMessageToParent({ isDisconnect: true });
        }
        if (reason && reason !== "io client disconnect") {
            this.isConnectFailed = true;
            sentryLogger.logError(reason);
        }
    }

    send(eventName: string, data: any) {
        this.connection?.emit(eventName, data);
    }

    closeSocket() {
        this.connection?.disconnect();
    }

    reset() {
        this.connection = null;
        this.isConnected = null;
        this.isConnectFailed = false;
        this.signedIn = false;
    }
}
