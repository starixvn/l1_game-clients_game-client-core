import { injectable } from "inversify";

@injectable()
export class DisabledGameStore {
    disabled = false;

    setGameStatus(disabled: boolean) {
        this.disabled = disabled;
    }
}
