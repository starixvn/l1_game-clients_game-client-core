import { NotificationReloadHandlers } from "../../../src/notification";
import { NoticeStore } from "../../../src/game/notices";
import { NotificationServiceMessage } from "../../../src/shared";

jest.mock("../../../src/shared/utils/localization-manager", () => {
    return {
        Translator: { translate: jest.fn(), gameTranslate: jest.fn(), commonTranslate: jest.fn() },
    };
});

describe("NotificationReloadHandlers", () => {
    describe("NotificationReload", () => {
        let noticeStore: NoticeStore;
        let handler: NotificationReloadHandlers.NotificationReload;        

        it("has name is equal reloadEventName", () => {
            // arrange
            noticeStore = new NoticeStore();
            
            handler = new NotificationReloadHandlers.NotificationReload(noticeStore);

            // assert
            expect(handler.name).toEqual(NotificationServiceMessage.reloadEventName);
        });

        describe("handle", () => {           
            it("should call add notice", () => {
                // arrange
                noticeStore = new NoticeStore();
                let calledArgs;
                jest.spyOn(noticeStore, "addNotice").mockImplementation((args) => (calledArgs = args)); 

                handler = new NotificationReloadHandlers.NotificationReload(noticeStore);

                // act
                handler.handle();

                // assert
                expect(calledArgs.message).toBe('newUpdateAvailable');
                expect(calledArgs.title).toBe('notice');
                expect(calledArgs.type).toBe(0);
            });
        });
    });
});
