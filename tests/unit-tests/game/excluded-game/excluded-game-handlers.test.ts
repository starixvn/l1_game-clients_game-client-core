import { AppHandlers } from "../../../../src/app";
import { AppStore } from "../../../../src/app/app-store";
import { NoticeStore } from "../../../../src/game/notices";
import { gameSettings } from "../../container.test";
import { NoPermissionHandlers } from "../../../../src/game/excluded-game";
import { GameServiceMessage } from "../../../../src/shared";
import { PlayerSelectionHandlers } from "../../../../src/game/player-selections";
import { PlayerSelectionStore } from "../../../../src/game/player-selections";

jest.mock("../../../../src/shared/utils/localization-manager", () => {
    return {
        Translator: {
            translate: jest.fn(), gameTranslate: jest.fn(), commonTranslate: jest.fn().mockImplementation((key, option) => key)
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
        backToOperatorLobby = new AppHandlers.BackToOperatorLobby(new AppStore(), new PlayerSelectionHandlers.ClearHandlers(new PlayerSelectionStore()));

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
            backToOperatorLobby = new AppHandlers.BackToOperatorLobby(new AppStore(),  new PlayerSelectionHandlers.ClearHandlers(new PlayerSelectionStore()));
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
            expect(calledArgs.message).toBe('game_excluded');
            expect(calledArgs.title).toBe('notice');
            expect(calledArgs.type).toBe(0);
            calledArgs.onClose();
            expect(backToOperatorLobby.handle).toBeCalled();
        })       
    });
});
