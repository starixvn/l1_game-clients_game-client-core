import { inject, injectable } from "inversify";
import { IHandler } from "../../shared";
import { ChipUIStore } from "./chip-ui-store";

@injectable()
export class ChipUIHandler implements IHandler<void> {
    constructor(@inject(ChipUIStore) private readonly chipUIStore: ChipUIStore) {}

    async handle() {}
}
