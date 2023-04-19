import { getSharedContainer } from "db://shared-components/startup";
import mobx from "mobx";
import Observer from "observer";
import { siteConfigs } from "./site-configs";

export const sharedContainer = getSharedContainer(siteConfigs);

Observer.configure({ default: { mobx, container: sharedContainer } });
