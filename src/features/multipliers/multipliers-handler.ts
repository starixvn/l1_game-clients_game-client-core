import { inject, injectable } from "inversify";
import { IHandler, IMultipleHandlers } from "../../shared/mediator";
import { MultiplierData } from "./multipliers-define";
import { MultipliersStore } from "./multipliers-store";

@injectable()
export class MultipliersHandlers<T> implements IMultipleHandlers {
    constructor(@inject(MultipliersStore) private readonly multipliersStore: MultipliersStore<T>) {}
    eventHandleList: IHandler<any, any>[] = [
        {
            name: "multipliers",
            handle: this.handle,
        },
    ];

    handle(multipliers: MultiplierData<T>[]) {
        if (multipliers) {
            this.multipliersStore.multipliers = multipliers;
        }
    }
}
