import gc from "@sg/game-client-base";
import { getSharedContainer } from "db://shared-components/shared/scripts/startup";
import mobx from "mobx";
import mobxLogger from "mobx-logger";
import Observer from "observer";
import { siteConfigs } from "./site-configs";

mobxLogger.enableLogging();

export const sharedContainer = getSharedContainer(siteConfigs);

Observer.configure({ default: { mobx, container: gc.buildObserverContainer(sharedContainer) } });
