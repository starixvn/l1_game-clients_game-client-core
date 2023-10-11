import { Container } from "inversify";

import * as Auth from "./auth";
import * as ChipSetting from "./chip-setting";
import * as SiteConfigs from "./configs";
import * as Game from "./game";
import * as GameCrash from "./game-crash";
import * as Notification from "./notification";
import * as Players from "./players";
import { FeatureLoader } from "./shared";
import * as UnderMaintenance from "./under-maintenance";

import type { AnyConstructor } from "./shared";

export interface IContainerOptions {
    onContainerCreated?: (container: Container) => void;

    disabledFeatures?: string[];

    enabledFeatures?: string[];

    globalContainer?: Container;

    extensions?: Record<string, AnyConstructor | string>[];
}

function serializeOptions(input: IContainerOptions): IContainerOptions {
    const defaultOptions: IContainerOptions = {
        onContainerCreated: () => {},
        disabledFeatures: [],
        globalContainer: null,
        enabledFeatures: [],
        extensions: [],
    };

    return Object.assign(defaultOptions, input);
}

export function getContainer(options: IContainerOptions = {}) {
    const { onContainerCreated, disabledFeatures, globalContainer, enabledFeatures, extensions } = serializeOptions(options);

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
        features: [Auth, Players, SiteConfigs, Game, GameCrash, Notification, UnderMaintenance, ChipSetting, ...extensions],
    };

    FeatureLoader.loadFeatures(featureLoaderOptions);

    return container;
}

export function buildObserverContainer(container: Container) {
    return {
        resolve: (ctor: AnyConstructor) => container.get(ctor),
    };
}
