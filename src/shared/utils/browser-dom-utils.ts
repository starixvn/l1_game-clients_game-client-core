import { GameUtils } from "./game-utils";
import { StorageManager, localStorageKeys } from "./storage-manager";

export class BrowserDomUtils {
    public static replaceParentLocation(url: string) {
        this.postMessageToParent({ replaceUrl: url });
    }

    public static postMessageToParent(data: unknown) {
        const parentUrl = StorageManager.get(localStorageKeys.parentUrl)?.toString();
        if (parentUrl) {
            const url = GameUtils.base64Decode(parentUrl);
            window.parent?.postMessage(data, url);
        }
    }

    public static postMessageToParentBoostedOdds(data: unknown) {
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        window.parent?.postMessage(data, url.hostname);
    }
}
