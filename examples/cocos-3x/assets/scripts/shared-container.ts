import { getSharedContainer } from "db://shared-components/scripts/startup";
import mobx from "mobx";
import Observer from "observer";
import { siteConfigs } from "./configs";

export const sharedContainer = getSharedContainer(siteConfigs);

Observer.configure({ default: { mobx, container: sharedContainer } });
