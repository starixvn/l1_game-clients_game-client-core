import { inject, injectable } from "inversify";
import { io } from "socket.io-client/dist/socket.io.js";
import { GameClientEmitMessage, IHandler } from "../../shared";
import { ConnectionStore } from "./connection-store";
import { AuthStore } from "../../auth/auth-store";

export namespace ConnectionHandlers {
    @injectable()
    export class ConnectHandler {
        constructor(@inject(ConnectionStore) protected readonly store: ConnectionStore) {}

        handle(options) {
            this.store.connection = io(options.socketUri, options.infor);
            this.store.initBaseListener();
        }
    }

    @injectable()
    export class SignInHandler implements IHandler<{ session: string; username: string; system?: number }> {
        constructor(
            @inject(ConnectionStore) private readonly connectionStore: ConnectionStore,
            @inject(AuthStore) private readonly authStore: AuthStore
        ) {}

        handle({ session = "", username = "", system = 0 }) {
            const payload = new GameClientEmitMessage.Signin();
            payload.ss = session || this.authStore.session;
            payload.username = username || this.authStore.username;
            payload.system = system || this.authStore.system;
            payload.currency = "$US";
            payload.isAuthenticated = true;

            this.connectionStore.send(GameClientEmitMessage.Signin.eventName, payload);
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
