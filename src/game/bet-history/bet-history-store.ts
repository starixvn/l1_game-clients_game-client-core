import { injectable } from "inversify";

@injectable()
export class BetHistoryStore {
    page = 1;
    pageSize = 8;
    totalItems = 0;
    betLog: Array<any>;
}
