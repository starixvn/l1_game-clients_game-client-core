import gc from "game-client-base";
import mobx from "mobx";
import Observer from "observer";

export function startGame(namespace: string, containerOptions: gc.IContainerOptions) {
    const container = gc.getContainer(containerOptions);

    Observer.configure({ [namespace]: { mobx, container } });

    return container;
}

export function getSharedContainer(userServiceUrl: string) {
    const userService = new gc.Auth.UserService(userServiceUrl);

    const containerOptions: gc.IContainerOptions = {
        onContainerCreated: (container) => {
            container.bind(gc.Auth.UserService).toConstantValue(userService);
        },
        enabledFeatures: [gc.Player.FEATURE_NAME, gc.Auth.FEATURE_NAME],
    };

    return gc.getContainer(containerOptions);
}
