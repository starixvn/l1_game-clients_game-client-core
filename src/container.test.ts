import { container } from "./container";

export const makeObservable = jest.fn();

container.bind("makeObservable").toFunction(makeObservable);

export default container;
