import { getContainer } from "../../src/container";

const container = getContainer();
const makeObservable = jest.fn();
container.bind("makeObservable").toFunction(makeObservable);

export default container;
