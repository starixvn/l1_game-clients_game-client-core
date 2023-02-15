export type MakeObservableFn = <Store>(store: Store, ...params: any[]) => void;

export class Store {
  constructor(makeObservable: MakeObservableFn) {
    makeObservable(this);
  }
}
