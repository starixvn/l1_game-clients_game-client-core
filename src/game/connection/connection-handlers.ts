import { inject, injectable } from "inversify";
import { io } from "socket.io-client/dist/socket.io.js";
import { SiteConfigs } from "../../configs";
import { GameClientEmitMessage, IHandler } from "../../shared";
import { UrlUtils } from "../../shared/utils";
import { GameSetting } from "../game-configs";
import { RoundRunningHandlers, RoundTimeStore } from "../rounds";
import { ConnectionStore } from "./connection-store";

interface ISocketOption {
    socketUri: string;
    proxyRoute?: string;
    forceNew?: boolean;
    enableMsgpackParser?: boolean;
    transports?: string[];
    upgrade?: boolean;
    path?: string;
    extraHeaders?: object;
}

export namespace ConnectionHandlers {
    @injectable()
    export class ConnectHandler {
        constructor(
            @inject(ConnectionStore) protected readonly store: ConnectionStore,
            @inject(SiteConfigs) protected readonly siteConfigs: SiteConfigs,
            @inject(GameSetting) protected readonly gameSetting: GameSetting
        ) {}

        handle(customizeOptions?: ISocketOption) {
            const gameId = this.gameSetting.id;
            const socketUri = UrlUtils.buildServerUrl("http", `${this.siteConfigs.websocket.proxyPath}`, gameId, this.siteConfigs);
            const optionsDefault = {
                path: UrlUtils.getProxyRoute(this.siteConfigs),
                socketUri,
                transports: ["websocket"],
                upgrade: false,
                forceNew: true,
                parser: this.siteConfigs.enableMsgpackParserAllGames,
            };
            const options = { ...optionsDefault, ...customizeOptions };
            this.store.connection = io(options.socketUri, options);
            this.store.initBaseListener();
        }
    }

    @injectable()
    export class InGameHandler implements IHandler<void> {
        constructor(
            @inject(ConnectionStore) private readonly connectionStore: ConnectionStore,
            @inject(RoundTimeStore) private readonly roundTimeStore: RoundTimeStore,
            @inject(RoundRunningHandlers) private readonly roundRunning: RoundRunningHandlers
        ) {}

        handle() {
            this.roundTimeStore.resetRoundTimeStore();
            this.roundRunning.stopRunner();
            this.connectionStore.send(GameClientEmitMessage.inGame, null);
        }
    }
}
