import { NoticeStore } from "../../../../src/game/notice/notice-store";

describe("NoticeStore test", () => {
    let store: NoticeStore;
    beforeEach(() => {
        store = new NoticeStore();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("init default values", () => {
        it("warning equal null", () => {
            // Arrange

            // Act
            const betStore = new NoticeStore();

            // Assert
            expect(betStore.warning).toEqual(null);
        });
        it("notice equal null", () => {
            // Arrange

            // Act
            const betStore = new NoticeStore();

            // Assert
            expect(betStore.notice).toEqual(null);
        });
    });

    describe("addWarning function", () => {
        it("should add a warning message to the object", () => {
            // Arrange
            const sampleMessage = "This is a warning message";

            // Act
            store.addWarning(sampleMessage);

            // Assert
            expect(store.warning.message).toBe(sampleMessage);
        });
    });

    describe("addNotice function", () => {
        it("should add a notice to the object", () => {
            // Arrange
            const sample = { message: "test warning", title: "test warning", type: 1, onClose: () => {} };

            // Act
            store.addNotice(sample);

            // Assert
            expect(store.notice.message).toEqual(sample.message);
            expect(store.notice.title).toEqual(sample.title);
            expect(store.notice.type).toEqual(sample.type);
        });
    });
});
