import { Base64 } from "base64-string";
import { Translator } from "./localization-manager";

declare global {
    interface Window { ReactNativeWebView: any; }
}

export class GameUtils {
    static base64: Base64;

    public static base64Decode(data: string): string {
        if (!GameUtils.base64) {
            GameUtils.base64 = new Base64();
        }
        return GameUtils.base64.decode(data);
    }

    public static base64Encode(data: string): string {
        if (!GameUtils.base64) {
            GameUtils.base64 = new Base64();
        }
        return GameUtils.base64.encode(data);
    }

    public static async copyToClipboard(data: string, isAndroid: boolean, callback: (message: string) => void): Promise<void> {
        const showResult = (message: string) => {
            callback(message);
        }

        try {
            if(this.isAndroidWebView(isAndroid)){
                window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'copy_to_clipboard', data: data}));
                showResult(Translator.commonTranslate("copy_successfully_md5"));
            }
            else{
                await navigator.clipboard.writeText(data).then(() => {
                    showResult(Translator.commonTranslate("copy_successfully_md5"));
                });
            }           
        } catch (e) {
            showResult(Translator.commonTranslate("copy_failed_md5")); //e.message
        }
    }

    public static isAndroidWebView(isAndroid: boolean): boolean {
        return isAndroid && window.ReactNativeWebView;
    }

}
