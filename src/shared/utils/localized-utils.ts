import { l10n } from "../l10n";

export namespace LocalizedUtils {
    export function getBetChoiceString(choice: string) {
        return LocalizedUtils.getLocalizedText(`choice_${choice}`);
    }
    export function getGameNameString(gameId: number) {
        return LocalizedUtils.getLocalizedText(`gameNames.${gameId}`);
    }
    export function getLocalizedText(key: string, option?: any) {
        return l10n.t(key, option);
    }
}
