import { inject, injectable } from "inversify";
import { PFVerificationStore } from "./pf-verification-store";
import { IHandler } from "../../shared";

@injectable()
export class PFVerificationHandler implements IHandler<boolean> {
    constructor(@inject(PFVerificationStore) protected readonly pfVerificationStore: PFVerificationStore) {}

    handle(openVerification: boolean) {
        this.pfVerificationStore.openVerificationPopup = openVerification;
    }
}
