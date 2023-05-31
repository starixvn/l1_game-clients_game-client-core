import { injectable } from "inversify";
@injectable()
export class DisabledGameStore {
    disabled = false;
    showPopup = false;

    setGameStatus(disabled: boolean) {
        this.disabled = disabled;
    }

    setShowPopup(showPopup: boolean) {
        this.showPopup = showPopup;
    }
}
