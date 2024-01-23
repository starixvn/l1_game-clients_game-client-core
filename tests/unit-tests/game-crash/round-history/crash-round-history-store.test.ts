import { stub } from "jest-auto-stub";
import { RoundHistoryStore } from "../../../../src/game/round-histories/round-history-store";
import { Md5PopupStore } from "./../../../../src/game-crash/md5-popup/md5-popup-store";
import { CrashRoundHistoryStore } from "./../../../../src/game-crash/round-history/crash-round-history-store";
import { RoundStore } from "./../../../../src/game/rounds/round-store";
import { RoundTimeStore } from "./../../../../src/game/rounds/round-time-store";
import { SettlementStore } from "./../../../../src/game/settlements/settlement-store";

describe("CrashRoundHistoryStore", () => {
    let crashRoundHistoryStore: CrashRoundHistoryStore;
    let roundTimeStore: RoundTimeStore;
    let roundHistoryStore: RoundHistoryStore;
    let roundStore: RoundStore;
    let settlementStore: SettlementStore;
    let md5PopupStore: Md5PopupStore;
    const histories = [
        {
            roundId: 2,
            result: 1.2,
            md5Result: {},
            settlementResult: {},
        },
        {
            roundId: 1,
            result: 1.3,
            md5Result: {},
            settlementResult: {},
        },
    ];

    beforeAll(() => {
        roundTimeStore = stub<RoundTimeStore>();
        roundHistoryStore = stub<RoundHistoryStore>();
        roundStore = stub<RoundStore>();
        settlementStore = stub<SettlementStore>();
        md5PopupStore = stub<Md5PopupStore>();
        Object.defineProperty(roundHistoryStore, "histories", { value: histories, configurable: true, writable: true });
    });

    beforeEach(() => {
        jest.clearAllMocks();
        crashRoundHistoryStore = new CrashRoundHistoryStore(roundTimeStore, roundHistoryStore, roundStore, settlementStore, md5PopupStore);
    });

    describe("roundHistories", () => {
        it("when roundid of last round equal to roundid of first item in histories", () => {
            //Arrange
            const lastRound = {
                roundId: 1,
                result: 1.2,
                md5Result: {},
                settlementResult: {},
            };

            //Act
            const historiesList = crashRoundHistoryStore.roundHistories;

            //Assert
            expect(historiesList).toEqual(histories);
        });

        it("when round time is start round", () => {
            //Arrange
            Object.defineProperty(roundTimeStore, "isStartRound", { value: true, configurable: true, writable: true });

            //Act
            const historiesList = crashRoundHistoryStore.roundHistories;

            //Assert
            expect(historiesList).toEqual(histories);
        });

        it("when roundid of last round not equal to roundid of first item in histories", () => {
            //Arrange
            const lastRound = {
                roundId: 3,
                result: 1.2,
                md5Result: {},
                settlementResult: {},
            };
            Object.defineProperty(roundTimeStore, "isStartRound", { value: false, configurable: true, writable: true });

            //Act
            const historiesList = crashRoundHistoryStore.roundHistories;

            //Assert
            expect(historiesList.length).toEqual(3);
        });
    });

    describe("md5PopupData", () => {
        it("when histories includes round having roundid equal md5 roundid", () => {
            //Arrange
            md5PopupStore.roundId = 1;

            //Act
            const round = crashRoundHistoryStore.md5PopupData;

            //Assert
            expect(round).not.toBeUndefined();
        });

        it("when histories includes round having roundid not equal md5 roundid", () => {
            //Arrange
            md5PopupStore.roundId = 4;

            //Act
            const round = crashRoundHistoryStore.md5PopupData;

            //Assert
            expect(round).toBeUndefined();
        });
    });

    describe("roundIndex", () => {
        it("when histories includes round having roundid not equal md5 roundid", () => {
            //Arrange
            md5PopupStore.roundId = 4;

            //Act
            const index = crashRoundHistoryStore.roundIndex;

            //Assert
            expect(index).toEqual(-1);
        });
    });

    describe("lastRound", () => {
        it("when resultHash is not null", () => {
            //Arrange
            const md5Data = {
                hashValue: "abc",
                rawValue: "def",
            };
            const resultData = {
                result: 2.3,
            };
            Object.defineProperty(roundStore, "resultHash", { value: md5Data, configurable: true, writable: true });
            Object.defineProperty(roundStore, "clientRoundId", { value: 2, configurable: true, writable: true });
            Object.defineProperty(settlementStore, "currentFinish", { value: resultData, configurable: true, writable: true });
            const expectedObj = {
                md5Result: { hashValue: "abc", rawValue: "def" },
                result: 2.3,
                roundId: 2,
                settlementResult: {},
            };

            //Act
            const round = crashRoundHistoryStore.lastRound;

            //Assert
            expect(round).toEqual(expectedObj);
        });

        it("when resultHash is null", () => {
            //Arrange
            const resultData = {
                result: 2.3,
            };
            Object.defineProperty(roundStore, "resultHash", { value: null, configurable: true, writable: true });
            Object.defineProperty(roundStore, "clientRoundId", { value: 2, configurable: true, writable: true });
            Object.defineProperty(settlementStore, "currentFinish", { value: resultData, configurable: true, writable: true });
            const expectedObj = {
                md5Result: {},
                result: 2.3,
                roundId: 2,
                settlementResult: {},
            };

            //Act
            const round = crashRoundHistoryStore.lastRound;

            //Assert
            expect(round).toEqual(expectedObj);
        });
    });

    describe("increaseStatus", () => {
        it("when roundIndex greater than 0", () => {
            //Arrange
            md5PopupStore.roundId = 1;

            //Act
            const status = crashRoundHistoryStore.increaseStatus;

            //Assert
            expect(status).toBeTruthy();
        });

        it("when roundIndex equal -1", () => {
            //Arrange
            md5PopupStore.roundId = 4;

            //Act
            const status = crashRoundHistoryStore.increaseStatus;

            //Assert
            expect(status).toBeTruthy();
        });

        it("when roundIndex equal 0", () => {
            //Arrange
            md5PopupStore.roundId = 2;

            //Act
            const status = crashRoundHistoryStore.increaseStatus;

            //Assert
            expect(status).toBeFalsy();
        });
    });

    describe("decreaseStatus", () => {
        it("when roundIndex equal -1", () => {
            //Arrange
            md5PopupStore.roundId = 4;

            //Act

            //Assert
            expect(crashRoundHistoryStore.decreaseStatus).toEqual(false);
        });

        it("when roundIndex equal 0", () => {
            //Arrange
            md5PopupStore.roundId = 2;

            //Act

            //Assert
            expect(crashRoundHistoryStore.decreaseStatus).toEqual(true);
        });
    });
});
