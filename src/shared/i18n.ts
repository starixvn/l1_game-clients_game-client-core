
import { InterpolationOptions, Translator } from './utils/localization-manager';

export const i18n = {
    t: (key: string, options?: InterpolationOptions) => {
        return Translator.translate(key, options);
    }
}
