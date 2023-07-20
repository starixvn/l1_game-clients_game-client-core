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
    gameNamespace?: string;
}

export class InterpolationOptions {
    [key: string]: string;
}

export class TranslationManager {
    public defaultLanguageId = "en";
    public options: TranslationOptions;
    public isReady: boolean;
    public polygrot: Polyglot;

    public init(options: TranslationOptions) {
        this.options = options;
        this.loadPolygrot();
        this.isReady = true;
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

    public async changeLanguage(languageId: string) {
        if (languageId == null || languageId === "") {
            return;
        }

        this.options.languageId = languageId;
        this.loadPolygrot();

        if (this.options.isUseTolgeeRealTime) {
            await this.options.tg.changeLanguage(languageId);
        }
    }

    public loadPolygrot() {
        if (!this.options.isUseTolgeeRealTime) {
            const languageData = this.options.getStaticData(this.options.languageId);
            this.polygrot = new Polyglot({ phrases: languageData, allowMissing: true });
        }
    }

    public translate(key: string, options?: InterpolationOptions) {
        try {
            if (this.options != null) {
                if (this.options.isUseTolgeeRealTime) {
                    return this.getTolgeeTranslation(key, options);
                } else {
                    return this.getDataTranslation(key, options);
                }
            }
        } catch (e) {
            console.log(e);
        }

        return `Not Options: ${key}`;
    }

    public t = this.translate;

    private getTolgeeTranslation(key: string, options: InterpolationOptions) {
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
        return this.options.tg.t(key, `Not found: ${key}`, translateOptions);
    }

    private getDataTranslation(key: string, options?: InterpolationOptions) {
        if (this.options.getStaticData == null || key == null || key === "") {
            return `Data null: ${key}`;
        }

        return this.polygrot.t(key, options);
    }

    private toLanguageId(languageCode: string) {
        const languageMapping = {
            "vi-VN": "vi",
            "en-US": "en",
            "en-UK": "en",
            "th-TH": "th",
            "id-ID": "id",
            "zh-CN": "zh_cn",
            "zh-TW": "zh_tw",
        };

        return languageMapping[languageCode] || this.defaultLanguageId;
    }

    public getLanguageId() {
        let languageId = localStorage.getItem(`current_language`) ?? this.defaultLanguageId;

        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.has("lang")) {
            languageId = this.toLanguageId(urlParams.get("lang"));
        } else if (urlParams.has("params")) {
            const decodedParams = new URLSearchParams(atob(urlParams.get("params")));
            if (decodedParams.has("lang")) {
                languageId = this.toLanguageId(decodedParams.get("lang"));
            }
        }

        if (this.options && !this.options.availableLanguages?.includes(languageId)) {
            return this.defaultLanguageId;
        }

        return languageId;
    }

    public loadTranslationResource() {
        const languageId = this.getLanguageId();
        localStorage.setItem(`current_language`, languageId);

        console.log("Loaded language:" + languageId);
        this.changeLanguage(languageId);
    }

    public gameTranslate(key: string, options?: InterpolationOptions) {
        if (this.options.gameNamespace) {
            return this.translate(`${this.options.gameNamespace}.${key}`, options);
        }

        return this.translate(key, options);
    }

    public commonTranslate(key: string, options?: InterpolationOptions) {
        if (this.options.gameNamespace) {
            return this.translate(`Common.${key}`, options);
        }

        return this.translate(key, options);
    }
}

export const Translator = new TranslationManager();
