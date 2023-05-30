import { l10n } from "../l10n";

export namespace LocalizedUtils {
    export function getBetChoiceString(choice: string) {
        return choice;
    }
    export function getGameNameString(gameId: number) {
        return gameId.toString();
    }
    export function getLocalizedText(key: string, option?: any) {
        return l10n.t(key, option);
    }
}
