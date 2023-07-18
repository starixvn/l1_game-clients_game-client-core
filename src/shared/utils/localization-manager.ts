import { TolgeeInstance, TranslateOptions } from "@tolgee/web";

export class TranslationOptions {
    languageId: string;
    isUseTolgeeRealTime: boolean;
    tg?: TolgeeInstance;
    getStaticData?: (languageId) => {
        [key: string]: {
            [key: string]: {
                [key: string]: string;
            };
        };
    };
    onLoaded?: () => void;
    availableLanguages?: string[];
}

export class TranslationManager {
    public static defaultLanguageId = "en";
    public static options: TranslationOptions;
    public static isReady: boolean;

    public static init(options: TranslationOptions) {
        TranslationManager.options = options;
        TranslationManager.isReady = true;
        if (options.isUseTolgeeRealTime) {
            options.tg.run();
            options.tg.on("initialLoad", () => {
                options.onLoaded && options.onLoaded();
            });
        } else {
            options.onLoaded && options.onLoaded();
        }
        localStorage.setItem(`current_language`, TranslationManager.options.languageId);
    }

    public static async changeLanguage(languageId: string) {
        if (languageId == null || languageId === "") {
            return;
        }

        TranslationManager.options.languageId = languageId;

        if (TranslationManager.options.isUseTolgeeRealTime) {
            await TranslationManager.options.tg.changeLanguage(languageId);
        }
    }

    public static translate(key: string) {
        try {
            if (TranslationManager.options != null) {
                if (TranslationManager.options.isUseTolgeeRealTime) {
                    return TranslationManager.getTolgeeTranslation(key);
                } else {
                    return TranslationManager.getStaticDataTranslation(key);
                }
            }
        } catch (e) {
            console.log(e);
        }

        return `Not Options: ${key}`;
    }

    private static getTolgeeTranslation(key: string) {
        let options: TranslateOptions;
        if (key.indexOf(".") > 0 && options == null) {
            const splittedKeyItems = key.split(".");
            if (splittedKeyItems.length > 1) {
                options = {
                    ns: splittedKeyItems[0],
                };

                key = splittedKeyItems[1];
            }
        }
        return TranslationManager.options.tg.t(key, `Not found: ${key}`, options);
    }

    private static getStaticDataTranslation(key: string) {
        if (TranslationManager.options.getStaticData == null || key == null || key === "") {
            return `Data null: ${key}`;
        }

        const languageData = TranslationManager.options.getStaticData(TranslationManager.options.languageId);
        const splittedKeyItems = key.split(".");

        if (splittedKeyItems.length > 1 && languageData[splittedKeyItems[0]]) {
            return languageData[splittedKeyItems[0]][splittedKeyItems[1]];
        }

        return `Not found: ${key}`;
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
}
