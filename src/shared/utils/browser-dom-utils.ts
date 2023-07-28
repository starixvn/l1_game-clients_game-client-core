import { GameUtils } from "./game-utils";
import { StorageManager, localStorageKeys } from "./storage-manager";

export class BrowserDomUtils {
    public static replaceParentLocation(url: string) {
        parent.location.replace(url);
    }

    public static postMessageToParent(data: unknown) {
        const returnUrl = StorageManager.get(localStorageKeys.returnUrl)?.toString();
        if (returnUrl) {
            const url = GameUtils.base64Decode(returnUrl);
            window.parent?.postMessage(data, url);
        }
    }
}
