import { Container } from "inversify";

const containers: { [id: string]: Container } = {};

export const getContainer = (moduleName: string = "default"): Container => {
    if (containers[moduleName]) {
        return containers[moduleName];
    }

    containers[moduleName] = new Container({
        autoBindInjectable: true,
        defaultScope: "Singleton"
    });

    return containers[moduleName];
};
