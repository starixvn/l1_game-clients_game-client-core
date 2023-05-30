import { stub } from "jest-auto-stub";
import { NoticeHandlers, NoticeStore } from "../../../../src/game/notices";
import { RoundStore } from "../../../../src/game/rounds/round-store";
import { GameServiceMessage } from "../../../../src/shared";
jest.mock("../../../../src/shared/l10n", () => ({
    l10n: {
        t: jest.fn()
    },
}));

describe("NoticeHandlers test", () => {
    let instance: NoticeHandlers;
    let roundStore: RoundStore;
    let noticeStore: NoticeStore;
    beforeAll(() => {
        roundStore = stub<RoundStore>();
        noticeStore = stub<NoticeStore>();
        instance = new NoticeHandlers(roundStore, noticeStore);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("handleNotice", () => {
        it("do nothing, when notice data does not contain gameRoundId", () => {
            // Arrange
            const data = stub<GameServiceMessage.Notice>();
            delete data.gameRoundId;

            // Act
            instance.handleNotice(data);

            // Assert
            expect(noticeStore.addWarning).not.toBeCalled();
        });

        it("do nothing, when notice data contain gameRoundId, but not equal current round id", () => {
            // Arrange
            const data = stub<GameServiceMessage.Notice>();
            data.gameRoundId = 1;
            roundStore.roundId = 2;

            // Act
            instance.handleNotice(data);

            // Assert
            expect(noticeStore.addWarning).not.toBeCalled();
        });

        it("show warning, when notice data contain gameRoundId, and equal current round id", () => {
            // Arrange
            const data = stub<GameServiceMessage.Notice>({
                hedgeBetGroup: [],
                errorCode: "1001",
            });
            data.gameRoundId = 1;
            roundStore.roundId = 1;

            // Act
            instance.handleNotice(data);

            // Assert
            expect(noticeStore.addWarning).toBeCalled();
        });
    });
});
