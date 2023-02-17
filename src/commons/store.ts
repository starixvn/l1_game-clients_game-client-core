import { inject, injectable } from "inversify";

export type MakeObservableFn = <Store>(store: Store, ...params: any[]) => void;

@injectable()
export class Store {
  constructor(@inject("makeObservable") makeObservable: MakeObservableFn) {
    makeObservable(this);
  }
}
