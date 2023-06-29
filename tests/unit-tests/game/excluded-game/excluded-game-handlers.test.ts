import { AppHandlers } from "../../../../src/app";
import { AppStore } from "../../../../src/app/app-store";
import { NoticeStore } from "../../../../src/game/notices";
import { gameSettings } from "../../container.test";
import { NoPermissionHandlers } from "../../../../src/game/excluded-game";
import { GameServiceMessage } from "../../../../src/shared";

jest.mock("../../../../src/shared/utils/localized-utils", () => {
    return {
        LocalizedUtils: {
            getLocalizedText: jest.fn().mockImplementation((key, option) => key),
        },
    };
});

describe("ExcludedGameHandlers tests", () => {  
    let noticeStore: NoticeStore,
        backToOperatorLobby: AppHandlers.BackToOperatorLobby,
        handler: NoPermissionHandlers; 
    
    it("has name is equal notpermitted", () => {
        // arrange
        noticeStore = new NoticeStore();
        backToOperatorLobby = new AppHandlers.BackToOperatorLobby(new AppStore());

        handler = new NoPermissionHandlers(
            noticeStore,
            gameSettings,
            backToOperatorLobby,            
        );      

        // assert
        expect(handler.name).toEqual(GameServiceMessage.notPermittedToPlay);
    });
   
    describe("handle", () => {
        test("should add notice", () => {
            // arrange
            noticeStore = new NoticeStore();
            backToOperatorLobby = new AppHandlers.BackToOperatorLobby(new AppStore());
            backToOperatorLobby.handle = jest.fn();

            handler = new NoPermissionHandlers(
                noticeStore,
                gameSettings,
                backToOperatorLobby,            
            );            

            let calledArgs;
            jest.spyOn(noticeStore, "addNotice").mockImplementation((args) => (calledArgs = args));

            // act
            handler.handle();

            // assert
            expect(calledArgs.message).toBe('gameExcluded');
            expect(calledArgs.title).toBe('notice');
            expect(calledArgs.type).toBe(0);
            calledArgs.onClose();
            expect(backToOperatorLobby.handle).toBeCalled();
        })       
    });
});
