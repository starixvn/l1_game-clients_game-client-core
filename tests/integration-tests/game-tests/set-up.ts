import { AuthHandlers } from "../../../src/auth";
import { ConnectionHandlers } from "../../../src/game/connection";
import { socketClient } from "../stubs/connection";
import { container } from "../stubs/container";
import { normalPlayer } from "../stubs/player";

export const sso = async () => {
    const urlParams = new URLSearchParams(`token=${normalPlayer}&appType=1&rurl=aHR0cHM6Ly9nYW1lLmNvbQ==`); // rurl = https://game.com
    const ssoHandler = container.resolve(AuthHandlers.SSO);
    await ssoHandler.handle(urlParams);
};

export const connectToService = () => {
    const connectHandler = container.resolve(ConnectionHandlers.ConnectHandler);
    connectHandler.handle({ rejectUnauthorized: false } as any);
    socketClient.emit("connect");
};
