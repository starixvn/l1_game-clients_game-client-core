import { inject, injectable } from "inversify";
import { io } from "socket.io-client/dist/socket.io.js";
import { GameClientEmitMessage, IHandler } from "../../shared";
import { UrlUtils } from "../../shared/utils";
import { Configs, GameConfigurationStore } from "../../site-configs";
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
            @inject(GameConfigurationStore) protected readonly configurationStore: GameConfigurationStore,
            @inject(Configs) protected readonly config: Configs,
            @inject(GameSetting) protected readonly gameSetting: GameSetting
        ) {}

        handle(options: ISocketOption) {
            const gameId = this.gameSetting.id;
            const gameConfiguration = this.configurationStore.getGameConfigurationWithGameId(gameId);
            console.log("gameConfiguration hanlde ", gameConfiguration);
            const socketUri = UrlUtils.buildServerUrl("http", "", gameId, this.config, gameConfiguration.key);
            const optionalOptions = {
                proxyRoute: UrlUtils.getProxyRoute(gameConfiguration, this.config.env),
                socketUri,
            };
            const mergeOptions = { ...options, ...optionalOptions };
            console.log("mergeOptions ", mergeOptions);
            this.store.connection = io(options.socketUri, mergeOptions);
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
