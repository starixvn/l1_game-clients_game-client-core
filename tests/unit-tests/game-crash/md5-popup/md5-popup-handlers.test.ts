import { stub } from "jest-auto-stub";

import { Md5PopupHandler } from "../../../../src/game-crash/md5-popup/md5-popup-handlers";
import { Md5PopupStore } from "../../../../src/game-crash/md5-popup/md5-popup-store";

describe("Md5PopupHandler", () => {
    let md5PopupHandler: Md5PopupHandler;
    let md5PopupStore: Md5PopupStore;

    beforeAll(() => {
        md5PopupStore = stub<Md5PopupStore>();
    });

    beforeEach(() => {
        md5PopupHandler = new Md5PopupHandler(md5PopupStore);
    });

    describe("setDisplayPopupMd5", () => {
        it("should update isOpenPopupMd5", async () => {
            // Arrange
            const isShow = false;

            // Act
            md5PopupHandler.setDisplayPopupMd5(isShow);

            // Assert
            expect(md5PopupHandler["md5PopupStore"].isOpenPopupMd5).toEqual(false);
        });
    });

    describe("handleMd5Popup", () => {
        beforeEach(() => {
            md5PopupHandler.setDisplayPopupMd5 = jest.fn();
        });

        it("should update setDisplayPopupMd5", async () => {
            // Arrange
            const info = { isOpenPopupMd5: true, roundId: 100 };

            // Act
            md5PopupHandler.handleMd5Popup(info);

            // Assert
            expect(md5PopupHandler.setDisplayPopupMd5).toBeCalled();
        });

        it("should update roundId", async () => {
            // Arrange
            const info = { isOpenPopupMd5: true, roundId: 100 };

            // Act
            md5PopupHandler.handleMd5Popup(info);

            // Assert
            expect(md5PopupHandler["md5PopupStore"].roundId).toEqual(info.roundId);
        });
    });

    describe("quickChangeRoundIndex", () => {
        beforeEach(() => {
            md5PopupHandler["md5PopupStore"].roundId = 10;
        });

        describe("when increasing", () => {
            it("should increase roundId by 1", async () => {
                // Arrange
                const isIncrease = true;

                // Act
                md5PopupHandler.quickChangeRoundIndex(isIncrease);

                // Assert
                expect(md5PopupHandler["md5PopupStore"].roundId).toEqual(11);
            });
        });

        describe("when decreasing round", () => {
            it("should decrease roundId by 1", async () => {
                // Arrange
                const isIncrease = false;

                // Act
                md5PopupHandler.quickChangeRoundIndex(isIncrease);

                // Assert
                expect(md5PopupHandler["md5PopupStore"].roundId).toEqual(9);
            });
        });
    });
});
