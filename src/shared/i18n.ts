
import {TranslationManager, InterpolationOptions} from './utils/localization-manager';

export const i18n = {
    t: (key: string, options?: InterpolationOptions) => {
        return TranslationManager.translate(key, options);
    }
}
