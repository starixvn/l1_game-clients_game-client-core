import { getSharedContainer } from "db://shared-components/startup";
import { siteConfigs } from "./site-configs";

export const sharedContainer = getSharedContainer(siteConfigs);
