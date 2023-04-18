import { inject, injectable } from "inversify";
import { io } from "socket.io-client/dist/socket.io.js";
import { GameClientEmitMessage, IHandler } from "../../shared";
import { UrlUtils } from "../../shared/utils";
import { Configs } from "../../site-configs";
import { GameSetting } from "../game-configs";
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
            @inject(Configs) protected readonly configs: Configs,
            @inject(GameSetting) protected readonly gameSetting: GameSetting
        ) {}

        handle(optionsCustomize?: ISocketOption) {
            const gameId = this.gameSetting.id;
            const socketUri = UrlUtils.buildServerUrl("http", "", gameId, this.configs);
            const optionsDefault = {
                path: UrlUtils.getProxyRoute(this.configs),
                socketUri,
                transports: ["websocket"],
                upgrade: false,
                parser: this.configs.enableMsgpackParserAllGames,
            };
            const options = { ...optionsDefault, ...optionsCustomize };
            console.log("mergeOptions ", options);
            this.store.connection = io(options.socketUri, options);
            this.store.initBaseListener();
        }
    }

    @injectable()
    export class InGameHandler implements IHandler<void> {
        constructor(@inject(ConnectionStore) private readonly connectionStore: ConnectionStore) {}

        handle() {
            this.connectionStore.send(GameClientEmitMessage.inGame, null);
        }
    }
}
