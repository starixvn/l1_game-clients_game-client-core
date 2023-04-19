import gc from "game-client-base";
import mobx from "mobx";
import Observer from "observer";

export function startGame(namespace: string, containerOptions: gc.IContainerOptions) {
    const container = gc.getContainer(containerOptions);

    Observer.configure({ [namespace]: { mobx, container } });

    return container;
}

export function getSharedContainer(configs: gc.SiteConfigs.Configs) {
    const containerOptions: gc.IContainerOptions = {
        onContainerCreated: (container) => {
            container.bind(gc.SiteConfigs.Configs).toConstantValue(configs);
        },
        enabledFeatures: [gc.Player.FEATURE_NAME, gc.Auth.FEATURE_NAME],
    };

    return gc.getContainer(containerOptions);
}
