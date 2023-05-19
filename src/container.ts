import { Container } from "inversify";
import * as Auth from "./auth";
import * as SiteConfigs from "./configs";
import * as Game from "./game";
import * as Players from "./players";
import * as Notification from "./notification";
import * as UnderMaintenance from "./under-maintenance";
import { FeatureLoader } from "./shared";

export interface IContainerOptions {
    onContainerCreated?: (container: Container) => void;

    disabledFeatures?: string[];

    enabledFeatures?: string[];

    globalContainer?: Container;
}

function serializeOptions(input: IContainerOptions): IContainerOptions {
    const defaultOptions: IContainerOptions = {
        onContainerCreated: () => {},
        disabledFeatures: [],
        globalContainer: null,
        enabledFeatures: [],
    };

    return Object.assign(defaultOptions, input);
}

export function getContainer(options: IContainerOptions = {}) {
    const { onContainerCreated, disabledFeatures, globalContainer, enabledFeatures } = serializeOptions(options);

    const container = new Container({
        autoBindInjectable: true,
        defaultScope: "Singleton",
    });

    container.parent = globalContainer;

    onContainerCreated(container);

    const featureLoaderOptions: FeatureLoader.IFeatureLoaderOptions = {
        container: container,
        disabledFeatures: disabledFeatures,
        enabledFeatures: enabledFeatures,
        features: [Auth, Players, SiteConfigs, Game, Notification, UnderMaintenance],
    };

    FeatureLoader.loadFeatures(featureLoaderOptions);

    return container;
}
