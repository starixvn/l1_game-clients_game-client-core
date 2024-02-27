import { inject, injectable } from "inversify";
import { PFVerificationStore } from "./pf-verification-store";

@injectable()
export class PFVerificationHandler {
    constructor(@inject(PFVerificationStore) protected readonly pfVerificationStore: PFVerificationStore) {}
    handleVerificationPopup(openVerification: boolean) {
        this.pfVerificationStore.openVerificationPopup = openVerification;
    }
}
