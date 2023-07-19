import { TolgeeInstance, TranslateOptions } from "@tolgee/web";
import Polyglot from "node-polyglot";

export class TranslationOptions {
    languageId: string;
    isUseTolgeeRealTime: boolean;
    tg?: TolgeeInstance;
    getStaticData?: (languageId) => {
        [key: string]: {
            [key: string]: string;
        };
    };
    onLoaded?: () => void;
    availableLanguages?: string[];
    gameNamespace: string;
}

export class InterpolationOptions {
    [key: string]: string;
}

export class TranslationManager {
    public static defaultLanguageId = "en";
    public static options: TranslationOptions;
    public static isReady: boolean;
    public static polygrot: Polyglot;

    public static init(options: TranslationOptions) {
        TranslationManager.options = options;
        TranslationManager.loadPolygrot(options.languageId);
        TranslationManager.isReady = true;
        if (options.isUseTolgeeRealTime) {
            options.tg.run();
            options.tg.on("initialLoad", () => {
                options.onLoaded && options.onLoaded();
            });
        } else {
            options.onLoaded && options.onLoaded();
        }
        localStorage.setItem(`current_language`, options.languageId);
    }

    public static async changeLanguage(languageId: string) {
        if (languageId == null || languageId === "") {
            return;
        }

        TranslationManager.options.languageId = languageId;
        TranslationManager.loadPolygrot(languageId);

        if (TranslationManager.options.isUseTolgeeRealTime) {
            await TranslationManager.options.tg.changeLanguage(languageId);
        }
    }

    public static loadPolygrot(languageId) {
        const languageData = TranslationManager.options.getStaticData(TranslationManager.options.languageId);
        TranslationManager.polygrot = new Polyglot({ phrases: languageData, allowMissing: true });
    }

    public static translate(key: string, options?: InterpolationOptions) {
        try {
            if (TranslationManager.options != null) {
                if (TranslationManager.options.isUseTolgeeRealTime) {
                    return TranslationManager.getTolgeeTranslation(key, options);
                } else {
                    return TranslationManager.getStaticDataTranslation(key, options);
                }
            }
        } catch (e) {
            console.log(e);
        }

        return `Not Options: ${key}`;
    }

    public static t = TranslationManager.translate;

    private static getTolgeeTranslation(key: string, options: InterpolationOptions) {
        let translateOptions: TranslateOptions;
        if (key.indexOf(".") > 0 && translateOptions == null) {
            const splittedKeyItems = key.split(".");
            if (splittedKeyItems.length > 1) {
                translateOptions = {
                    ns: splittedKeyItems[0],
                };

                key = splittedKeyItems[1];
            }
        }
        return TranslationManager.options.tg.t(key, `Not found: ${key}`, translateOptions);
    }

    private static getStaticDataTranslation(key: string, options: InterpolationOptions) {
        if (TranslationManager.options.getStaticData == null || key == null || key === "") {
            return `Data null: ${key}`;
        }

        return TranslationManager.polygrot.t(key, options);
    }

    private static toLanguageId(languageCode: string) {
        const languageMapping = {
            "vi-VN": "vi",
            "en-US": "en",
            "en-UK": "en",
            "th-TH": "th",
            "id-ID": "id",
            "zh-CN": "zh_cn",
            "zh-TW": "zh_tw",
        };

        return languageMapping[languageCode] || TranslationManager.defaultLanguageId;
    }

    public static getLanguageId() {
        let languageId = localStorage.getItem(`current_language`) ?? TranslationManager.defaultLanguageId;

        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.has("lang")) {
            languageId = TranslationManager.toLanguageId(urlParams.get("lang"));
        } else if (urlParams.has("params")) {
            const decodedParams = new URLSearchParams(atob(urlParams.get("params")));
            if (decodedParams.has("lang")) {
                languageId = TranslationManager.toLanguageId(decodedParams.get("lang"));
            }
        }

        if (TranslationManager.options && !TranslationManager.options.availableLanguages.includes(languageId)) {
            return TranslationManager.defaultLanguageId;
        }

        return languageId;
    }

    public static loadTranslationResource() {
        const languageId = TranslationManager.getLanguageId();
        localStorage.setItem(`current_language`, languageId);

        console.log("Loaded language:" + languageId);
        TranslationManager.changeLanguage(languageId);
    }

    public static gameTranslate(key: string, options: InterpolationOptions) {
        if (TranslationManager.options.gameNamespace) {
            return TranslationManager.translate(`${TranslationManager.options.gameNamespace}.${key}`, options);
        }

        return TranslationManager.translate(key, options);
    }

    public static commonTranslate(key: string, options: InterpolationOptions) {
        if (TranslationManager.options.gameNamespace) {
            return TranslationManager.translate(`Common.${key}`, options);
        }

        return TranslationManager.translate(key, options);
    }
}
